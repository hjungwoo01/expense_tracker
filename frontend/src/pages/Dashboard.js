import React, { useState, useContext, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AddExpenseModal from '../components/AddExpenseModal';
import '../styles/Dashboard.css';
import { getTodaySpending, getWeekSpending, getMonthSpending, getYearSpending, filterExpensesByPeriod, groupExpensesByDay, groupExpensesByWeek, groupExpensesByMonth, groupExpensesByYear, groupExpensesByCategory } from '../utils/spendingUtils';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [viewType, setViewType] = useState('month'); // Default view type
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      return;
    }

    api.get('/expenses')
      .then(response => {
        setExpenses(response.data);
        updateExpenses(response.data, selectedMonth, selectedYear, viewType);
      })
      .catch(error => console.error(error));
  }, [user, selectedMonth, selectedYear, viewType]);

  const updateExpenses = (expenses, month, year, view) => {
    let filtered, grouped;
    switch (view) {
      case 'day':
        filtered = filterExpensesByPeriod(expenses, 'day', month, year);
        grouped = groupExpensesByDay(filtered);
        break;
      case 'week':
        filtered = filterExpensesByPeriod(expenses, 'week', month, year);
        grouped = groupExpensesByWeek(filtered);
        break;
      case 'year':
        filtered = filterExpensesByPeriod(expenses, 'year', month, year);
        grouped = groupExpensesByYear(filtered);
        break;
      default:
        filtered = filterExpensesByPeriod(expenses, 'month', month, year);
        grouped = groupExpensesByMonth(filtered);
    }
    setFilteredExpenses(filtered);
    setGroupedExpenses(grouped);
    setCategoryExpenses(groupExpensesByCategory(filtered));
  };

  useEffect(() => {
    updateExpenses(expenses, selectedMonth, selectedYear, viewType);
  }, [expenses, selectedMonth, selectedYear, viewType]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  const addExpenseToList = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const todaySpending = getTodaySpending(expenses);
  const weekSpending = getWeekSpending(expenses);
  const monthSpending = getMonthSpending(expenses);
  const yearSpending = getYearSpending(expenses);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="overview">
        <div className="overview-item">Spent Today: ${todaySpending}</div>
        <div className="overview-item">Spent This Week: ${weekSpending}</div>
        <div className="overview-item">Spent This Month: ${monthSpending}</div>
        <div className="overview-item">Spent This Year: ${yearSpending}</div>
      </div>
      <div className="controls">
        <label htmlFor="view-type-select">View By: </label>
        <select id="view-type-select" value={viewType} onChange={handleViewTypeChange}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <label htmlFor="month-select">Select Month: </label>
        <select id="month-select" value={selectedMonth} onChange={handleMonthChange} disabled={viewType === 'year'}>
          {[...Array(12).keys()].map(i => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <label htmlFor="year-select">Select Year: </label>
        <select id="year-select" value={selectedYear} onChange={handleYearChange}>
          {[...Array(5).keys()].map(i => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>{year}</option>
            );
          })}
        </select>
      </div>
      <div className="chart-row">
        <div className="expense-history">
          <h2>Expense History</h2>
          <ul>
            {filteredExpenses.map(expense => (
              <li key={expense._id}>{expense.description} - ${expense.amount}</li>
            ))}
          </ul>
        </div>
        <div className="pie-chart">
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryExpenses}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="statistics">
        <h2>Expense Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={groupedExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button className="add-expense-btn" onClick={toggleModal}>+</button>
      {modalOpen && <AddExpenseModal toggleModal={toggleModal} addExpenseToList={addExpenseToList} />}
    </div>
  );
};

export default Dashboard;
