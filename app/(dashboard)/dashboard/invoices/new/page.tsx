'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, PageHeader } from '@/app/components';
import { api } from '@/app/lib/api';
import { Invoice } from '@/app/types/invoice';
import { Order } from '@/app/types/order';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      const result = await api.get<{ data: Order[] }>('/api/orders');
      if (result.success && result.data) {
        // Lọc các đơn hàng chưa có hóa đơn hoặc đã hoàn thành
        const availableOrders = result.data.data.filter(
          order => order.status !== 'CANCELLED'
        );
        setOrders(availableOrders);
      }
      setLoadingData(false);
    }
    fetchOrders();
  }, []);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!selectedOrderId) {
      setError('Vui lòng chọn đơn hàng');
      return;
    }

    setLoading(true);

    const result = await api.post<Invoice>('/api/invoices', {
      orderId: selectedOrderId,
    });

    if (result.success) {
      router.push('/dashboard/invoices');
    } else {
      setError(result.error || 'Không thể tạo hóa đơn');
    }

    setLoading(false);
  }

  if (loadingData) {
    return (
      <div className="page-container">
        <PageHeader title="Tạo hóa đơn mới" subtitle="Đang tải dữ liệu..." />
        <Card>
          <div className="loading-skeleton" style={{ height: '200px' }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Tạo hóa đơn mới"
        subtitle="Tạo hóa đơn từ đơn hàng"
        actions={
          <Link href="/dashboard/invoices">
            <Button variant="secondary">← Quay lại</Button>
          </Link>
        }
      />

      <Card className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <div className="form-group form-full">
            <label className="form-label">Chọn đơn hàng *</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">-- Chọn đơn hàng --</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.orderNumber} - {order.client?.name} - ${Number(order.total).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Order Preview */}
          {selectedOrder && (
            <div className="form-full">
              <div className="invoice-preview">
                <h3 className="invoice-preview-title">Thông tin đơn hàng</h3>
                
                <div className="invoice-preview-grid">
                  <div className="invoice-preview-item">
                    <span className="invoice-preview-label">Mã đơn:</span>
                    <span className="invoice-preview-value">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="invoice-preview-item">
                    <span className="invoice-preview-label">Khách hàng:</span>
                    <span className="invoice-preview-value">{selectedOrder.client?.name || '-'}</span>
                  </div>
                  <div className="invoice-preview-item">
                    <span className="invoice-preview-label">Trạng thái:</span>
                    <span className={`badge badge-${selectedOrder.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="invoice-preview-item">
                    <span className="invoice-preview-label">Thanh toán:</span>
                    <span className={`badge badge-${selectedOrder.paymentStatus === 'PAID' ? 'success' : 'danger'}`}>
                      {selectedOrder.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>

                <div className="invoice-preview-total">
                  <span>Tổng tiền:</span>
                  <span className="invoice-preview-total-value">${Number(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={loading} disabled={!selectedOrderId}>
              Tạo hóa đơn
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
