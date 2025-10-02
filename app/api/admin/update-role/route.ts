import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { checkIfUserIsAdmin, updateUserRole, getUserById } from '@/db/queries';
import { z } from 'zod';

// Input validation schema
const updateRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  role: z.enum(['user', 'admin'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be either "user" or "admin"'
  })
});

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Admin authorization check
    const isAdmin = await checkIfUserIsAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required. This incident has been logged.' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateRoleSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { userId, role } = validationResult.data;

    // Security check: Prevent self-demotion from admin
    if (userId === session.user.id && role === 'user') {
      return NextResponse.json(
        { error: 'You cannot demote yourself from admin role' },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await getUserById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user's role
    const updatedUser = await updateUserRole(userId, role);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      );
    }

    // Log the role change for security audit
    console.log(`Admin ${session.user.email} (${session.user.id}) changed role of user ${targetUser.email} (${userId}) from ${targetUser.role} to ${role}`);
    
    return NextResponse.json(
      { 
        message: 'User role updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in /api/admin/update-role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to update roles.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to update roles.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}