import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct, getProductByProductNumber } from '@/app/services/product.services';
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

    const result = await getAllProducts(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Thiếu thông tin bắt buộc (name, price)' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    if (body.sku) {
      const existingProduct = await getProductByProductNumber(body.sku);
      if (existingProduct) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'SKU đã tồn tại' },
          { status: 400 }
        );
      }
    }

    const product = await createProduct(body);

    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
