'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard, Card, Button } from '@/app/components';
import { api } from '@/app/lib/api';
import { Order } from '@/app/types/order';
import { PaginatedResponse } from '@/app/types';

const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const CubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
  </svg>
);

interface DashboardData {
  totalRevenue: number;
  totalClients: number;
  totalProducts: number;
  totalOrders: number;
  recentOrders: Order[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    totalClients: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, productsRes, ordersRes] = await Promise.all([
          api.get<PaginatedResponse<any>>('/api/clients?limit=1'),
          api.get<PaginatedResponse<any>>('/api/products?limit=1'),
          api.get<PaginatedResponse<Order>>('/api/orders?limit=5'),
        ]);

        let revenue = 0;
        if (ordersRes.success && ordersRes.data?.data) {
          revenue = ordersRes.data.data.reduce((sum, order) => sum + Number(order.total || 0), 0);
        }

        setData({
          totalRevenue: revenue,
          totalClients: clientsRes.data?.total || 0,
          totalProducts: productsRes.data?.total || 0,
          totalOrders: ordersRes.data?.total || 0,
          recentOrders: ordersRes.data?.data || [],
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="page-container">
      
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="action-buttons">
          <Link href="/dashboard/orders/new">
            <Button variant="primary">+ Tạo đơn hàng</Button>
          </Link>
        </div>
      </div>

      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <StatsCard
          title="Doanh thu"
          value={loading ? '...' : `$${data.totalRevenue.toLocaleString()}`}
          icon={<DollarIcon />}
          iconBgColor="bg-green-500"
          change={12.5}
          changeLabel="vs tháng trước"
        />
        <StatsCard
          title="Khách hàng"
          value={loading ? '...' : data.totalClients}
          icon={<UsersIcon />}
          iconBgColor="bg-blue-500"
          change={8.2}
        />
        <StatsCard
          title="Sản phẩm"
          value={loading ? '...' : data.totalProducts}
          icon={<CubeIcon />}
          iconBgColor="bg-purple-500"
        />
        <StatsCard
          title="Đơn hàng"
          value={loading ? '...' : data.totalOrders}
          icon={<OrderIcon />}
          iconBgColor="bg-orange-500"
          change={-3.1}
        />
      </div>

      
      <div className="grid-2">
        
        <Card 
          title="Đơn hàng gần đây" 
          headerAction={
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:underline">
              Xem tất cả
            </Link>
          }
        >
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="loading-skeleton" style={{ height: '3rem' }} />
              ))}
            </div>
          ) : data.recentOrders.length === 0 ? (
            <div className="empty-state">
              <OrderIcon />
              <p className="empty-state-title">Chưa có đơn hàng</p>
              <p className="empty-state-text">Tạo đơn hàng đầu tiên để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map(order => (
                <Link 
                  key={order.id} 
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.orderNumber}</span>
                    </div>
                    <p className="text-sm text-muted truncate">{order.client?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(order.total || 0).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        
        <Card title="Thao tác nhanh">
          <div className="space-y-3">
            <Link href="/dashboard/orders/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="stat-icon bg-blue-500" style={{ width: '2.5rem', height: '2.5rem' }}>
                <OrderIcon />
              </div>
              <div>
                <p className="font-medium">Tạo đơn hàng mới</p>
                <p className="text-sm text-muted">Tạo đơn hàng cho khách</p>
              </div>
            </Link>
            
            <Link href="/dashboard/products/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="stat-icon bg-purple-500" style={{ width: '2.5rem', height: '2.5rem' }}>
                <CubeIcon />
              </div>
              <div>
                <p className="font-medium">Thêm sản phẩm</p>
                <p className="text-sm text-muted">Thêm sản phẩm vào kho</p>
              </div>
            </Link>
            
            <Link href="/dashboard/clients/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="stat-icon bg-green-500" style={{ width: '2.5rem', height: '2.5rem' }}>
                <UsersIcon />
              </div>
              <div>
                <p className="font-medium">Thêm khách hàng</p>
                <p className="text-sm text-muted">Đăng ký khách hàng mới</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
