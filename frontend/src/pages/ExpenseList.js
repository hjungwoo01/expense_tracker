import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      api.get('/expenses')
        .then(response => setExpenses(response.data))
        .catch(error => console.error(error));
    }
  }, [user]);

  return (
    <div>
      <h1>Expense List</h1>
      <ul>
        {expenses.map(expense => (
          <li key={expense._id}>
            {expense.description} - {expense.amount} {expense.currency} on {new Date(expense.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
