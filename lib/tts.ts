import { GoogleGenAI } from '@google/genai';
import { FileWriter } from 'wav';
import { promises as fs } from 'fs';
import path from 'path';

// Initialize Google GenAI client
const genai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '' 
});

export interface MeditationSegment {
  timestamp: string;
  text: string;
  timing: number; // in seconds
}

/**
 * Parse meditation content with timestamps into segments
 */
export function parseMeditationContent(content: string): MeditationSegment[] {
  const lines = content.split('\n').filter(line => line.trim());
  const segments: MeditationSegment[] = [];
  
  for (const line of lines) {
    const timestampMatch = line.match(/\[(\d{2}):(\d{2})\]\s*(.+)/);
    if (timestampMatch) {
      const [, minutes, seconds, text] = timestampMatch;
      const timing = parseInt(minutes) * 60 + parseInt(seconds);
      segments.push({
        timestamp: `${minutes}:${seconds}`,
        text: text.trim(),
        timing
      });
    }
  }
  
  return segments;
}

/**
 * Save WAV file from PCM data
 */
export async function saveWaveFile(
  filename: string,
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2,
): Promise<void> {
  return new Promise((resolve, reject) => {
  const writer = new FileWriter(filename, {
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    writer.on('finish', resolve);
    writer.on('error', reject);

    writer.write(pcmData);
    writer.end();
  });
}

/**
 * Generate audio for a single text segment using Gemini TTS
 */
export async function generateTTSAudio(text: string, voiceName: string = 'Enceladus'): Promise<Buffer> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Generating TTS for text: "${text.substring(0, 50)}..." with voice: ${voiceName} (attempt ${attempt}/${maxRetries})`);
      
      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in a calm, soothing meditation voice: ${text}` }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }, // Use provided voice name
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) {
        throw new Error('No audio data received from Gemini TTS - check your API key and model access');
      }

      const audioBuffer = Buffer.from(audioData, 'base64');
      console.log(`Generated ${audioBuffer.length} bytes of audio data on attempt ${attempt}`);
      return audioBuffer;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`TTS attempt ${attempt}/${maxRetries} failed:`, lastError.message);
      
      if (error instanceof Error) {
        // Handle quota/rate limit errors with exponential backoff
        if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
          if (attempt < maxRetries) {
            const delay = Math.min(30000, Math.pow(2, attempt) * 5000); // 5s, 10s, 20s, max 30s
            console.log(`Rate limit hit, waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            throw new Error('TTS API quota exceeded - please try again later or upgrade your plan');
          }
        }
        
        // Handle other specific errors
        if (error.message.includes('API key')) {
          throw new Error('Invalid or missing Google API key for TTS generation');
        }
        if (error.message.includes('model')) {
          throw new Error('TTS model not available - check if you have access to gemini-2.5-flash-preview-tts');
        }
      }
      
      // For non-quota errors, don't retry
      if (attempt === 1) {
        throw lastError;
      }
    }
  }
  
  throw lastError || new Error('Failed to generate TTS audio after multiple attempts');
}

/**
 * Generate audio files for all meditation segments
 */
export async function generateMeditationAudioSegments(
  segments: MeditationSegment[],
  outputDir: string,
  voiceName: string = 'Enceladus'
): Promise<string[]> {
  const audioFiles: string[] = [];
  
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const filename = path.join(outputDir, `segment_${i.toString().padStart(3, '0')}.wav`);
    
    try {
      console.log(`Generating audio for segment ${i + 1}/${segments.length}: ${segment.timestamp}`);
      
      // Add delay between requests to respect rate limits (free tier: 3 requests/minute)
      if (i > 0) {
        const delay = 22000; // 22 seconds between requests (conservative for 3/minute)
        console.log(`Waiting ${delay}ms to respect rate limits...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const audioBuffer = await generateTTSAudio(segment.text, voiceName);
      await saveWaveFile(filename, audioBuffer);
      audioFiles.push(filename);
      
    } catch (error) {
      console.error(`Failed to generate audio for segment ${i}:`, error);
      throw error;
    }
  }
  
  return audioFiles;
}

/**
 * Create silence buffer for timing gaps
 */
function createSilenceBuffer(durationSeconds: number, sampleRate = 24000): Buffer {
  const samples = Math.floor(durationSeconds * sampleRate);
  const bytes = samples * 2; // 16-bit audio = 2 bytes per sample
  return Buffer.alloc(bytes, 0);
}

/**
 * Combine audio segments with proper timing
 */
export async function combineAudioSegments(
  segments: MeditationSegment[],
  audioFiles: string[],
  outputPath: string
): Promise<void> {
  const combinedAudio: Buffer[] = [];
  const sampleRate = 24000;
  let currentTime = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const targetTime = segment.timing;
    
    // Add silence to reach the target timestamp
    if (targetTime > currentTime) {
      const silenceDuration = targetTime - currentTime;
      const silenceBuffer = createSilenceBuffer(silenceDuration, sampleRate);
      combinedAudio.push(silenceBuffer);
      currentTime = targetTime;
    }
    
    // Read and add the audio segment
    try {
      const audioData = await fs.readFile(audioFiles[i]);
      // Skip WAV header (44 bytes) to get raw PCM data
      const pcmData = audioData.slice(44);
      combinedAudio.push(pcmData);
      
      // Estimate duration based on file size (rough approximation)
      const estimatedDuration = pcmData.length / (sampleRate * 2); // 16-bit = 2 bytes per sample
      currentTime += estimatedDuration;
    } catch (error) {
      console.error(`Failed to read audio file ${audioFiles[i]}:`, error);
      throw error;
    }
  }
  
  // Combine all buffers
  const finalBuffer = Buffer.concat(combinedAudio);
  
  // Save as WAV file
  await saveWaveFile(outputPath, finalBuffer, 1, sampleRate, 2);
}

/**
 * Generate complete meditation audio with timing
 */
export async function generateMeditationAudio(
  content: string,
  meditationId: string,
  voiceName: string = 'Enceladus'
): Promise<{ audioUrl: string; segments: MeditationSegment[] }> {
  const segments = parseMeditationContent(content);
  
  if (segments.length === 0) {
    throw new Error('No timestamped segments found in meditation content');
  }
  
  const tempDir = path.join(process.cwd(), 'public', 'temp', 'audio', meditationId);
  const outputPath = path.join(process.cwd(), 'public', 'meditations', `${meditationId}.wav`);
  
  // Ensure meditations directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  try {
    // Generate individual audio segments
    const audioFiles = await generateMeditationAudioSegments(segments, tempDir, voiceName);
    
    // Combine segments with proper timing
    await combineAudioSegments(segments, audioFiles, outputPath);
    
    // Clean up temporary files
    for (const file of audioFiles) {
      try {
        await fs.unlink(file);
      } catch (error) {
        console.warn(`Failed to delete temp file ${file}:`, error);
      }
    }
    
    // Clean up temp directory
    try {
      await fs.rmdir(tempDir, { recursive: true });
    } catch (error) {
      console.warn(`Failed to delete temp directory ${tempDir}:`, error);
    }
    
    const audioUrl = `/meditations/${meditationId}.wav`;
    return { audioUrl, segments };
    
  } catch (error) {
    // Clean up on error
    try {
      await fs.rmdir(tempDir, { recursive: true });
    } catch (cleanupError) {
      console.warn('Failed to clean up temp directory:', cleanupError);
    }
    
    throw error;
  }
}
