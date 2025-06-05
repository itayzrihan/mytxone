import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { generateMeditationAudio } from '@/lib/tts';
import { generateUUID } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const { content, meditationId, voiceName } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Use provided meditation ID or generate a new one
    const audioId = meditationId || generateUUID();
    
    console.log(`Generating TTS audio for meditation: ${audioId} with voice: ${voiceName || 'default'}`);
    
    // Generate the meditation audio
    const { audioUrl, segments } = await generateMeditationAudio(content, audioId, voiceName);
    
    return NextResponse.json({
      audioUrl,
      segments,
      meditationId: audioId,
      success: true
    });
    
  } catch (error) {
    console.error('TTS generation error:', error);
      // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('No timestamped segments')) {
        return NextResponse.json({
          error: 'Invalid meditation format - no timestamps found',
          details: 'Meditation content must include timestamps like [00:00] at the beginning of each line'
        }, { status: 400 });
      }
      
      if (error.message.includes('quota exceeded') || error.message.includes('Too Many Requests')) {
        return NextResponse.json({
          error: 'TTS API rate limit exceeded',
          details: 'You\'ve reached the free tier limit. Please wait and try again, or consider upgrading your plan for higher limits.',
          retryAfter: 60000 // Suggest retry after 1 minute
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
      error: 'Failed to generate meditation audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const meditationId = searchParams.get('id');
    
    if (!meditationId) {
      return NextResponse.json({ error: 'Meditation ID is required' }, { status: 400 });
    }

    // Check if audio file exists
    const audioUrl = `/meditations/${meditationId}.wav`;
    
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', 'meditations', `${meditationId}.wav`);
      await fs.access(filePath);
      
      return NextResponse.json({
        audioUrl,
        exists: true,
        meditationId
      });
    } catch {
      return NextResponse.json({
        exists: false,
        meditationId
      });
    }
    
  } catch (error) {
    console.error('TTS check error:', error);
    return NextResponse.json({
      error: 'Failed to check audio status'
    }, { status: 500 });
  }
}
