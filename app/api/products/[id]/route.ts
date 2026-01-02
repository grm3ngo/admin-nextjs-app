import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/app/services/product.services';
import { ApiResponse } from '@/app/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Product không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
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

    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Product không tồn tại' },
        { status: 404 }
      );
    }

    const product = await updateProduct(id, body);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Product không tồn tại' },
        { status: 404 }
      );
    }

    await deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: 'Xóa product thành công',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
