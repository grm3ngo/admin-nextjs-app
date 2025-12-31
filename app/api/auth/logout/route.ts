import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/app/services';
import { ApiResponse } from '@/app/types';
import { getAuthenticatedAdmin, unauthorizedResponse } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra đã đăng nhập chưa
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      await deleteSession(token);
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
