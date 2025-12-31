import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '@/app/services/session.services';
import { getAdminById } from '@/app/services/admin.services';
import { AdminResponse, ApiResponse } from '@/app/types';

export interface AuthenticatedRequest {
  currentAdmin: AdminResponse;
}

// Lấy thông tin admin từ token
export async function getAuthenticatedAdmin(
  request: NextRequest
): Promise<AdminResponse | null> {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) return null;

  const session = await getSessionByToken(token);
  if (!session) return null;

  // Kiểm tra session hết hạn
  if (new Date(session.expiresAt) < new Date()) {
    return null;
  }

  const admin = await getAdminById(session.adminId);
  return admin;
}

// Response lỗi unauthorized
export function unauthorizedResponse() {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, error: 'Chưa đăng nhập hoặc token hết hạn' },
    { status: 401 }
  );
}

// Response lỗi forbidden
export function forbiddenResponse(message = 'Không có quyền thực hiện') {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, error: message },
    { status: 403 }
  );
}

// Kiểm tra có phải SuperAdmin không
export function isSuperAdmin(admin: AdminResponse): boolean {
  return admin.role === 'SUPER_ADMIN';
}

// Kiểm tra có thể thay đổi role không
export function canChangeRole(
  currentAdmin: AdminResponse,
  targetRole: string
): boolean {
  // Chỉ SuperAdmin mới có thể tạo/chỉnh SuperAdmin
  if (targetRole === 'SUPER_ADMIN') {
    return isSuperAdmin(currentAdmin);
  }
  return true;
}

// Kiểm tra có thể xóa admin không
export function canDeleteAdmin(
  currentAdmin: AdminResponse,
  targetAdminId: string
): { allowed: boolean; reason?: string } {
  // Không thể tự xóa chính mình
  if (currentAdmin.id === targetAdminId) {
    return { allowed: false, reason: 'Không thể tự xóa chính mình' };
  }

  return { allowed: true };
}

// Kiểm tra có thể sửa admin không
export function canEditAdmin(
  currentAdmin: AdminResponse,
  targetAdmin: AdminResponse,
  newRole?: string
): { allowed: boolean; reason?: string } {
  // Admin thường không thể sửa SuperAdmin
  if (!isSuperAdmin(currentAdmin) && isSuperAdmin(targetAdmin)) {
    return { allowed: false, reason: 'Không có quyền sửa Super Admin' };
  }

  // Chỉ SuperAdmin mới có thể thăng cấp thành SuperAdmin
  if (newRole === 'SUPER_ADMIN' && !isSuperAdmin(currentAdmin)) {
    return { allowed: false, reason: 'Chỉ Super Admin mới có thể tạo Super Admin khác' };
  }

  return { allowed: true };
}
