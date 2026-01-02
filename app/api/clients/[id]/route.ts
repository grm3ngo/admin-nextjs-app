import { NextRequest, NextResponse } from 'next/server';
import { getClientById, updateClient, deleteClient } from '@/app/services/client.services';
import { ApiResponse } from '@/app/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const client = await getClientById(id);

    if (!client) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Client không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await updateClient(id, body);

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) { //xoa client
  try {
    const { id } = await params;
    
    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Client không tồn tại' },
        { status: 404 }
      );
    }
    
    await deleteClient(id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Xóa client thành công',
    });
  } catch (error) {
    console.error('Delete client error:', error);
    
    if (error instanceof Error && error.message.includes('Cannot delete client')) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}