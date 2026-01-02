'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Card } from '@/app/components';
import { api } from '@/app/lib/api';
import { Product } from '@/app/types/product';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    quantity: '0',
    image: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    async function fetchProduct() {
      const result = await api.get<Product>(`/api/products/${id}`);

      if (result.success && result.data) {
        setForm({
          name: result.data.name || '',
          sku: result.data.sku || '',
          description: result.data.description || '',
          price: String(result.data.price || ''),
          quantity: String(result.data.quantity || 0),
          image: result.data.image || '',
          status: result.data.status || 'ACTIVE',
        });
      } else {
        setError(result.error || 'Không thể tải thông tin sản phẩm');
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price) {
      setError('Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    setSaving(true);

    const result = await api.put<Product>(`/api/products/${id}`, {
      name: form.name,
      sku: form.sku || undefined,
      description: form.description || undefined,
      price: Number(form.price),
      quantity: Number(form.quantity) || 0,
      image: form.image || undefined,
      status: form.status,
    });

    if (result.success) {
      router.push('/dashboard/products');
    } else {
      setError(result.error || 'Không thể cập nhật sản phẩm');
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <>
        <header className="header">
          <h1 className="heading-1">Chỉnh sửa sản phẩm</h1>
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
        <h1 className="heading-1">Chỉnh sửa sản phẩm</h1>
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
              label="Tên sản phẩm"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Mã sản phẩm (tùy chọn)"
            />

            <div className="mb-4">
              <label className="block mb-2 font-medium">Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Mô tả sản phẩm..."
              />
            </div>

            <Input
              label="Giá"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />

            <Input
              label="Số lượng tồn kho"
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
            />

            <Input
              label="URL hình ảnh"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />

            <div className="mb-4">
              <label className="block mb-2 font-medium">Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="ACTIVE">Đang bán</option>
                <option value="INACTIVE">Ngừng bán</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" loading={saving}>
                Lưu thay đổi
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
