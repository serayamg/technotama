import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'rti-super-secret-key-32-chars-long';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, captchaAnswer, captchaInput } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // CAPTCHA verification (spam & brute force protection)
    if (captchaAnswer !== undefined && captchaInput !== undefined) {
      if (parseInt(captchaAnswer) !== parseInt(captchaInput)) {
        return NextResponse.json(
          { error: 'Captcha verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Lookup user in DB
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Return generic error message to prevent username enumeration
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify Password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company || null
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Set cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company || null
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'rti_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2 // 2 hours
    });

    console.log(`[AUDIT LOG] User logged in successfully: email=${user.email} role=${user.role}`);

    return response;
  } catch (err: any) {
    console.error('[API ERROR] Login failed:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
