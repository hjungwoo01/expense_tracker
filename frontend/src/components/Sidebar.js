import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon from '@mui/icons-material/Assignment';
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
      <h2 className="sidebar-title">Hey, {user ? user.username : 'Guest'}</h2>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/calendar">
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>
        <ListItem button component={Link} to="/activities">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Activities" />
        </ListItem>
        <ListItem button component={Link} to="/expenses">
          <ListItemIcon><ListIcon /></ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItem>
        <ListItem button component={Link} to="/add-expense">
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="Add Expense" />
        </ListItem>
        <ListItem button component={Link} to="/manage-categories">
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Manage Categories" />
        </ListItem>
        {user ? (
          <ListItem button onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );
};

export default Sidebar;
