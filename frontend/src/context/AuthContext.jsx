import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('studentpulse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('studentpulse_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('studentpulse_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('studentpulse_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Auth verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('studentpulse_token', access_token);
    localStorage.setItem('studentpulse_user', JSON.stringify(loggedUser));
    setToken(access_token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { access_token, user: newUser } = res.data;
    localStorage.setItem('studentpulse_token', access_token);
    localStorage.setItem('studentpulse_user', JSON.stringify(newUser));
    setToken(access_token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('studentpulse_token');
    localStorage.removeItem('studentpulse_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('studentpulse_user', JSON.stringify(res.data));
    } catch (err) {
      console.error("Refresh user failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

