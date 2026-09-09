import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'Technotama-super-secret-key-32-chars-long';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('technotama_session')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        name: string;
        role: string;
        company: string | null;
      };

      return NextResponse.json(
        {
          authenticated: true,
          user: {
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            company: decoded.company
          }
        },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid or expired session token.' },
        { status: 401 }
      );
    }
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch auth status:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
