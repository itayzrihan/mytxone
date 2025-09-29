import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { 
  getCustomContentTypesByUserId, 
  createCustomContentType,
  updateCustomContentType,
  deleteCustomContentType,
  getCustomContentTypeById 
} from '@/db/custom-items-queries';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get custom content types for the user (includes their own + public ones)
    const customContentTypes = await getCustomContentTypesByUserId(session.user.id);
    
    return NextResponse.json({ customContentTypes });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { value, label, description, example, structure, category, isPublic } = await req.json();
    
    // Validate required fields
    if (!value || !label || !description || !example || !structure || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create the custom content type
    const customContentType = await createCustomContentType({
      userId: session.user.id,
      value,
      label,
      description,
      example,
      structure,
      category,
      isPublic: isPublic ?? false,
    });

    return NextResponse.json({ customContentType });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { id, value, label, description, example, structure, category, isPublic } = await req.json();
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Content type ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingContentType = await getCustomContentTypeById(id);
    if (!existingContentType || existingContentType.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Content type not found or not owned by user' },
        { status: 404 }
      );
    }

    // Update the custom content type
    const customContentType = await updateCustomContentType({
      id,
      userId: session.user.id,
      value,
      label,
      description,
      example,
      structure,
      category,
      isPublic,
    });

    return NextResponse.json({ customContentType });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get content type ID from URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Content type ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingContentType = await getCustomContentTypeById(id);
    if (!existingContentType || existingContentType.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Content type not found or not owned by user' },
        { status: 404 }
      );
    }

    // Delete the custom content type
    await deleteCustomContentType(id, session.user.id);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}