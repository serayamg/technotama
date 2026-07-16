import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Content Security Policy (CSP) - Mitigates XSS & Injection Attacks
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wa.me https://*.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' data: https://fonts.gstatic.com;
    img-src 'self' data: https://wa.me;
    connect-src 'self';
    frame-ancestors 'none';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. Strict-Transport-Security (HSTS) - Enforces HTTPS only
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // 3. X-Frame-Options - Prevents Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // 4. X-Content-Type-Options - Prevents MIME-type Sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 5. Referrer-Policy - Controls how much referrer info is sent
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Permissions-Policy - Blocks access to browser APIs (camera, mic)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // 7. Security audit trails for API requests
  const path = request.nextUrl.pathname;
  if (path.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    console.log(`[SECURITY SCAN] API request: path=${path} ip=${ip} method=${request.method}`);
  }

  return response;
}

// Apply middleware to all routes except assets and system files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|vercel.svg|next.svg|uploads/|orders/).*)',
  ],
};
