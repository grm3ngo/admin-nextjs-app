'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, PageHeader, DataTable } from '@/app/components';
import { Invoice, PaginatedResponse } from '@/app/types';
import { api } from '@/app/lib/api';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });
      
      const result = await api.get<PaginatedResponse<Invoice>>(`/api/invoices?${params}`);
      
      if (result.success && result.data) {
        setInvoices(result.data.data);
        setTotal(result.data.total);
      } else {
        setError(result.error || 'Không thể tải danh sách hóa đơn');
      }
      setLoading(false);
    }
    fetchInvoices();
  }, [page, search]);

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa hóa đơn này?')) return;

    const result = await api.delete(`/api/invoices/${id}`);
    if (result.success) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
      setTotal(total - 1);
    } else {
      alert(result.error || 'Không thể xóa hóa đơn');
    }
  }

  function getPaymentBadge(status: string) {
    const styles: Record<string, string> = {
      UNPAID: 'badge-danger',
      PAID: 'badge-success',
      PARTIAL: 'badge-warning',
    };
    return styles[status] || 'badge-default';
  }

  function formatDate(dateValue: Date | string | null) {
    if (!dateValue) return '-';
    return new Date(dateValue).toLocaleDateString('vi-VN');
  }

  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Mã hóa đơn',
      render: (invoice: Invoice) => (
        <div>
          <div style={{ fontWeight: 500 }}>{invoice.invoiceNumber}</div>
          <div className="text-sm text-muted hidden-desktop">
            ${Number(invoice.amount || 0).toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      header: 'Đơn hàng',
      render: (invoice: Invoice) => invoice.order?.orderNumber || '-',
    },
    {
      key: 'amount',
      header: 'Số tiền',
      className: 'hidden-mobile',
      render: (invoice: Invoice) => (
        <span style={{ fontWeight: 600 }}>
          ${Number(invoice.amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Thanh toán',
      className: 'hidden-mobile',
      render: (invoice: Invoice) => (
        <span className={`badge ${getPaymentBadge(invoice.paymentStatus)}`}>
          {invoice.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </span>
      ),
    },
    {
      key: 'paidAt',
      header: 'Ngày TT',
      className: 'hidden-mobile',
      render: (invoice: Invoice) => formatDate(invoice.paidAt),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerAlign: 'right' as const,
      render: (invoice: Invoice) => (
        <div className="table-actions">
          <Link href={`/dashboard/invoices/${invoice.id}`}>
            <Button variant="ghost" size="sm">Chi tiết</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(invoice.id)}
            style={{ color: 'var(--color-danger)' }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Hóa đơn"
        subtitle={`Quản lý ${total} hóa đơn trong hệ thống`}
        actions={
          <Link href="/dashboard/invoices/new">
            <Button variant="primary">+ Tạo hóa đơn</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={invoices}
        keyField="id"
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Tìm kiếm hóa đơn..."
        emptyIcon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        }
        emptyTitle="Chưa có hóa đơn"
        emptyDescription="Tạo hóa đơn đầu tiên để bắt đầu"
        emptyAction={
          <Link href="/dashboard/invoices/new">
            <Button variant="primary">+ Tạo hóa đơn</Button>
          </Link>
        }
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        itemLabel="hóa đơn"
      />
    </div>
  );
}
