'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/app/components';
import { AdminResponse, PaginatedResponse } from '@/app/types';
import { api } from '@/app/lib/api';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdmins() {
      setError(null);
      const result = await api.get<PaginatedResponse<AdminResponse>>('/api/admins');
      
      if (result.success && result.data) {
        setAdmins(result.data.data);
      } else {
        setError(result.error || 'Không thể tải danh sách admin');
      }
      setLoading(false);
    }
    fetchAdmins();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa admin này?')) return;

    const result = await api.delete(`/api/admins/${id}`);
    if (result.success) {
      setAdmins(admins.filter((a) => a.id !== id));
    } else {
      alert(result.error || 'Không thể xóa admin');
    }
  }

  return (
    <>
      {/* Header */}
      <header className="header flex-responsive items-center justify-between">
        <h1 className="heading-1">Admins</h1>
        <Link href="/admins/new">
          <Button variant="primary">Thêm Admin</Button>
        </Link>
      </header>

      {/* Content */}
      <div className="container-page">
        <Card>
          {loading ? (
            <p className="text-muted">Đang tải...</p>
          ) : error ? (
            <p className="text-muted" style={{ color: 'var(--color-danger)' }}>{error}</p>
          ) : admins.length === 0 ? (
            <p className="text-muted">Chưa có admin nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="hidden md:table-cell">Role</th>
                    <th className="hidden md:table-cell">Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td className="hidden md:table-cell">{admin.role}</td>
                      <td className="hidden md:table-cell">{admin.status}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link href={`/admins/${admin.id}`}>
                            <Button variant="secondary">Edit</Button>
                          </Link>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(admin.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
