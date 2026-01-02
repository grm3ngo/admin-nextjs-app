'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, PageHeader } from '@/app/components';
import { api } from '@/app/lib/api';
import { Admin } from '@/app/types';

export default function NewAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ADMIN',
    status: 'ACTIVE',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await api.post<Admin>('/api/admins', form);

    if (result.success) {
      router.push('/dashboard/admins');
    } else {
      setError(result.error || 'Không thể tạo admin');
    }

    setLoading(false);
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Thêm Admin mới"
        subtitle="Tạo tài khoản quản trị viên mới"
        actions={
          <Link href="/dashboard/admins">
            <Button variant="secondary">← Quay lại</Button>
          </Link>
        }
      />

      <Card className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <Input
            label="Họ tên"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ tên"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />

          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
          />

          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={loading}>
              Tạo Admin
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Hủy
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
