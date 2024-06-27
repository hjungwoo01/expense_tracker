import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import '../styles/AddExpenseModal.css';

const AddExpenseModal = ({ toggleModal, addExpenseToList }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('');
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { categories, fetchCategories } = useContext(CategoryContext);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to add expenses');
      return;
    }
    const expense = { description, amount, category, date, currency };
    try {
      const response = await api.post('/expenses', expense);
      addExpenseToList(response.data);
      toggleModal();
    } catch (error) {
      console.error(error);
      setError('Failed to add expense');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={toggleModal}>&times;</span>
        <h2>Add Expense</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Description:</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label>Currency:</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} required>
              <option value="">Select a currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              {/* Add more currencies as needed */}
            </select>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
