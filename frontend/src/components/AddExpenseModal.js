import React, { useState } from 'react';
import api from '../services/api';
import '../styles/AddExpenseModal.css';

const AddExpenseModal = ({ toggleModal }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const expense = { description, amount, category };
    api.post('/expenses', expense)
      .then(response => {
        console.log(response.data);
        toggleModal();
        // You may want to update the expense list on the Dashboard after adding an expense
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={toggleModal}>&times;</span>
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Description:</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label>Category:</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
