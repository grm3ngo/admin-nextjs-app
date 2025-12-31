import { Role, AccountStatus } from "../generated/prisma/client";

export interface AdminResponse {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: Role;
    status: AccountStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAdminRequest {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    role: Role;
}

export interface UpdateAdminRequest {
    email?: string;
    name?: string;
    password?: string;
    avatar?: string;
    role?: Role;
    status?: AccountStatus;
}

export interface LoginRequest {
    email: string;
    password: string;
}
