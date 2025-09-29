import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import type { GenerateCustomItemRequest } from '@/lib/video-script-constants';

// Schema for hook generation
const hookSchema = z.object({
  value: z.string().describe('URL-friendly identifier (lowercase, hyphenated)'),
  label: z.string().describe('Human-readable name for the hook'),
  description: z.string().describe('Clear explanation of when and how to use this hook'),
  example: z.string().describe('Specific example sentence or phrase using this hook'),
  structure: z.string().describe('Template or format showing how to construct content with this hook')
});

// Schema for content type generation
const contentTypeSchema = z.object({
  value: z.string().describe('URL-friendly identifier (lowercase, hyphenated)'),
  label: z.string().describe('Human-readable name for the content type'),
  description: z.string().describe('Clear explanation of what this content type is about'),
  example: z.string().describe('Specific example title or content using this type'),
  structure: z.string().describe('Step-by-step format or template for creating this content type'),
  category: z.string().describe('Category this content type belongs to')
});

export async function generateCustomItem(request: GenerateCustomItemRequest) {
  try {
    const isHook = request.type === 'hook';
    const schema = isHook ? hookSchema : contentTypeSchema;
    
    // Build the system prompt based on type
    const systemPrompt = isHook ? `
You are an expert at creating engaging video script hooks that capture attention and drive engagement. 
A hook is the opening line or approach that grabs viewers' attention in the first few seconds.

Create a hook that is:
- Attention-grabbing and curiosity-inducing
- Clear and specific in its purpose
- Actionable with a defined structure
- Professional yet engaging
- Unique and memorable

The hook should be versatile enough to work across different topics while maintaining its core effectiveness.
    ` : `
You are an expert at creating video content types that help creators structure their content effectively.
A content type is a specific format or approach for organizing and presenting information in videos.

Create a content type that is:
- Clear in its purpose and use cases
- Structured with actionable steps
- Engaging for the target audience
- Professional and effective
- Specific enough to guide content creation

The content type should fit well within the "${request.category}" category and provide real value to content creators.
    `;

    const userPrompt = isHook ? `
Create a custom video hook based on this request: "${request.prompt}"

The hook should include:
- A catchy, memorable label
- A clear description of when to use it
- A specific example of the hook in action
- A structure template showing how to use it

Make it professional, engaging, and actionable.
    ` : `
Create a custom video content type based on this request: "${request.prompt}"

The content type should include:
- A descriptive, professional label
- A clear explanation of what it's about
- A specific example title or content piece
- A detailed structure showing how to create this type of content
- It should fit in the "${request.category}" category

Make it practical, actionable, and valuable for content creators.
    `;

    const result = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    return {
      success: true,
      data: result.object,
    };
  } catch (error) {
    console.error('Error generating custom item:', error);
    return {
      success: false,
      error: 'Failed to generate custom item. Please try again.',
    };
  }
}