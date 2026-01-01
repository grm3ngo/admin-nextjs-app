'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/app/components';
import { api } from '@/app/lib/api';
import { DashboardStats } from '@/app/types';

const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const CubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

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
    <div className="dashboard-page">
      {/* Stats Cards */}
      <section className="stats-section">
        <div className="grid-stats">
          <StatsCard
            title="Total Sales"
            value={loading ? '...' : `$${(stats?.totalAdmins ?? 0) * 1000}`}
            icon={<DollarIcon />}
            iconBgColor="bg-green-500"
          />
          <StatsCard
            title="Total Clients"
            value={loading ? '...' : stats?.activeAdmins ?? 0}
            icon={<UsersIcon />}
            iconBgColor="bg-blue-500"
          />
          <StatsCard
            title="Total Products"
            value={loading ? '...' : stats?.inactiveAdmins ?? 0}
            icon={<CubeIcon />}
            iconBgColor="bg-purple-500"
          />
          <StatsCard
            title="Active Sessions"
            value={loading ? '...' : stats?.activeSessions ?? 0}
            icon={<ChartIcon />}
            iconBgColor="bg-orange-500"
          />
        </div>
      </section>

      {/* Revenue Analytics Section */}
      <section className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">Revenue Analytics</h3>
          <div className="chart-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
            </svg>
            <p className="text-gray-500 mt-2">Chart coming soon</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h3 className="section-title">Quick Actions</h3>
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
  );
}
