import prisma from '../lib/prisma';
import { DashboardStats,ChartDataPoint } from '../types';

export async function getStats(): Promise<DashboardStats> {
    const [ totalAdmins, activeAdmins, inactiveAdmins,activeSessions ] = await Promise.all([
        prisma.admin.count(), //dem tong admin
        prisma.admin.count({ where: { status: 'ACTIVE' } }), //hoat dong
        prisma.admin.count({ where: { status: 'INACTIVE' } }), //khong hoat dong
        prisma.session.count({ where: { expiresAt: {
            gt: new Date(),
        }}}), //dem session dang hoat dong
    ]);
    return {
        totalAdmins,
        activeAdmins,
        inactiveAdmins,
        activeSessions,
    };
}

// Group by role (cho pie chart)
export async function getAdminsByRole(): Promise<ChartDataPoint[]> {
  const result = await prisma.admin.groupBy({
    by: ['role'],
    _count: { role: true },
  });

  return result.map(item => ({
    name: item.role,
    value: item._count.role,
  }));
}

// Group by status (cho pie chart)
export async function getAdminsByStatus(): Promise<ChartDataPoint[]> {
  const result = await prisma.admin.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return result.map(item => ({
    name: item.status,
    value: item._count.status,
  }));
}