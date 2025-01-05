import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, handleAuthResponse } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await loginMutation({
        variables: { email, password }
      });
      
      const authResponse = handleAuthResponse(response);
      const { user, sessionToken } = authResponse.data;
      
      if (!user || !user.role) {
        throw new Error('Invalid user data received');
      }
      
      localStorage.setItem('token', sessionToken);
      login(user);
      
      if (user.role === 'STORE_OWNER') {
        navigate('/my-payments');
      } else if (user.role === 'MANAGER' && user.managedMall) {
        navigate(`/malls/${user.managedMall.id}`);
      } else {
        navigate('/malls');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{
        px: { xs: 2, sm: 0 }
      }}
    >
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            width: '100%',
            maxWidth: '400px',
            borderRadius: { xs: 0, sm: 1 }
          }}
        >
          <Typography 
            component="h1" 
            variant={isMobile ? "h6" : "h5"} 
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Shopping Mall Management
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              mt: { xs: 2, sm: 3 }
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: '45px', sm: '56px' }
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: '45px', sm: '56px' }
                }
              }}
            />
            {error && (
              <Typography 
                color="error" 
                align="center" 
                sx={{ 
                  mt: 2,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: { xs: 2, sm: 3 }, 
                mb: { xs: 1, sm: 2 },
                height: { xs: '45px', sm: '56px' },
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 