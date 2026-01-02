import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { Admin, AdminCreateInput, AdminUpdateInput } from '../types/admin';
import { PaginationParams, PaginatedResponse } from '../types';

export async function createAdmin(data: AdminCreateInput): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const admin = await prisma.admin.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            avatar: data.avatar,
            role: data.role,
        },
    });

    return toAdmin(admin);
}

export async function getAllAdmins(params: PaginationParams): Promise<PaginatedResponse<Admin>> {
  const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [Admins, total] = await Promise.all([
    prisma.admin.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.admin.count({ where }),
  ]);

  return {
    data: Admins.map(toAdmin),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAdminById(id:string): Promise<Admin | null> {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) return null;

  return toAdmin(admin);

}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) return null;

  return toAdmin(admin);
}

export async function updateAdmin(id: string, data: AdminUpdateInput): Promise<Admin> {
  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: updateData,
  });

  return toAdmin(admin);
}

export async function deleteAdmin(id: string): Promise<void> {
  await prisma.admin.delete({
    where: { id },
  });
}

export async function verifyPassword(email: string, plainPassword: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) return false;

  return bcrypt.compare(plainPassword, admin.password);
}

export async function changePassword(id: string, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

function toAdmin(admin: any): Admin { //helper giup tranh lap code
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    avatar: admin.avatar ?? undefined,
    role: admin.role,
    status: admin.status,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}