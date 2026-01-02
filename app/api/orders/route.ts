import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrderWithItems } from '@/app/services/order.services';
import { OrderCreateInput } from '@/app/types/order';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const result = await getAllOrders({ page, limit, search, sortBy, sortOrder });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderCreateInput = await request.json();

    if (!body.clientId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    const order = await createOrderWithItems(
      body.clientId,
      body.items,
      body.note,
      body.discount || 0
    );

    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
