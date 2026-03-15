import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, ROLE_PORTALS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('forensic_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (username, password, role) => {
    const found = mockUsers.find(u => u.username === username && u.password === password && u.role === role);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('forensic_user', JSON.stringify(safeUser));
      return { success: true, portal: ROLE_PORTALS[found.role] };
    }
    return { success: false, error: 'Invalid credentials or role mismatch' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('forensic_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
