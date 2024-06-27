import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Token decoding failed:', error);
        localStorage.removeItem('authToken');
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('token');
    if (googleToken) {
      localStorage.setItem('authToken', googleToken);
      try {
        const decodedUser = jwtDecode(googleToken);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${googleToken}`;
        window.history.replaceState({}, document.title, "/"); // Clear token from URL
      } catch (error) {
        console.error('Google token decoding failed:', error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('authToken', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(jwtDecode(data.token));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to log in');
      console.error('Login error:', error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, name, email) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { username, password, name, email });
      localStorage.setItem('authToken', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(jwtDecode(data.token));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register');
      console.error('Register error:', error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
