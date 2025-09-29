import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { 
  getCustomHooksByUserId, 
  createCustomHook,
  updateCustomHook,
  deleteCustomHook,
  getCustomHookById 
} from '@/db/custom-items-queries';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get custom hooks for the user (includes their own + public ones)
    const customHooks = await getCustomHooksByUserId(session.user.id);
    
    return NextResponse.json({ customHooks });
    
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
    const { value, label, description, example, structure, isPublic } = await req.json();
    
    // Validate required fields
    if (!value || !label || !description || !example || !structure) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create the custom hook
    const customHook = await createCustomHook({
      userId: session.user.id,
      value,
      label,
      description,
      example,
      structure,
      isPublic: isPublic ?? false,
    });

    return NextResponse.json({ customHook });
    
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
    const { id, value, label, description, example, structure, isPublic } = await req.json();
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Hook ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingHook = await getCustomHookById(id);
    if (!existingHook || existingHook.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Hook not found or not owned by user' },
        { status: 404 }
      );
    }

    // Update the custom hook
    const customHook = await updateCustomHook({
      id,
      userId: session.user.id,
      value,
      label,
      description,
      example,
      structure,
      isPublic,
    });

    return NextResponse.json({ customHook });
    
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

    // Get hook ID from URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Hook ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingHook = await getCustomHookById(id);
    if (!existingHook || existingHook.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Hook not found or not owned by user' },
        { status: 404 }
      );
    }

    // Delete the custom hook
    await deleteCustomHook(id, session.user.id);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}