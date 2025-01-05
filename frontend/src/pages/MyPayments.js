import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import Layout from '../components/Layout';
import { useQuery } from '@apollo/client';
import { GET_PAYMENT_HISTORY } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  const statusColors = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
    processing: 'info',
    cancelled: 'default',
  };
  return statusColors[status] || 'default';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

function MyPayments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_PAYMENT_HISTORY, {
    variables: { storeId: user?.store?.id },
    skip: !user?.store?.id,
  });

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error">{error.message}</Typography>
      </Layout>
    );
  }

  if (!user?.store?.id) {
    return (
      <Layout>
        <Typography color="error">No store associated with your account</Typography>
      </Layout>
    );
  }

  const payments = data?.payments || [];

  return (
    <Layout>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          My Payment History
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/do-payment')}
        >
          Pay Rent
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status || 'completed'}
                    color={getStatusColor(payment.status || 'completed')}
                    size="small"
                    sx={{ minWidth: 85, textTransform: 'capitalize' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export default MyPayments; 