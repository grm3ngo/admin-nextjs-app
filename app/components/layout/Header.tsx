'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useUser } from '@/app/hooks/useUser';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  children?: ReactNode;
  userName?: string;
  userAvatar?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface HeaderProps {
  title?: string;
  children?: ReactNode;
  menuItems?: MenuItem[];
  onLogout?: () => void;
}

function getInitials(name: string) { return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)};

export function Header({ title, children, menuItems = [], onLogout }: HeaderProps) {
    const { user, isLoading } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsDropdownOpen(false);
        }
      }
      document.addEventListener('mousedown',handleClickOutside);
      return () => {
        document.removeEventListener('mousedown',handleClickOutside);
      }
    }, []);

    if (isLoading) {
    return (
      <header className="header">
        <div className="header-left">
          {title && <h1 className="header-title">{title}</h1>}
        </div>
        <div className="header-right">
          {children}
          <div className="header-user-skeleton">
            <div className="skeleton-avatar" />
            <div className="skeleton-text" />
          </div>
        </div>
      </header>
    );
  }

  const userName = user?.name || 'Admin';
  const userEmail = user?.email;
  const userAvatar = user?.avatarUrl;
  const initials = getInitials(userName);

  return (
    <header className="header">
      <div className="header-left">
        {title && <h1 className="header-title">{title}</h1>}
      </div>
      <div className="header-right">
        {children}
        
        <div className="header-user-dropdown" ref={dropdownRef}>
          <button 
            className="header-user-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <div 
              className="header-avatar"
              style={{ backgroundColor: userAvatar }}
            >
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="header-avatar-img" />
              ) : (
                <span className="header-avatar-initials">{initials}</span>
              )}
            </div>
            <div className="header-user-info">
              <span className="header-username">{userName}</span>
              {userEmail && <span className="header-useremail">{userEmail}</span>}
            </div>
            <svg 
              className={`header-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4 6l4 4 4-4H4z"/>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="header-dropdown-menu">
              <div className="dropdown-user-header">
                <div 
                  className="dropdown-avatar"
                  style={{ backgroundColor: userAvatar }}
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="dropdown-avatar-img" />
                  ) : (
                    <span className="dropdown-avatar-initials">{initials}</span>
                  )}
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-username">{userName}</span>
                  {userEmail && <span className="dropdown-useremail">{userEmail}</span>}
                </div>
              </div>
              
              <div className="dropdown-divider" />

              {menuItems.length > 0 && (
                <>
                  <div className="dropdown-section">
                    {menuItems.map((item, index) => (
                      <Link 
                        key={index}
                        href={item.href}
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.icon && <span className="dropdown-icon">{item.icon}</span>}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="dropdown-divider" />
                </>
              )}
              
              {onLogout && (
                <button 
                  className="dropdown-item dropdown-item-danger"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Đăng xuất
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


