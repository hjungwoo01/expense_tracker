import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import api from '../services/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const EditExpenseModal = ({ open, handleClose, expense, updateExpenseList }) => {
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount);
    const [category, setCategory] = useState(expense.category);
    const [date, setDate] = useState(expense.date);
    const [currency, setCurrency] = useState(expense.currency);

    const handleSave = async () => {
        try {
            const updatedExpense = { description, amount, category, date, currency };
            const { data } = await api.put(`/expenses/${expense._id}`, updatedExpense);
            updateExpenseList(data);
            handleClose();
        } catch (error) {
            console.error('Failed to update expense', error);
        }
    };

    useEffect(() => {
        setDescription(expense.description);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(expense.date);
        setCurrency(expense.currency);
    }, [expense]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-expense-modal-title"
            aria-describedby="edit-expense-modal-description"
        >
            <Box sx={style}>
                <Typography id="edit-expense-modal-title" variant="h6" component="h2">
                    Edit Expense
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <MenuItem value="SGD">SGD</MenuItem>
                    <MenuItem value="HKD">HKD</MenuItem>
                    <MenuItem value="KRW">KRW</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default EditExpenseModal;
