'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

interface SidebarProps {
  navItems?: NavItem[];
  title?: string;
  onLogout?: () => void;
}

const defaultNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admins', label: 'Admins' },
  { href: '/settings', label: 'Settings' },
];

export function Sidebar({
  navItems = defaultNavItems,
  title = 'Admin Panel',
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <nav className="sidebar-nav">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {onLogout && (
        <div className="sidebar-footer">
          <button onClick={onLogout} className="w-full btn btn-danger">
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
