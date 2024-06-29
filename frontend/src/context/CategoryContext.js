import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, fetchCategories]);

  const addCategory = async (name) => {
    setLoading(true);
    try {
      const { data } = await api.post('/categories', { name });
      setCategories([...categories, data]);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async (id, name) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/categories/${id}`, { name });
      setCategories(categories.map((cat) => (cat._id === id ? data : cat)));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to edit category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, setError, fetchCategories, addCategory, editCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext, CategoryProvider };
