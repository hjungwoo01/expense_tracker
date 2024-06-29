import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { List, ListItem, ListItemText, IconButton, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditExpenseModal from '../components/EditExpenseModal';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    if (user) {
      api.get('/expenses')
        .then(response => {
          setExpenses(response.data);
          filterExpenses(response.data, year, month);
        })
        .catch(error => console.error(error));
    }
  }, [user, year, month]);

  const filterExpenses = (expenses, year, month) => {
    const filtered = expenses
      .filter(expense =>
        new Date(expense.date).getMonth() + 1 === month &&
        new Date(expense.date).getFullYear() === year
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredExpenses(filtered);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleDelete = async (id) => {
    console.log(`Attempting to delete expense with id: ${id}`);
    try {
      const response = await api.delete(`/expenses/${id}`);
      console.log(`Delete response:`, response);
      const updatedExpenses = expenses.filter(expense => expense._id !== id);
      setExpenses(updatedExpenses);
      filterExpenses(updatedExpenses, year, month);
    } catch (error) {
      console.error(`Failed to delete expense with id: ${id}`, error);
    }
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedExpense(null);
  };

  const updateExpenseList = (updatedExpense) => {
    const updatedExpenses = expenses.map(expense => expense._id === updatedExpense._id ? updatedExpense : expense);
    setExpenses(updatedExpenses);
    filterExpenses(updatedExpenses, year, month);
  };

  return (
    <div style={{ color: 'white' }}>
      <h1 gutterBottom>
        Expense List
      </h1>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl variant="outlined" sx={{ width: 150 }}>
          <InputLabel sx={{ color: 'white' }}>Month</InputLabel>
          <Select
            value={month}
            onChange={handleMonthChange}
            label="Month"
            sx={{ color: 'white', '.MuiSvgIcon-root': { color: 'white' } }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MenuItem key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: 150 }}>
          <InputLabel sx={{ color: 'white' }}>Year</InputLabel>
          <Select
            value={year}
            onChange={handleYearChange}
            label="Year"
            sx={{ color: 'white', '.MuiSvgIcon-root': { color: 'white' } }}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <List>
        {filteredExpenses.map(expense => (
          <ListItem key={expense._id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(expense)}>
                <EditIcon sx={{ color: 'white' }} />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(expense._id)}>
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            </>
          }>
            <ListItemText
              primary={`${expense.description} - ${expense.amount} ${expense.currency}`}
              secondary={`on ${new Date(expense.date).toLocaleDateString()}`}
              primaryTypographyProps={{ style: { color: 'white' } }}
              secondaryTypographyProps={{ style: { color: 'white' } }}
            />
          </ListItem>
        ))}
      </List>
      {selectedExpense && (
        <EditExpenseModal
          open={open}
          handleClose={handleModalClose}
          expense={selectedExpense}
          updateExpenseList={updateExpenseList}
        />
      )}
    </div>
  );
};

export default ExpenseList;
