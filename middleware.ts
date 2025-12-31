import { NextRequest, NextResponse } from 'next/server';

// Các routes cần xác thực
const protectedApiRoutes = ['/api/admins', '/api/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Chỉ check các API routes được bảo vệ
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

    // Token validation sẽ được thực hiện trong route handlers
    // vì middleware không thể truy cập database trực tiếp (Edge Runtime)
  }

  // Protect dashboard pages - redirect to login if no token cookie
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admins')) {
    // Client-side sẽ check token từ localStorage
    // Server check sẽ được thực hiện trong layout
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API routes
    '/api/admins/:path*',
    '/api/dashboard/:path*',
    // Dashboard pages
    '/dashboard/:path*',
    '/admins/:path*',
  ],
};
