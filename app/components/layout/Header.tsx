'use client';

import { ReactNode } from 'react';

interface HeaderProps {
  title?: string;
  children?: ReactNode;
  onMenuClick?: () => void;
}

export function Header({ title, children, onMenuClick }: HeaderProps) {
  return (
    <header className="header flex-responsive items-center justify-between">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="btn btn-secondary lg:hidden"
          >
            Menu
          </button>
        )}
        {title && <h1 className="heading-1">{title}</h1>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </header>
  );
}
