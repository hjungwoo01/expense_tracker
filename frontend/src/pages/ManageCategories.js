import React, { useState, useContext, useEffect } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditCategoryModal from '../components/EditCategoryModal';

const ManageCategories = () => {
  const [newCategory, setNewCategory] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories, addCategory, deleteCategory, loading, error, setError } = useContext(CategoryContext);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000); 
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    await addCategory(newCategory);
    setNewCategory('');
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };

  return (
    <Container maxWidth="sm" style={{ color: 'white', paddingTop: '20px' }}>
      <h1 align="center" gutterBottom>
        Manage Categories
      </h1>
      <form onSubmit={handleAddCategory}>
        <Box mb={2}>
          <TextField
            label="New Category"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
          Add Category
        </Button>
      </form>
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      <List>
        {categories.map((cat) => (
          <ListItem key={cat._id} style={{ color: 'white' }}>
            <ListItemText
              primary={cat.name}
              primaryTypographyProps={{ style: { color: 'white' } }}
            />
            <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(cat)}>
              <EditIcon sx={{ color: 'white' }} />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(cat._id)}>
              <DeleteIcon sx={{ color: 'white' }} />
            </IconButton>
          </ListItem>
        ))}
      </List>
      {selectedCategory && (
        <EditCategoryModal
          open={open}
          handleClose={handleModalClose}
          category={selectedCategory}
        />
      )}
    </Container>
  );
};

export default ManageCategories;
