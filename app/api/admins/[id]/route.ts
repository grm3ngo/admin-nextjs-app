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

export async function GET(request: NextRequest, { params }: Params) { //lay thong tin admin theo id
  try {
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

export async function PUT(request: NextRequest, { params }: Params) { //update thong tin admin
  try {
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();

    const targetAdmin = await getAdminById(id);
    if (!targetAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Admin không tồn tại' },
        { status: 404 }
      );
    }

    const editCheck = canEditAdmin(currentAdmin, targetAdmin, body.role); //check quyen sua
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

export async function DELETE(request: NextRequest, { params }: Params) { //xoa admin
  try {
    // Kiểm tra đăng nhập
    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const targetAdmin = await getAdminById(id);
    if (!targetAdmin) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Admin không tồn tại' },
        { status: 404 }
      );
    }

    const deleteCheck = canDeleteAdmin(currentAdmin, id); //check quyen xoa
    if (!deleteCheck.allowed) {
      return forbiddenResponse(deleteCheck.reason);
    }

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
