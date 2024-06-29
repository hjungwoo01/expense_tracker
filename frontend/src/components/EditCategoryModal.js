import React, { useState, useContext } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { CategoryContext } from '../context/CategoryContext';

const EditCategoryModal = ({ open, handleClose, category }) => {
  const [editCategoryName, setEditCategoryName] = useState(category.name);
  const { editCategory, loading } = useContext(CategoryContext);

  const handleEditCategory = async (id) => {
    await editCategory(id, editCategoryName);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Edit Category
        </Typography>
        <TextField
          label="Category Name"
          fullWidth
          value={editCategoryName}
          onChange={(e) => setEditCategoryName(e.target.value)}
          variant="outlined"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          style={{ marginTop: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEditCategory(category._id)}
          disabled={loading}
          style={{ marginTop: '20px' }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: 'white',
  bgcolor: '#2b2d42'
};

export default EditCategoryModal;
