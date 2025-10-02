import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { checkIfUserIsAdmin } from '@/db/queries';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { isAdmin: false },
        { status: 200 }
      );
    }

    // Check admin status
    const isAdmin = await checkIfUserIsAdmin(session.user.id);
    
    return NextResponse.json(
      { isAdmin },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in /api/auth/admin-status:', error);
    return NextResponse.json(
      { isAdmin: false },
      { status: 200 }
    );
  }
}

// Prevent other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}