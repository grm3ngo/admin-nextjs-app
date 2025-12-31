import { NextResponse } from 'next/server';
import { getStats, getAdminsByRole, getAdminsByStatus } from '@/app/services/dashboard.services';
import { ApiResponse } from '@/app/types';

export async function GET() {
  try {
    const [stats, byRole, byStatus] = await Promise.all([
      getStats(),
      getAdminsByRole(),
      getAdminsByStatus(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        byRole,
        byStatus,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
}