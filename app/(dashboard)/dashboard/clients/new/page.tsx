'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, PageHeader } from '@/app/components';
import { api } from '@/app/lib/api';
import { Client } from '@/app/types';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'ACTIVE',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await api.post<Client>('/api/clients', form);

    if (result.success) {
      router.push('/dashboard/clients');
    } else {
      setError(result.error || 'Không thể tạo khách hàng');
    }

    setLoading(false);
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Thêm khách hàng mới"
        subtitle="Đăng ký thông tin khách hàng"
        actions={
          <Link href="/dashboard/clients">
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
            placeholder="Nhập họ tên khách hàng"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
          />

          <Input
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0123 456 789"
          />

          <Input
            label="Địa chỉ"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Địa chỉ khách hàng"
          />

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
              Tạo khách hàng
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
