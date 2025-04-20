import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compareSync } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import { getUser } from '@/db/queries';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Ensure you have JWT_SECRET set in your environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const [user] = await getUser(validatedData.email);

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = compareSync(validatedData.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      // Add any other relevant non-sensitive user data
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET as string, {
      expiresIn: '1h', // Token expiration time (e.g., 1 hour)
    });

    return NextResponse.json({ token });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}