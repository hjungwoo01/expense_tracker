import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ExpenseList from './pages/ExpenseList';
import AddExpense from './pages/AddExpense';
import ManageCategories from './pages/ManageCategories';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <Router>
          <div className="app">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/expenses" element={<ExpenseList />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/manage-categories" element={<ManageCategories />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
