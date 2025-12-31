'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className="layout-dashboard">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <Header title={title} onMenuClick={() => {}}>
          {headerChildren}
        </Header>

        <div className="container-page">{children}</div>
      </main>
    </div>
  );
}
