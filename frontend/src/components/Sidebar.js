import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Welcome!</h2>
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/expenses">
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItemButton>
        <ListItemButton component={Link} to="/add-expense">
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="Add Expense" />
        </ListItemButton>
        <ListItemButton  component={Link} to="/manage-categories">
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Manage Categories" />
        </ListItemButton>
        {user ? (
          <ListItemButton onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : (
          <>
            <ListItemButton component={Link} to="/login">
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </>
        )}
      </List>
    </div>
  );
};

export default Sidebar;
