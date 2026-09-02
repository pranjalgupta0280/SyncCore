import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('synccore_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            connectSocket(token);
          }
        } catch (err) {
          console.error('Failed to load user profile', err);
          localStorage.removeItem('synccore_token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (loginInput, password) => {
    const res = await API.post('/auth/login', { login: loginInput, password });
    if (res.data.success) {
      const userData = res.data.data;
      localStorage.setItem('synccore_token', userData.token);
      setUser(userData);
      connectSocket(userData.token);
      return userData;
    }
  };

  const register = async (name, email, username, password) => {
    const res = await API.post('/auth/register', { name, email, username, password });
    if (res.data.success) {
      const userData = res.data.data;
      localStorage.setItem('synccore_token', userData.token);
      setUser(userData);
      connectSocket(userData.token);
      return userData;
    }
  };

  const logout = () => {
    localStorage.removeItem('synccore_token');
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
