import { AdminResponse } from "./admin";

export interface SessionResponse {
    id: string;
    adminId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface AuthResponse {
    admin: AdminResponse;
    token: string;
    expiresAt: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}
