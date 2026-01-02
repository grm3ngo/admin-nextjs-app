import { NextRequest, NextResponse } from 'next/server';
import { getAllClients, createClient } from '@/app/services/client.services';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) { //lay danh sach client
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await getAllClients(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) { //tao client moi
  try {
    const body = await request.json();

    if (!body.email || !body.name || !body.phone || !body.address) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const client = await createClient(body);

    return NextResponse.json({
      success: true,
      data: client,
    }, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}