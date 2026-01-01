import crypto from 'crypto';
import prisma from '../lib/prisma';
import { Session } from '../types';

export async function createSession(adminId: string): Promise<Session> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngay

    const session = await prisma.session.create({
        data: {
            adminId,
            token,
            expiresAt
        },
    });

    return toSession(session);
}

export async function getSessionByToken(token: string): Promise<Session | null> {
    const session = await prisma.session.findUnique({
        where: { token },
    });

    if (!session) return null;

    return toSession(session);
}

export async function deleteSession(id: string): Promise<void> {
    await prisma.session.delete({
        where: { id },
    });
}

export async function deleteSessionsByAdminId(adminId: string): Promise<void> {
    await prisma.session.deleteMany({
        where: { adminId },
    });
}


export function toSession(session: any): Session {
    return {
        id: session.id,
        adminId: session.adminId,
        token: session.token,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
    };
}