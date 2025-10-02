import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { checkIfUserIsAdmin, updateUserSubscription, getUserById } from '@/db/queries';
import { z } from 'zod';

// Input validation schema
const updateSubscriptionSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  subscription: z.enum(['free', 'basic', 'pro'], {
    required_error: 'Subscription is required',
    invalid_type_error: 'Subscription must be "free", "basic", or "pro"'
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
    const validationResult = updateSubscriptionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { userId, subscription } = validationResult.data;

    // Verify target user exists
    const targetUser = await getUserById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user's subscription
    const updatedUser = await updateUserSubscription(userId, subscription);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user subscription' },
        { status: 500 }
      );
    }

    // Log the subscription change for security audit
    console.log(`Admin ${session.user.email} (${session.user.id}) changed subscription of user ${targetUser.email} (${userId}) from ${targetUser.subscription} to ${subscription}`);
    
    return NextResponse.json(
      { 
        message: 'User subscription updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in /api/admin/update-subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to update subscriptions.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to update subscriptions.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}