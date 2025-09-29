import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { generateCustomItem } from '@/ai/custom-item-actions';
import type { GenerateCustomItemRequest } from '@/lib/video-script-constants';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: GenerateCustomItemRequest = await req.json();
    
    // Validate required fields
    if (!body.prompt || !body.type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      );
    }

    if (!['hook', 'contentType'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either "hook" or "contentType"' },
        { status: 400 }
      );
    }

    // Validate category for content types
    if (body.type === 'contentType' && !body.category) {
      return NextResponse.json(
        { error: 'Category is required for content types' },
        { status: 400 }
      );
    }

    // Generate the custom item using AI
    const result = await generateCustomItem(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Generation failed' },
        { status: 500 }
      );
    }

    // Return the generated item
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}