import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Security Headers (Keep existing ones)
  const headers = response.headers
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

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

  // Refresh session and check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  // Note: App labels (dashboard), vehicles, rentals, etc. are under standard paths or group paths.
  // The matcher handles most of this, but we explicitly check here.
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  const isProtectedRoute = !isAuthPage

  if (!user && isProtectedRoute) {
    // Not logged in, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    // Already logged in, redirect to home
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

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
