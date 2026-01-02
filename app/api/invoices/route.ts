import { NextRequest, NextResponse } from 'next/server';
import { getAllInvoices, createInvoice } from '@/app/services/invoice.services';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await getAllInvoices(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.orderId || !body.clientId || body.amount === undefined) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Thiếu thông tin bắt buộc (orderId, clientId, amount)' },
        { status: 400 }
      );
    }

    const invoice = await createInvoice(body);

    return NextResponse.json({
      success: true,
      data: invoice,
    }, { status: 201 });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
