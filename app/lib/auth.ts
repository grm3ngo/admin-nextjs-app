//export cac functions va interfaces lien quan den xac thuc va quyen truy cap
// lay thong tin admin tu token, kiem tra quyen truy cap, phan hoi loi

import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '@/app/services/session.services';
import { getAdminById } from '@/app/services/admin.services';
import { AdminResponse, ApiResponse } from '@/app/types';

export interface AuthenticatedRequest {
  currentAdmin: AdminResponse;
}

export async function getAuthenticatedAdmin( //lay thong tin admin tu token
  request: NextRequest
): Promise<AdminResponse | null> {
  const authHeader = request.headers.get('Authorization'); //lay token tu header
  const token = authHeader?.replace('Bearer ', '');

  if (!token) return null;

  const session = await getSessionByToken(token);
  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) { //check token het han
    return null;
  }

  const admin = await getAdminById(session.adminId);
  return admin;
}

export function unauthorizedResponse() { //phan hoi loi chua dang nhap
  return NextResponse.json<ApiResponse<null>>(
    { success: false, error: 'Chưa đăng nhập hoặc token hết hạn' },
    { status: 401 }
  );
}

export function forbiddenResponse(message = 'Không có quyền thực hiện') { // phan hoi loi khong co quyen
  return NextResponse.json<ApiResponse<null>>(
    { success: false, error: message },
    { status: 403 }
  );
}

export function isSuperAdmin(admin: AdminResponse): boolean { //check co phai superadmin khong
  return admin.role === 'SUPER_ADMIN';
}

export function canChangeRole(
  currentAdmin: AdminResponse, //check co the thay doi role khong
  targetRole: string
): boolean {
  if (targetRole === 'SUPER_ADMIN') {
    return isSuperAdmin(currentAdmin);
  }
  return true;
}

export function canDeleteAdmin( //check co the xoa admin khong
  currentAdmin: AdminResponse,
  targetAdminId: string
): { allowed: boolean; reason?: string } {
  if (currentAdmin.id === targetAdminId) {
    return { allowed: false, reason: 'Không thể tự xóa chính mình' };
  }

  return { allowed: true };
}

export function canEditAdmin( //check co the sua admin khong
  currentAdmin: AdminResponse,
  targetAdmin: AdminResponse,
  newRole?: string
): { allowed: boolean; reason?: string } {
  if (!isSuperAdmin(currentAdmin) && isSuperAdmin(targetAdmin)) {
    return { allowed: false, reason: 'Không có quyền sửa Super Admin' };
  }

  if (newRole === 'SUPER_ADMIN' && !isSuperAdmin(currentAdmin)) {
    return { allowed: false, reason: 'Chỉ Super Admin mới có thể tạo Super Admin khác' };
  }

  return { allowed: true };
}
