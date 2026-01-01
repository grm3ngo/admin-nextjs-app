import { NextRequest, NextResponse } from 'next/server';
import { getAdminById, updateAdmin, deleteAdmin } from '@/app/services/admin.services';
import { ApiResponse } from '@/app/types';

type Params = { params: { id: string } };

export async function GET({ params }: Params) { //lay thong tin admin theo id
  try {
    const admin = await getAdminById(params.id);

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
    const body = await request.json();
    const admin = await updateAdmin(params.id, body);

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

export async function DELETE({ params }: Params) { //xoa admin
  try {
    await deleteAdmin(params.id);

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