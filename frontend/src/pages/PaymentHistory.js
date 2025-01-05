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
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Layout from '../components/Layout';
import { useQuery } from '@apollo/client';
import { GET_PAYMENT_HISTORY, GET_STORE } from '../services/api';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

function PaymentHistory() {
  const { storeId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  
  const { loading: storeLoading, error: storeError, data: storeData } = useQuery(GET_STORE, {
    variables: { id: storeId },
    skip: !storeId,
  });

  const { loading: paymentsLoading, error: paymentsError, data: paymentsData } = useQuery(GET_PAYMENT_HISTORY, {
    variables: { storeId },
    skip: !storeId,
  });

  const loading = storeLoading || paymentsLoading;
  const error = storeError || paymentsError;

  useEffect(() => {
    if (paymentsData?.payments) {
      const monthlyData = Array(12).fill(0);
      const availableYears = new Set();

      paymentsData.payments.forEach(payment => {
        const date = new Date(payment.createdAt);
        const year = date.getFullYear();
        availableYears.add(year);

        if (year === selectedYear) {
          const month = date.getMonth();
          monthlyData[month] += parseFloat(payment.amount);
        }
      });

      setChartData({
        labels: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [{
          label: 'Monthly Rent Payments',
          data: monthlyData,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.dark,
          borderWidth: 1,
        }],
      });
    }
  }, [paymentsData, selectedYear, theme.palette.primary]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Rent Payments - ${selectedYear}`,
        font: {
          size: isMobile ? 16 : 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Rent Payment: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  if (loading) {
    return (
      <Layout>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography 
          color="error" 
          variant="h6" 
          sx={{ textAlign: 'center', mt: 4 }}
        >
          {error.message}
        </Typography>
      </Layout>
    );
  }

  if (!storeId) {
    return (
      <Layout>
        <Typography 
          color="error" 
          variant="h6" 
          sx={{ textAlign: 'center', mt: 4 }}
        >
          Store ID is required
        </Typography>
      </Layout>
    );
  }

  const store = storeData?.store;
  const payments = paymentsData?.payments || [];
  const availableYears = Array.from(
    new Set(payments.map(payment => new Date(payment.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  const MobileView = () => (
    <Grid container spacing={2}>
      {payments.map((payment) => (
        <Grid item xs={12} key={payment.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" component="div">
                  {formatDate(payment.createdAt)}
                </Typography>
                <Chip
                  label={payment.status || 'completed'}
                  color={getStatusColor(payment.status || 'completed')}
                  size="small"
                  sx={{ minWidth: 85, textTransform: 'capitalize' }}
                />
              </Box>
              <Typography variant="h6" color="primary">
                {formatCurrency(payment.amount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const DesktopView = () => (
    <TableContainer 
      component={Paper}
      sx={{ 
        boxShadow: 2,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment Date</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow 
              key={payment.id}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
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
  );

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '2rem' }
          }}
        >
          {store?.name} - Payment History
        </Typography>

        <Box mb={4}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'stretch' : 'center'} gap={2} mb={3}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Monthly Overview
            </Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              height: { xs: '40vh', sm: '50vh' },
              position: 'relative',
            }}
          >
            {chartData && <Bar data={chartData} options={chartOptions} />}
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment Details
          </Typography>
          {isMobile ? <MobileView /> : <DesktopView />}
        </Box>
      </Box>
    </Layout>
  );
}

export default PaymentHistory; 