import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { generateTTSAudio, saveWaveFile } from '@/lib/tts';
import { generateUUID } from '@/lib/utils';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, segmentId, voiceName } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Use provided segment ID or generate a new one
    const audioId = segmentId || generateUUID();
    
    console.log(`Generating TTS audio for segment: ${audioId} with voice: ${voiceName || 'Enceladus'}`);
    
    // Ensure segments directory exists
    const segmentsDir = path.join(process.cwd(), 'public', 'segments');
    await fs.mkdir(segmentsDir, { recursive: true });
    
    // Generate the audio
    const audioBuffer = await generateTTSAudio(text, voiceName || 'Enceladus');
    
    // Save the audio file
    const outputPath = path.join(segmentsDir, `${audioId}.wav`);
    await saveWaveFile(outputPath, audioBuffer);
    
    const audioUrl = `/segments/${audioId}.wav`;
    
    return NextResponse.json({
      audioUrl,
      segmentId: audioId,
      success: true
    });
    
  } catch (error) {
    console.error('Segment TTS generation error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('quota exceeded') || error.message.includes('Too Many Requests')) {
        return NextResponse.json({
          error: 'TTS API rate limit exceeded',
          details: 'Rate limit reached. Please wait before generating more segments.',
          retryAfter: 30000
        }, { status: 429 });
      }
      
      if (error.message.includes('No audio data received')) {
        return NextResponse.json({
          error: 'TTS service unavailable',
          details: 'Unable to generate audio at this time'
        }, { status: 503 });
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json({
          error: 'TTS configuration error',
          details: 'TTS service is not properly configured'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      error: 'Failed to generate segment audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
