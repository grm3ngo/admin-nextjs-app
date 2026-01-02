'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, actions, children }: PageHeaderProps) {
  return (
    <div className="page-header-wrapper">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && (
          <div className="page-header-actions">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
