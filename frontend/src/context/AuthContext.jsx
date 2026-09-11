import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jph_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('jph_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data.data;
    localStorage.setItem('jph_token', token);
    setUser(userData);
    return userData;
  }

  async function signup(payload) {
    const res = await api.post('/auth/signup', payload);
    const { token, user: userData } = res.data.data;
    localStorage.setItem('jph_token', token);
    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem('jph_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
