'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/app/components';
import { api } from '@/app/lib/api';
import { DashboardStats } from '@/app/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const result = await api.get<{ stats: DashboardStats }>('/api/dashboard/stats');
      
      if (result.success && result.data) {
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Không thể tải thống kê');
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header">
        <h1 className="heading-1">Dashboard</h1>
      </header>

      {/* Content */}
      <div className="container-page">
        {/* Stats Cards */}
        <section className="mb-responsive">
          <h2 className="heading-2 mb-4">Overview</h2>
          <div className="grid-stats">
            <StatsCard
              title="Total Admins"
              value={loading ? '...' : stats?.totalAdmins ?? 0}
            />
            <StatsCard
              title="Active Admins"
              value={loading ? '...' : stats?.activeAdmins ?? 0}
            />
            <StatsCard
              title="Inactive Admins"
              value={loading ? '...' : stats?.inactiveAdmins ?? 0}
            />
            <StatsCard
              title="Active Sessions"
              value={loading ? '...' : stats?.activeSessions ?? 0}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-responsive">
          <h2 className="heading-2 mb-4">Quick Actions</h2>
          <div className="flex-responsive">
            <a href="/admins/new" className="btn btn-primary">
              Add New Admin
            </a>
            <a href="/admins" className="btn btn-secondary">
              View All Admins
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
