import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CategoryContext } from '../context/CategoryContext';
import { Container, TextField, MenuItem, Button, Typography, Box, FormControl, InputLabel, Select } from '@mui/material';

const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('');
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
      await api.post('/expenses', expense);
      window.location.href = '/expenses';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ color: 'white', paddingTop: '20px' }}>
      <h1 align="center" gutterBottom>
        Add Expense
      </h1>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel style={{ color: 'white' }}>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              style={{ color: 'white' }}
            >
              <MenuItem value=""><em>Select a category</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <TextField
            label="Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true, style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel style={{ color: 'white' }}>Currency</InputLabel>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              label="Currency"
              style={{ color: 'white' }}
            >
              <MenuItem value=""><em>Select a currency</em></MenuItem>
              <MenuItem value="SGD">SGD</MenuItem>
              <MenuItem value="HKD">HKD</MenuItem>
              <MenuItem value="KRW">KRW</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Add Expense
        </Button>
      </form>
    </Container>
  );
};

export default AddExpense;
