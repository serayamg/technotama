import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'Technotama-super-secret-key-32-chars-long';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  company: string | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('technotama_session')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (err) {
    return null;
  }
}

export function isAdmin(role: string): boolean {
  return role === 'ADMIN' || role === 'ADMIN_SALES' || role === 'ADMIN_CUSTOMER_CARE';
}
