'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, PageHeader } from '@/app/components';
import { api } from '@/app/lib/api';
import { Order, OrderItemInput } from '@/app/types/order';
import { Client } from '@/app/types/client';
import { Product } from '@/app/types/product';

interface OrderItemRow {
  productId: string;
  quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    clientId: '',
    note: '',
    discount: '0',
  });

  const [items, setItems] = useState<OrderItemRow[]>([
    { productId: '', quantity: 1 },
  ]);

  useEffect(() => {
    async function fetchData() {
      const [clientsResult, productsResult] = await Promise.all([
        api.get<{ data: Client[] }>('/api/clients'),
        api.get<{ data: Product[] }>('/api/products'),
      ]);

      if (clientsResult.success && clientsResult.data) {
        setClients(clientsResult.data.data);
      }
      if (productsResult.success && productsResult.data) {
        setProducts(productsResult.data.data);
      }
      setLoadingData(false);
    }
    fetchData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleItemChange(index: number, field: keyof OrderItemRow, value: string | number) {
    const newItems = [...items];
    if (field === 'quantity') {
      newItems[index][field] = Number(value);
    } else {
      newItems[index][field] = value as string;
    }
    setItems(newItems);
  }

  function addItem() {
    setItems([...items, { productId: '', quantity: 1 }]);
  }

  function removeItem(index: number) {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  }

  function calculateTotal() {
    let subtotal = 0;
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        subtotal += Number(product.price) * item.quantity;
      }
    });
    const discount = Number(form.discount) || 0;
    return { subtotal, total: subtotal - discount };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.clientId) {
      setError('Vui lòng chọn khách hàng');
      return;
    }

    const validItems = items.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    setLoading(true);

    const orderItems: OrderItemInput[] = validItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const result = await api.post<Order>('/api/orders', {
      clientId: form.clientId,
      items: orderItems,
      note: form.note || undefined,
      discount: Number(form.discount) || 0,
    });

    if (result.success) {
      router.push('/dashboard/orders');
    } else {
      setError(result.error || 'Không thể tạo đơn hàng');
    }

    setLoading(false);
  }

  const { subtotal, total } = calculateTotal();

  if (loadingData) {
    return (
      <div className="page-container">
        <PageHeader title="Tạo đơn hàng mới" subtitle="Đang tải dữ liệu..." />
        <Card>
          <div className="loading-skeleton" style={{ height: '200px' }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Tạo đơn hàng mới"
        subtitle="Tạo đơn hàng cho khách hàng"
        actions={
          <Link href="/dashboard/orders">
            <Button variant="secondary">← Quay lại</Button>
          </Link>
        }
      />

      <Card className="form-card-wide">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* Client Selection */}
          <div className="form-group">
            <label className="form-label">Khách hàng *</label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Chọn khách hàng --</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          {/* Order Items */}
          <div className="form-group">
            <label className="form-label">Sản phẩm *</label>
            <div className="order-items-list">
              {items.map((item, index) => {
                const product = products.find(p => p.id === item.productId);
                const itemTotal = product ? Number(product.price) * item.quantity : 0;
                
                return (
                  <div key={index} className="order-item-row">
                    <div className="order-item-product">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${Number(p.price).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="order-item-qty">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity.toString()}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        placeholder="SL"
                      />
                    </div>
                    <div className="order-item-total">
                      ${itemTotal.toFixed(2)}
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      ✕
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>
              + Thêm sản phẩm
            </Button>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
              placeholder="Ghi chú cho đơn hàng..."
            />
          </div>

          {/* Discount */}
          <div className="form-group">
            <Input
              label="Giảm giá ($)"
              name="discount"
              type="number"
              min="0"
              value={form.discount}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="order-summary-row">
              <span>Tạm tính:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="order-summary-row">
              <span>Giảm giá:</span>
              <span>-${(Number(form.discount) || 0).toFixed(2)}</span>
            </div>
            <div className="order-summary-row order-summary-total">
              <span>Tổng cộng:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={loading}>
              Tạo đơn hàng
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
