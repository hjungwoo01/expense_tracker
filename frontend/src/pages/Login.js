import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    if (!error) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm" style={{ color: 'white', paddingTop: '20px' }}>
      <h1 align="center" gutterBottom>
        Login
      </h1>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
          Login
        </Button>
        {error && <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>{error}</Typography>}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => window.location.href = 'http://localhost:1000/api/auth/google'}
          sx={{ marginTop: 2 }}
        >
          Log in with Google
        </Button>
      </form>
      <Typography variant="body2" sx={{ marginTop: 2 }} align="center">
        Don't have an account? <Link to="/register" style={{ color: 'white' }}>Register here</Link>
      </Typography>
    </Container>
  );
};

export default Login;
