import React, { createContext, useState, useEffect } from 'react';
import api, { authAPI } from '@/services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      authAPI.getProfile().then(res => setUser(res.data)).catch(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      });
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, adminSecret) => {
    const payload: any = { username: name, email, password };
    if (adminSecret) payload.adminSecret = adminSecret;
    const res = await authAPI.register(payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
