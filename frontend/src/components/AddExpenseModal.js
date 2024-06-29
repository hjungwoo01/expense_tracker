import React, { useState, useContext, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <IconButton className="close-btn" onClick={toggleModal}>
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
        <h2 variant="h4" align="center" gutterBottom style={{ color: 'white' }}>
          Add Expense
        </h2>
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        <Container maxWidth="sm">
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
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
                required
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel sx={{ color: 'white' }}>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="" disabled>Select a category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
                required
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel sx={{ color: 'white' }}>Currency</InputLabel>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  label="Currency"
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="" disabled>Select a currency</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="SGD">SGD</MenuItem>
                  <MenuItem value="KRW">KRW</MenuItem>
                  <MenuItem value="HKD">HKD</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Expense
            </Button>
          </form>
        </Container>
      </div>
    </div>
  );
};

export default AddExpenseModal;
