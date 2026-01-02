'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, PageHeader, DataTable } from '@/app/components';
import { api } from '@/app/lib/api';
import { Order } from '@/app/types/order';
import { PaginatedResponse } from '@/app/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  async function fetchOrders() {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.set('search', search);

    const result = await api.get<PaginatedResponse<Order>>(`/api/orders?${params}`);

    if (result.success && result.data) {
      setOrders(result.data.data || []);
      setTotal(result.data.total || 0);
    } else {
      setError(result.error || 'Failed to fetch orders');
      setOrders([]);
    }
    setLoading(false);
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      PENDING: 'badge-warning',
      PROCESSING: 'badge-info',
      COMPLETED: 'badge-success',
      CANCELLED: 'badge-danger',
    };
    return styles[status] || 'badge-default';
  }

  function getPaymentBadge(status: string) {
    const styles: Record<string, string> = {
      UNPAID: 'badge-danger',
      PAID: 'badge-success',
      PARTIAL: 'badge-warning',
    };
    return styles[status] || 'badge-default';
  }

  function formatDate(dateValue: Date | string) {
    return new Date(dateValue).toLocaleDateString('vi-VN');
  }

  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      key: 'orderNumber',
      header: 'Mã đơn',
      render: (order: Order) => (
        <div>
          <Link href={`/dashboard/orders/${order.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {order.orderNumber}
          </Link>
          <div className="text-sm text-muted hidden-desktop">
            ${Number(order.total || 0).toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Khách hàng',
      render: (order: Order) => order.client?.name || '-',
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      className: 'hidden-mobile',
      render: (order: Order) => (
        <span style={{ fontWeight: 600 }}>
          ${Number(order.total || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      className: 'hidden-mobile',
      render: (order: Order) => (
        <span className={`badge ${getStatusBadge(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Thanh toán',
      className: 'hidden-mobile',
      render: (order: Order) => (
        <span className={`badge ${getPaymentBadge(order.paymentStatus)}`}>
          {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa TT'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày',
      className: 'hidden-mobile',
      render: (order: Order) => formatDate(order.createdAt),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerAlign: 'right' as const,
      render: (order: Order) => (
        <div className="table-actions">
          <Link href={`/dashboard/orders/${order.id}`}>
            <Button variant="ghost" size="sm">Chi tiết</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Đơn hàng"
        subtitle={`Quản lý ${total} đơn hàng trong hệ thống`}
        actions={
          <Link href="/dashboard/orders/new">
            <Button variant="primary">+ Tạo đơn hàng</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={orders}
        keyField="id"
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Tìm kiếm đơn hàng..."
        emptyIcon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        }
        emptyTitle="Chưa có đơn hàng"
        emptyDescription="Tạo đơn hàng đầu tiên để bắt đầu"
        emptyAction={
          <Link href="/dashboard/orders/new">
            <Button variant="primary">+ Tạo đơn hàng</Button>
          </Link>
        }
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        itemLabel="đơn hàng"
      />
    </div>
  );
}