"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin } from '../types';

interface AuthContextType { //dinh nghia kieu cho context
  admin: Admin | null;       // thong tin admin
  isLoading: boolean;                 
  isAuthenticated: boolean;           
  login: (email: string, password: string) => Promise<boolean>;  // dnhap ; tra ve true/false
  logout: () => Promise<void>;        // logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); //tao context voi kieu AuthContextType hoac undefined

export function AuthProvider({ children }: { children: ReactNode }) { //tao provider de boc quanh app
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { // can kiem tra auth khi load app
    checkAuth();
  }, []);

  async function checkAuth() { //check xem token con hieu luc khong
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/auth/me', { //lay thong tin admin
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAdmin(data.data);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> { //dang nhap 
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      localStorage.setItem('token', data.data.token);

      setAdmin(data.data.admin);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async function logout(): Promise<void> { //dang xuat
    try {
      const token = localStorage.getItem('token');

      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setAdmin(null);
    }
  }

  const value: AuthContextType = { //gia tri cung cap boi Provider
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { //export hook de su dung context ra ngoai
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}