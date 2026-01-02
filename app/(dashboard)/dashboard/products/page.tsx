'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, PageHeader, DataTable } from '@/app/components';
import { api } from '@/app/lib/api';
import { Product } from '@/app/types/product';
import { PaginatedResponse } from '@/app/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  async function fetchProducts() {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.set('search', search);

    const result = await api.get<PaginatedResponse<Product>>(`/api/products?${params}`);

    if (result.success && result.data) {
      setProducts(result.data.data || []);
      setTotal(result.data.total || 0);
    } else {
      setError(result.error || 'Failed to fetch products');
      setProducts([]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    setDeleting(id);
    const result = await api.delete(`/api/products/${id}`);

    if (result.success) {
      setProducts(products.filter(product => product.id !== id));
      setTotal(total - 1);
    } else {
      setError(result.error || 'Không thể xóa sản phẩm');
    }
    setDeleting(null);
  }

  function getStatusBadge(status: string) {
    return status === 'ACTIVE' ? 'badge-success' : 'badge-default';
  }

  function getStockBadge(quantity: number) {
    if (quantity <= 0) return 'badge-danger';
    if (quantity <= 10) return 'badge-warning';
    return 'badge-success';
  }

  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      key: 'name',
      header: 'Tên sản phẩm',
      render: (product: Product) => (
        <div>
          <Link href={`/dashboard/products/${product.id}`} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            {product.name}
          </Link>
          <div className="text-sm text-muted hidden-desktop">
            SKU: {product.sku || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'sku',
      header: 'SKU',
      className: 'hidden-mobile',
      render: (product: Product) => product.sku || '-',
    },
    {
      key: 'price',
      header: 'Giá',
      render: (product: Product) => (
        <span style={{ fontWeight: 600 }}>
          ${Number(product.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Tồn kho',
      className: 'hidden-mobile',
      render: (product: Product) => (
        <span className={`badge ${getStockBadge(product.quantity)}`}>
          {product.quantity} sp
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      className: 'hidden-mobile',
      render: (product: Product) => (
        <span className={`badge ${getStatusBadge(product.status)}`}>
          {product.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng bán'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerAlign: 'right' as const,
      render: (product: Product) => (
        <div className="table-actions">
          <Link href={`/dashboard/products/${product.id}`}>
            <Button variant="ghost" size="sm">Sửa</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(product.id)}
            loading={deleting === product.id}
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
        title="Sản phẩm"
        subtitle={`Quản lý ${total} sản phẩm trong kho`}
        actions={
          <Link href="/dashboard/products/new">
            <Button variant="primary">+ Thêm sản phẩm</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={products}
        keyField="id"
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        emptyIcon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
        }
        emptyTitle="Chưa có sản phẩm"
        emptyDescription="Thêm sản phẩm đầu tiên để bắt đầu"
        emptyAction={
          <Link href="/dashboard/products/new">
            <Button variant="primary">+ Thêm sản phẩm</Button>
          </Link>
        }
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        itemLabel="sản phẩm"
      />
    </div>
  );
}
