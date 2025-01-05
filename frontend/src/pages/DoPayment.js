import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import Layout from '../components/Layout';
import { CREATE_PAYMENT } from '../services/api';
import { useAuth } from '../context/AuthContext';

function DoPayment() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-payments');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message || 'Failed to process payment');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await createPayment({
        variables: {
          data: {
            amount: amount.toString(),
            user: { connect: { id: user.id } },
            store: { connect: { id: user.store.id } }
          }
        }
      });
    } catch (err) {
    }
  };

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '2rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Make Payment
        </Typography>
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            maxWidth: 400, 
            mx: 'auto',
            borderRadius: { xs: 2, sm: 3 }
          }}
        >
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Payment successful! Redirecting...
            </Alert>
          )}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {error}
            </Alert>
          )}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              '& .MuiTextField-root': {
                mb: { xs: 2, sm: 3 }
              }
            }}
          >
            <TextField
              fullWidth
              label="Amount ($)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              inputProps={{ 
                min: 0, 
                step: "0.01",
                style: { 
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  padding: isMobile ? '12px' : '16px'
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || success}
              sx={{
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Processing...' : 'Submit Payment'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default DoPayment; 