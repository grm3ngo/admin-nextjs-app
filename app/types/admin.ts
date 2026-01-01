import type { BaseEntity, Status, Role } from './common';

export interface Admin extends BaseEntity {
  email: string;
  password?: string;  
  name: string;
  avatar: string | null;
  role: Role;
  status: Status;
  sessions?: Session[];
}

export interface AdminCreateInput {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role?: Role;
  status?: Status;
}

export interface AdminUpdateInput {
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
  role?: Role;
  status?: Status;
}

export interface AdminSafe extends BaseEntity {
  email: string;
  name: string;
  avatar: string | null;
  role: Role;
  status: Status;
}

export interface Session {
  id: string;
  adminId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthResponse {
  admin: AdminSafe;
  token: string;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}