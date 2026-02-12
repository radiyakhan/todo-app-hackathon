'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { User, UserSession } from '@/types/user';

interface AuthContextType extends UserSession {
  signin: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  signout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await api.auth.me();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (email: string, password: string): Promise<User> => {
    const response = await api.auth.signin({ email, password });
    setUser(response);
    return response;
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<User> => {
    const response = await api.auth.signup({ email, password, name });
    setUser(response);
    return response;
  };

  const signout = async (): Promise<void> => {
    await api.auth.signout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await api.auth.me();
      setUser(user);
    } catch {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signin,
    signup,
    signout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
