import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, AdminResponse } from '@/app/types';
import { getAuthenticatedAdmin, unauthorizedResponse } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Dùng helper thay vì check thủ công
    const admin = await getAuthenticatedAdmin(request);
    
    if (!admin) {
      return unauthorizedResponse();
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