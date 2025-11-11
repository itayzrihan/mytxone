import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getUserById } from '@/db/queries';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      subscription: user.subscription,
      email: user.email,
      userId: user.id,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.subscription !== 'free',
    });
  } catch (error) {
    console.error('Error checking user subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}