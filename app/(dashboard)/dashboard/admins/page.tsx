'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, PageHeader, DataTable } from '@/app/components';
import { Admin, PaginatedResponse } from '@/app/types';
import { api } from '@/app/lib/api';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchAdmins() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });
      
      const result = await api.get<PaginatedResponse<Admin>>(`/api/admins?${params}`);
      
      if (result.success && result.data) {
        setAdmins(result.data.data);
        setTotal(result.data.total);
      } else {
        setError(result.error || 'Không thể tải danh sách admin');
      }
      setLoading(false);
    }
    fetchAdmins();
  }, [page, search]);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa admin này?')) return;

    const result = await api.delete(`/api/admins/${id}`);
    if (result.success) {
      setAdmins(admins.filter((a) => a.id !== id));
      setTotal(total - 1);
    } else {
      alert(result.error || 'Không thể xóa admin');
    }
  }

  function getStatusBadge(status: string) {
    return status === 'ACTIVE' ? 'badge-success' : 'badge-default';
  }

  function getRoleBadge(role: string) {
    return role === 'SUPER_ADMIN' ? 'badge-primary' : 'badge-info';
  }

  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      key: 'name',
      header: 'Tên',
      render: (admin: Admin) => (
        <div>
          <div style={{ fontWeight: 500 }}>{admin.name}</div>
          <div className="text-sm text-muted hidden-desktop">{admin.role}</div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (admin: Admin) => admin.email,
    },
    {
      key: 'role',
      header: 'Vai trò',
      className: 'hidden-mobile',
      render: (admin: Admin) => (
        <span className={`badge ${getRoleBadge(admin.role)}`}>
          {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      className: 'hidden-mobile',
      render: (admin: Admin) => (
        <span className={`badge ${getStatusBadge(admin.status)}`}>
          {admin.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerAlign: 'right' as const,
      render: (admin: Admin) => (
        <div className="table-actions">
          <Link href={`/dashboard/admins/${admin.id}`}>
            <Button variant="ghost" size="sm">Sửa</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(admin.id)}
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
        title="Quản trị viên"
        subtitle={`Quản lý ${total} quản trị viên trong hệ thống`}
        actions={
          <Link href="/dashboard/admins/new">
            <Button variant="primary">+ Thêm admin</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={admins}
        keyField="id"
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Tìm kiếm admin..."
        emptyIcon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        }
        emptyTitle="Chưa có admin"
        emptyDescription="Thêm admin đầu tiên để bắt đầu"
        emptyAction={
          <Link href="/dashboard/admins/new">
            <Button variant="primary">+ Thêm admin</Button>
          </Link>
        }
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        itemLabel="admin"
      />
    </div>
  );
}
