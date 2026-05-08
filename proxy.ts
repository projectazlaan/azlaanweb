import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = process.env.ADMIN_COOKIE_NAME ?? 'azlaan_admin_session';
const PROTECTED_PREFIX = '/admin/super-easy-dashboard';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect super-easy-dashboard routes
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const session = request.cookies.get(ADMIN_COOKIE);
    if (!session?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/super-easy-dashboard/:path*'],
};
