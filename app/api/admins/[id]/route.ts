import { NextRequest, NextResponse } from 'next/server';
import { getAdminById, updateAdmin, deleteAdmin } from '@/app/services/admin.services';
import { ApiResponse } from '@/app/types';
import {
  getAuthenticatedAdmin,
  unauthorizedResponse,
  forbiddenResponse,
  canDeleteAdmin,
  canEditAdmin,
} from '@/app/lib/auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/admins/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Kiểm tra đăng nhập
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const admin = await getAdminById(id);

    if (!admin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Admin không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PUT /api/admins/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Kiểm tra đăng nhập
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();

    // Lấy thông tin admin cần sửa
    const targetAdmin = await getAdminById(id);
    if (!targetAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Admin không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra quyền sửa
    const editCheck = canEditAdmin(currentAdmin, targetAdmin, body.role);
    if (!editCheck.allowed) {
      return forbiddenResponse(editCheck.reason);
    }

    const admin = await updateAdmin(id, body);

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// DELETE /api/admins/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Kiểm tra đăng nhập
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Lấy thông tin admin cần xóa
    const targetAdmin = await getAdminById(id);
    if (!targetAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Admin không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra quyền xóa
    const deleteCheck = canDeleteAdmin(currentAdmin, id);
    if (!deleteCheck.allowed) {
      return forbiddenResponse(deleteCheck.reason);
    }

    // Admin thường không thể xóa SuperAdmin
    if (targetAdmin.role === 'SUPER_ADMIN' && currentAdmin.role !== 'SUPER_ADMIN') {
      return forbiddenResponse('Không có quyền xóa Super Admin');
    }

    await deleteAdmin(id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Xóa admin thành công',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
