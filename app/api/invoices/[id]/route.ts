import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, updateInvoice, deleteInvoice } from '@/app/services/invoice.services';
import { ApiResponse } from '@/app/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invoice không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Get invoice error:', error);
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

    const existingInvoice = await getInvoiceById(id);
    if (!existingInvoice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invoice không tồn tại' },
        { status: 404 }
      );
    }

    const invoice = await updateInvoice(id, body);

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const invoice = await getInvoiceById(id);
    if (!invoice) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invoice không tồn tại' },
        { status: 404 }
      );
    }

    await deleteInvoice(id);

    return NextResponse.json({
      success: true,
      message: 'Xóa invoice thành công',
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}