import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  const headers = response.headers

  // Prevent XSS attacks
  headers.set('X-XSS-Protection', '1; mode=block')
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME-sniffing
  headers.set('X-Content-Type-Options', 'nosniff')
  
  // Control referrer information
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Enforce HTTPS (HSTS) - 1 year
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Content Security Policy (CSP)
  // Note: 'unsafe-eval' and 'unsafe-inline' are often needed for Next.js dev mode/libraries. 
  // In strict production, these should be removed or managed with nonces.
  const isDev = process.env.NODE_ENV === 'development'
  
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.unsplash.com;
    font-src 'self';
    connect-src 'self' https://*.supabase.co ${isDev ? 'ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:*' : ''};
    frame-ancestors 'none';
  `
  headers.set('Content-Security-Policy', csp.replace(/\s{2,}/g, ' ').trim())

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
