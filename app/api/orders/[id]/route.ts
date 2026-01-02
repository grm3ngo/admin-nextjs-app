import { NextRequest, NextResponse } from 'next/server';
import { getOrderWithItems, updateOrder, updateOrderStatus, updatePaymentStatus, deleteOrder } from '@/app/services/order.services';
import { ApiResponse } from '@/app/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const order = await getOrderWithItems(id);

    if (!order) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Order không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
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
    const order = await updateOrder(id, body);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteOrder(id);

    return NextResponse.json({
      success: true,
      message: 'Xóa order thành công',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}