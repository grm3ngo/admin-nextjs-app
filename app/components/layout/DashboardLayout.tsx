'use client';

import { ReactNode, useState, useEffect } from 'react';

import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  headerChildren?: ReactNode;
}

export function DashboardLayout({
  children,
  title,
  headerChildren,
}: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClose = () => setIsOpen(false);
  const handleToggleCollapse = () => setIsCollapsed((prev) => !prev);
  const handleMenuClick = () => setIsOpen((prev) => !prev);

  return (
    <div className="layout-dashboard">
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        onClose={handleClose}
        onToggleCollapse={handleToggleCollapse}
      />

      <main className="main-content">
        <Header title={title} onMenuClick={handleMenuClick}>
          {headerChildren}
        </Header>

        <div className="container-page">{children}</div>
      </main>
    </div>
  );
}