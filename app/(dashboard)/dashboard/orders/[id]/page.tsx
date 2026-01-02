'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card } from '@/app/components';
import { api } from '@/app/lib/api';
import { Order } from '@/app/types/order';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const [form, setForm] = useState({
    status: '',
    paymentStatus: '',
    note: '',
    discount: '',
  });

  useEffect(() => {
    async function fetchOrder() {
      const result = await api.get<Order>(`/api/orders/${id}`);

      if (result.success && result.data) {
        setOrder(result.data);
        setForm({
          status: result.data.status || 'PENDING',
          paymentStatus: result.data.paymentStatus || 'UNPAID',
          note: result.data.note || '',
          discount: String(result.data.discount || 0),
        });
      } else {
        setError(result.error || 'Không thể tải thông tin đơn hàng');
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const result = await api.put<Order>(`/api/orders/${id}`, {
      status: form.status,
      paymentStatus: form.paymentStatus,
      note: form.note || undefined,
      discount: Number(form.discount) || 0,
    });

    if (result.success) {
      setSuccess('Cập nhật đơn hàng thành công');
      if (result.data) {
        setOrder(result.data);
      }
    } else {
      setError(result.error || 'Không thể cập nhật đơn hàng');
    }

    setSaving(false);
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  function getPaymentBadge(status: string) {
    const colors: Record<string, string> = {
      UNPAID: 'bg-red-100 text-red-800',
      PAID: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  if (loading) {
    return (
      <>
        <header className="header">
          <h1 className="heading-1">Chi tiết đơn hàng</h1>
        </header>
        <div className="container-page">
          <p className="text-muted">Loading...</p>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <header className="header">
          <h1 className="heading-1">Chi tiết đơn hàng</h1>
        </header>
        <div className="container-page">
          <p className="text-red-600">{error || 'Không tìm thấy đơn hàng'}</p>
          <Button variant="secondary" onClick={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="header flex justify-between items-center">
        <h1 className="heading-1">Đơn hàng #{order.orderNumber}</h1>
        <Button variant="secondary" onClick={() => router.push('/dashboard/orders')}>
          Quay lại
        </Button>
      </header>

      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card>
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Khách hàng:</span>
                <span className="font-medium">{order.client?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{order.client?.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded text-sm ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thanh toán:</span>
                <span className={`px-2 py-1 rounded text-sm ${getPaymentBadge(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tạo:</span>
                <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Giảm giá:</span>
                <span>-${Number(order.discount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span>${Number(order.total || 0).toFixed(2)}</span>
              </div>
            </div>

            {order.note && (
              <>
                <hr className="my-4" />
                <div>
                  <span className="text-gray-600">Ghi chú:</span>
                  <p className="mt-1">{order.note}</p>
                </div>
              </>
            )}
          </Card>

          
          <Card>
            <h2 className="text-lg font-semibold mb-4">Cập nhật đơn hàng</h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-800">
                  {success}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 font-medium">Trạng thái đơn hàng</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Trạng thái thanh toán</label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Ghi chú</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Ghi chú..."
                />
              </div>

              <Button type="submit" variant="primary" loading={saving} className="w-full">
                Lưu thay đổi
              </Button>
            </form>
          </Card>
        </div>

        
        <Card className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm trong đơn</h2>
          
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Sản phẩm</th>
                    <th className="text-left p-3">Đơn giá</th>
                    <th className="text-left p-3">Số lượng</th>
                    <th className="text-left p-3">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{item.productName}</td>
                      <td className="p-3">${Number(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">${Number(item.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">Không có sản phẩm nào</p>
          )}
        </Card>
      </div>
    </>
  );
}
