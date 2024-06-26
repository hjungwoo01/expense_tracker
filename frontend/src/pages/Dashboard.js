import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import AddExpenseModal from '../components/AddExpenseModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/expenses')
      .then(response => setExpenses(response.data))
      .catch(error => console.error(error));
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="overview">
        <div className="overview-item">Total spend: $852.8</div>
        <div className="overview-item">You owe: $325.8</div>
        <div className="overview-item">You get back: $527</div>
        <div className="overview-item">Settled up: $746.3</div>
      </div>
      <div className="expense-history">
        <h2>Expense History</h2>
        <ul>
          {expenses.map(expense => (
            <li key={expense._id}>{expense.description} - ${expense.amount}</li>
          ))}
        </ul>
      </div>
      <div className="statistics">
        <h2>Expense Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={expenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <button className="add-expense-btn" onClick={toggleModal}>+</button>
      {modalOpen && <AddExpenseModal toggleModal={toggleModal} />}
    </div>
  );
};

export default Dashboard;
