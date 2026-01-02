'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
import { useAuth } from '@/app/context/AuthContext';

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
  children?: React.ReactNode;
}

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Header({ title, onMenuClick, children }: HeaderProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userName = user?.name || 'Admin';
  const userEmail = user?.email || '';
  const avatarColor = stringToColor(userName);
  const initials = getInitials(userName);

  return (
    <header className="header-container">
      
      <button 
        onClick={onMenuClick}
        className="header-menu-btn md:hidden"
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>

      
      <div className="flex-1" />

      
      <div className="header-actions">

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="header-user-btn"
          >
            {isLoading ? (
              <div className="header-avatar loading" />
            ) : (
              <div 
                className="header-avatar"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
            )}
            <div className="header-user-info">
              <span className="header-user-name">
                {isLoading ? '...' : userName}
              </span>
              <span className="header-user-role">Administrator</span>
            </div>
            <svg 
              className={`header-chevron ${isDropdownOpen ? 'rotate' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="header-dropdown">
              <div className="header-dropdown-header">
                <div 
                  className="header-avatar large"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
                <div>
                  <p className="header-dropdown-name">{userName}</p>
                  <p className="header-dropdown-email">{userEmail}</p>
                </div>
              </div>

              <div className="header-dropdown-footer">
                <button
                  onClick={handleLogout}
                  className="header-dropdown-item logout"
                >
                  <svg className="header-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}