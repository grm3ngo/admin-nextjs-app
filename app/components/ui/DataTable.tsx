'use client';

import { ReactNode } from 'react';
import { SearchBox } from './SearchBox';
import { Card } from './Card';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerAlign?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  error?: string | null;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  // Search
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  loading = false,
  error = null,
  emptyIcon,
  emptyTitle = 'Không có dữ liệu',
  emptyDescription = 'Chưa có dữ liệu nào',
  emptyAction,
  searchPlaceholder = 'Tìm kiếm...',
  searchValue,
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemLabel = 'mục',
  onPageChange,
}: DataTableProps<T>) {
  return (
    <Card noPadding>
      {/* Search Bar */}
      {onSearchChange && (
        <div className="data-table-toolbar">
          <SearchBox
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger" style={{ margin: '1rem' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="data-table-loading">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="loading-skeleton" style={{ height: '3rem', marginBottom: '0.5rem' }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          {emptyIcon}
          <p className="empty-state-title">{emptyTitle}</p>
          <p className="empty-state-text">{emptyDescription}</p>
          {emptyAction}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th 
                      key={col.key} 
                      className={`${col.hideOnMobile ? 'hidden-mobile' : ''} ${col.className || ''}`}
                      style={col.headerAlign ? { textAlign: col.headerAlign } : undefined}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={String(item[keyField])}>
                    {columns.map(col => (
                      <td 
                        key={col.key}
                        className={`${col.hideOnMobile ? 'hidden-mobile' : ''} ${col.className || ''}`}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && onPageChange && (
            <div className="pagination">
              <span className="pagination-info">
                Trang {currentPage} / {totalPages} ({totalItems} {itemLabel})
              </span>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  ← Trước
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
