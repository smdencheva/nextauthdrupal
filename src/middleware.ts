import {
  withMiddlewareAuthRequired,
} from '@auth0/nextjs-auth0/edge';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
const anonUrls = ['/sign-up'];

// Middleware function to handle authentication
export default async function middleware(req: NextRequest, ev: NextFetchEvent) {

  if (req.nextUrl.pathname && anonUrls.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Otherwise, enforce authentication using Auth0
  const authMiddleware = withMiddlewareAuthRequired(
    async function middlewareHandler(req: NextRequest) {
      const res = NextResponse.next();
    },
  );

  return authMiddleware(req, ev);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|Brand-Default.svg).*)',
  ],
};
