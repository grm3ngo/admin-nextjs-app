import { NextRequest, NextResponse } from 'next/server';
import { getAllAdmins, createAdmin, getAdminByEmail } from '@/app/services/admin.services';
import { ApiResponse } from '@/app/types';
import {
  getAuthenticatedAdmin,
  unauthorizedResponse,
  forbiddenResponse,
  isSuperAdmin,
} from '@/app/lib/auth';

export async function GET(request: NextRequest) { // lay danh sach admin
  try {
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);

    const params = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await getAllAdmins(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) { // tao admin moi
  try {
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    if (!body.email || !body.password || !body.name || !body.role) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const existingAdmin = await getAdminByEmail(body.email);
    if (existingAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email đã tồn tại' },
        { status: 400 }
      );
    }

    if (body.role === 'SUPER_ADMIN' && !isSuperAdmin(currentAdmin)) {
      return forbiddenResponse('Chỉ Super Admin mới có thể tạo Super Admin khác');
    }

    const admin = await createAdmin(body);

    return NextResponse.json(
      { success: true, data: admin },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
