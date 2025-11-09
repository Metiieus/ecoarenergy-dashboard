import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('ecoar_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('ecoar_user', JSON.stringify(user));
      else localStorage.removeItem('ecoar_user');
    } catch (e) {}
  }, [user]);

  const login = useCallback(async (email, password) => {
    // Mock login: accept any non-empty email. In real app, call API.
    if (!email) throw new Error('Email obrigatório');
    const fakeUser = { email, name: email.split('@')[0] || 'User' };
    setUser(fakeUser);
    return fakeUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
