'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, PageHeader, SearchBox, DataTable } from '@/app/components';
import { Client, PaginatedResponse } from '@/app/types';
import { api } from '@/app/lib/api';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });
      
      const result = await api.get<PaginatedResponse<Client>>(`/api/clients?${params}`);
      
      if (result.success && result.data) {
        setClients(result.data.data);
        setTotal(result.data.total);
      } else {
        setError(result.error || 'Không thể tải danh sách khách hàng');
      }
      setLoading(false);
    }
    fetchClients();
  }, [page, search]);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;

    const result = await api.delete(`/api/clients/${id}`);
    if (result.success) {
      setClients(clients.filter((c) => c.id !== id));
      setTotal(total - 1);
    } else {
      alert(result.error || 'Không thể xóa khách hàng');
    }
  }

  function getStatusBadge(status: string) {
    return status === 'ACTIVE' ? 'badge-success' : 'badge-default';
  }

  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      key: 'name',
      header: 'Tên',
      render: (client: Client) => (
        <div>
          <div style={{ fontWeight: 500 }}>{client.name}</div>
          <div className="text-sm text-muted hidden-desktop">{client.phone}</div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (client: Client) => client.email,
    },
    {
      key: 'phone',
      header: 'Điện thoại',
      className: 'hidden-mobile',
      render: (client: Client) => client.phone || '-',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      className: 'hidden-mobile',
      render: (client: Client) => (
        <span className={`badge ${getStatusBadge(client.status)}`}>
          {client.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerAlign: 'right' as const,
      render: (client: Client) => (
        <div className="table-actions">
          <Link href={`/dashboard/clients/${client.id}`}>
            <Button variant="ghost" size="sm">Sửa</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(client.id)}
            style={{ color: 'var(--color-danger)' }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Khách hàng"
        subtitle={`Quản lý ${total} khách hàng trong hệ thống`}
        actions={
          <Link href="/dashboard/clients/new">
            <Button variant="primary">+ Thêm khách hàng</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={clients}
        keyField="id"
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Tìm kiếm khách hàng..."
        emptyIcon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        }
        emptyTitle="Chưa có khách hàng"
        emptyDescription="Thêm khách hàng đầu tiên để bắt đầu"
        emptyAction={
          <Link href="/dashboard/clients/new">
            <Button variant="primary">+ Thêm khách hàng</Button>
          </Link>
        }
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        itemLabel="khách hàng"
      />
    </div>
  );
}
