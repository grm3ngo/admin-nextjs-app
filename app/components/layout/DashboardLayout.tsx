'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  headerChildren?: ReactNode;
  userName?: string;
  userAvatar?: string;
}

export function DashboardLayout({
  children,
  title,
  headerChildren,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <div className={`layout-dashboard ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onLogout={handleLogout} />

      <main className="main-content">
        <Header title={title} userName={userName} userAvatar={userAvatar}>
          {headerChildren}
        </Header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
