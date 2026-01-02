'use client';

import { useState, useEffect } from 'react';
import { Header, Sidebar } from "../components";
import { AuthProvider } from "../context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <AuthProvider>
      <div className="dashboard-layout">
        <Sidebar 
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={handleMenuClick}
        />

        <div className="dashboard-main">
          <Header onMenuClick={handleMenuClick} />

          <main className="dashboard-content">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}