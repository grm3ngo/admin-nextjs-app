import { NextRequest, NextResponse } from 'next/server';

const protectedApiRoutes = ['/api/admins', '/api/dashboard'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedApi = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedApi) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admins')) {
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admins/:path*',
    '/api/dashboard/:path*',
    '/dashboard/:path*',
    '/admins/:path*',
  ],
};
