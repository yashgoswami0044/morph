import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('morph_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, role, region) => {
    const rawName = email.split('@')[0] || 'user';
    const name = rawName.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const userData = { email, role, region, name };
    setUser(userData);
    localStorage.setItem('morph_user', JSON.stringify(userData));

    // Role-based routing
    if (role === 'CRM Head') return '/analytics';
    if (role === 'Regional Manager') return '/review';
    if (role === 'Sales Manager') return '/';
    if (role === 'Sales Executive') return '/leads';
    return '/';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('morph_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
