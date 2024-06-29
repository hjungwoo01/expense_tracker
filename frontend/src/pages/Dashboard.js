import React, { useState, useContext, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AddExpenseModal from '../components/AddExpenseModal';
import { Box, Typography, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
import '../styles/Dashboard.css';
import { getTodaySpending, getWeekSpending, getMonthSpending, getYearSpending, filterExpensesByPeriod, groupExpensesByDay, groupExpensesByWeek, groupExpensesByMonth, groupExpensesByYear, groupExpensesByCategory } from '../utils/spendingUtils';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [spendingChartData, setSpendingChartData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState('month');
  const { user } = useContext(AuthContext);

  const exchangeRates = {
    KRW: 0.00078,
    SGD: 0.74,
    HKD: 0.13,
    USD: 1
  };

  const convertToUSD = (amount, currency) => {
    return amount * exchangeRates[currency];
  };

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

  const generateChartData = (expenses, months) => {
    const data = [];
    const currentDate = new Date();
    for (let i = 0; i < months; i++) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month.getMonth() && expenseDate.getFullYear() === month.getFullYear();
      });
      const totalSpending = monthExpenses.reduce((acc, curr) => acc + convertToUSD(curr.amount, curr.currency), 0);
      data.unshift({ month: month.toLocaleString('default', { month: 'short', year: 'numeric' }), spending: totalSpending });
    }
    return data;
  };

  useEffect(() => {
    const chartData = generateChartData(expenses, selectedPeriod);
    setSpendingChartData(chartData);
  }, [expenses, selectedPeriod]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(parseInt(event.target.value, 10));
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
    <Box className="dashboard">
      <h1 align="center" gutterBottom>
        Dashboard
      </h1>
      <Box className="overview" sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <Box className="overview-item" sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Spent Today</Typography>
          <Typography variant="body1">${convertToUSD(todaySpending, 'USD').toFixed(2)} USD</Typography>
        </Box>
        <Box className="overview-item" sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Spent This Week</Typography>
          <Typography variant="body1">${convertToUSD(weekSpending, 'USD').toFixed(2)} USD</Typography>
        </Box>
        <Box className="overview-item" sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Spent This Month</Typography>
          <Typography variant="body1">${convertToUSD(monthSpending, 'USD').toFixed(2)} USD</Typography>
        </Box>
        <Box className="overview-item" sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Spent This Year</Typography>
          <Typography variant="body1">${convertToUSD(yearSpending, 'USD').toFixed(2)} USD</Typography>
        </Box>
      </Box>
      <Box className="controls" sx={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'white' }}>View By</InputLabel>
          <Select
            value={viewType}
            onChange={handleViewTypeChange}
            label="View By"
            sx={{
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' }, // Change icon color
            }}
          >
            <MenuItem value="day" sx={{ color: 'black' }}>Day</MenuItem>
            <MenuItem value="week" sx={{ color: 'black' }}>Week</MenuItem>
            <MenuItem value="month" sx={{ color: 'black' }}>Month</MenuItem>
            <MenuItem value="year" sx={{ color: 'black' }}>Year</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120 }} disabled={viewType === 'year'}>
          <InputLabel sx={{ color: 'white' }}>Select Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Select Month"
            sx={{
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' }, // Change icon color
            }}
          >
            {[...Array(12).keys()].map(i => (
              <MenuItem key={i + 1} value={i + 1} sx={{ color: 'black' }}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'white' }}>Select Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            label="Select Year"
            sx={{
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' }, // Change icon color
            }}
          >
            {[...Array(5).keys()].map(i => {
              const year = new Date().getFullYear() - i;
              return (
                <MenuItem key={year} value={year} sx={{ color: 'black' }}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'white' }}>Select Period</InputLabel>
          <Select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            label="Select Period"
            sx={{
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' },
            }}
          >
            <MenuItem value={3} sx={{ color: 'black' }}>Past 3 Months</MenuItem>
            <MenuItem value={6} sx={{ color: 'black' }}>Past 6 Months</MenuItem>
            <MenuItem value={9} sx={{ color: 'black' }}>Past 9 Months</MenuItem>
            <MenuItem value={12} sx={{ color: 'black' }}>Past 12 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className="chart-row" sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <Box className="expense-history" sx={{ flex: 1, marginRight: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Expense History
          </Typography>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {filteredExpenses.map(expense => (
              <li key={expense._id} style={{ padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                {expense.description} - ${convertToUSD(expense.amount, expense.currency).toFixed(2)} on {new Date(expense.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </Box>
        <Box className="pie-chart" sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Spending by Category
          </Typography>
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
        </Box>
      </Box>
      <Box sx={{ height: 250, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Spending Over Time
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spendingChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="spending" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleModal}
        sx={{ position: 'fixed', bottom: '20px', right: '20px', borderRadius: '50%', width: '60px', height: '60px', fontSize: '30px' }}
      >
        +
      </Button>
      {modalOpen && <AddExpenseModal toggleModal={toggleModal} addExpenseToList={addExpenseToList} />}
    </Box>
  );
};

export default Dashboard;
