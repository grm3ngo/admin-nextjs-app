'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  client: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  orders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  invoice: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  product: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navItems: NavSection[] = [
  {
    section: 'Tổng quan',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: icons.dashboard },
    ],
  },
  {
    section: 'Quản lý',
    items: [
      { label: 'Quản trị viên', href: '/dashboard/admins', icon: icons.users },
      { label: 'Khách hàng', href: '/dashboard/clients', icon: icons.client },
    ],
  },
  {
    section: 'Kinh doanh',
    items: [
      { label: 'Đơn hàng', href: '/dashboard/orders', icon: icons.orders },
      { label: 'Hóa đơn', href: '/dashboard/invoices', icon: icons.invoice },
      { label: 'Sản phẩm', href: '/dashboard/products', icon: icons.product },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, isCollapsed, isMobile, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      
      {isOpen && isMobile && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed && !isMobile ? 'collapsed' : ''} h-screen`}>
        
        <div className="sidebar-header">
          {!isCollapsed || isMobile ? (
            <Link href="/dashboard" className="sidebar-logo">
              <span className="sidebar-logo-text">Admin Panel</span>
            </Link>
          ) : (
            <Link href="/dashboard" className="sidebar-logo-collapsed">
              A
            </Link>
          )}
        </div>

        
        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.section} className="sidebar-section">
              {(!isCollapsed || isMobile) && (
                <h3 className="sidebar-section-title">{group.section}</h3>
              )}
              <ul className="sidebar-menu">
                {group.items.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={isMobile ? onClose : undefined}
                        title={item.label}
                        className={`sidebar-link ${isActive ? 'active' : ''}`}
                      >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        {(!isCollapsed || isMobile) && (
                          <span className="sidebar-link-text">{item.label}</span>
                        )}
                        {isActive && (!isCollapsed || isMobile) && (
                          <span className="sidebar-link-indicator" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export { icons };