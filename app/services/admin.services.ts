import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { AdminResponse, CreateAdminRequest, UpdateAdminRequest, LoginRequest } from '../types/admin';
import { PaginationParams, PaginatedResponse } from '../types';

export async function createAdmin(data: CreateAdminRequest): Promise<AdminResponse> {
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

    return toAdminResponse(admin);
}

export async function getAllAdmins(params: PaginationParams): Promise<PaginatedResponse<AdminResponse>> {
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

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.admin.count({ where }),
  ]);

  return {
    data: admins.map(admin => ({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      avatar: admin.avatar ?? undefined,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAdminById(id:string): Promise<AdminResponse | null> {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) return null;

  return toAdminResponse(admin);

}

export async function updateAdmin(id: string, data: UpdateAdminRequest): Promise<AdminResponse> {
  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: updateData,
  });

  return toAdminResponse(admin);
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

function toAdminResponse(admin: any): AdminResponse { //helper giup tranh lap code
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