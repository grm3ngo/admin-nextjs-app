import { NextRequest, NextResponse } from 'next/server';
import { getAdminByEmail, verifyPassword } from '@/app/services/admin.services';
import { createSession } from '@/app/services/session.services';
import { ApiResponse } from '@/app/types';

export async function POST(request: NextRequest) { // thuc hien login
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email và password là bắt buộc' },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(email, password); //kiem tra email va password
    if (!isValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email hoặc password không đúng' },
        { status: 401 }
      );
    }
    const admin = await getAdminByEmail(email); //lay thong tin admin theo email
    if (!admin || admin.status !== 'ACTIVE') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Tài khoản bị khóa' },
        { status: 403 }
      );
    }

    const session = await createSession(admin.id); //tao session moi

    return NextResponse.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          status: admin.status,
        },
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}