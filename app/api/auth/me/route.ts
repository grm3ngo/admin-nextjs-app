import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '@/app/services/session.services';
import { getAdminById } from '@/app/services/admin.services';
import { ApiResponse, AdminResponse } from '@/app/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Token không tồn tại' },
        { status: 401 }
      );
    }

    const session = await getSessionByToken(token);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Token hết hạn hoặc không hợp lệ' },
        { status: 401 }
      );
    }

    const admin = await getAdminById(session.adminId);
    if (!admin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Admin không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<AdminResponse>>({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}