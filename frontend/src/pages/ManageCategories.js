import React, { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';

const ManageCategories = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const { categories, addCategory, editCategory, deleteCategory, loading, error } = useContext(CategoryContext);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    await addCategory(newCategory);
    setNewCategory('');
  };

  const handleEditCategory = async (id) => {
    await editCategory(id, editCategoryName);
    setEditCategoryName('');
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };

  return (
    <div>
      <h1>Manage Categories</h1>
      <form onSubmit={handleAddCategory}>
        <div>
          <label>New Category:</label>
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>Add Category</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            {cat.name}
            <button onClick={() => handleDeleteCategory(cat._id)}>Delete</button>
            <form onSubmit={(e) => {e.preventDefault(); handleEditCategory(cat._id)}}>
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
              <button type="submit" disabled={loading}>Edit</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
