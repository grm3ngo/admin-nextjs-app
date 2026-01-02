'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Card } from '@/app/components';
import { api } from '@/app/lib/api';
import { Client } from '@/app/types';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'ACTIVE',
    });
  useEffect(() => {
    async function fetchClient() {
      const result = await api.get<Client>(`/api/clients/${id}`);

      if (result.success && result.data) {
        setForm({
            name: result.data.name,
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            status: result.data.status,
        });
      } else {
        setError(result.error || 'Không thể tải thông tin admin');
      }
      setLoading(false);
    }
    fetchClient();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const body: Record<string, string> = {
      email: form.email,
      name: form.name,
      phone: form.phone,
      address: form.address,
      status: form.status,
    };

    const result = await api.put<Client>(`/api/clients/${id}`, body);

    if (result.success) {
      router.push('/dashboard/clients');
    } else {
      setError(result.error || 'Không thể cập nhật admin');
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <header className="header">
          <h1 className="heading-1">Edit Client</h1>
        </header>
        <div className="container-page">
          <p className="text-muted">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <h1 className="heading-1">Edit Client</h1>
      </header>

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

                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
            />
            
            <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
            />


            <div className="mb-4">
              <label className="label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" loading={saving}>
                Save Changes
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
