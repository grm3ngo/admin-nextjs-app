'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/app/components';
import { api } from '@/app/lib/api';
import { AdminResponse } from '@/app/types';

export default function NewAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ADMIN',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await api.post<AdminResponse>('/api/admins', form);

    if (result.success) {
      router.push('/admins');
    } else {
      setError(result.error || 'Không thể tạo admin');
    }

    setLoading(false);
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <h1 className="heading-1">Add New Admin</h1>
      </header>

      {/* Content */}
      <div className="container-page">
        <Card className="max-w-lg">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'var(--color-danger)', color: 'var(--color-text-light)' }}>
                {error}
              </div>
            )}

            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="flex gap-4">
              <Button type="submit" variant="primary" loading={loading}>
                Create Admin
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
