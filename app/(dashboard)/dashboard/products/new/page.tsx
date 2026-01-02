'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, PageHeader } from '@/app/components';
import { api } from '@/app/lib/api';
import { Product } from '@/app/types/product';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    const result = await api.post<Product>('/api/products', {
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
      setError(result.error || 'Không thể tạo sản phẩm');
    }

    setLoading(false);
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Thêm sản phẩm mới"
        subtitle="Thêm sản phẩm vào kho hàng"
        actions={
          <Link href="/dashboard/products">
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
            label="Tên sản phẩm"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
            required
          />

          <Input
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="Mã sản phẩm (tùy chọn)"
          />

          <div className="form-group form-full">
            <label className="form-label">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </div>

          <Input
            label="Giá ($)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <Input
            label="Số lượng tồn kho"
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            placeholder="0"
          />

          <Input
            label="URL hình ảnh"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />

          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngừng bán</option>
            </select>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={loading}>
              Tạo sản phẩm
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
