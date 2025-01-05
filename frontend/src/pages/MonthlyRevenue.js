import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useQuery } from '@apollo/client';
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
import Layout from '../components/Layout';
import { GET_MONTHLY_REVENUE } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function MonthlyRevenue() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { loading, error, data } = useQuery(GET_MONTHLY_REVENUE);

  useEffect(() => {
    if (data?.payments) {
      const monthlyData = Array(12).fill(0);
      const availableYears = new Set();

      data.payments.forEach(payment => {
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
          label: 'Monthly Revenue',
          data: monthlyData,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.dark,
          borderWidth: 1,
        }],
      });
    }
  }, [data, selectedYear, theme.palette.primary]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Revenue - ${selectedYear}`,
        font: {
          size: isMobile ? 16 : 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: ${formatCurrency(context.raw)}`,
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Typography color="error" variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          {error.message}
        </Typography>
      </Layout>
    );
  }

  const availableYears = Array.from(
    new Set(data.payments.map(payment => new Date(payment.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'stretch' : 'center'} gap={2} mb={3}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 'bold',
              flex: 1,
            }}
          >
            Monthly Revenue
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
            height: { xs: '50vh', sm: '60vh' },
            position: 'relative',
          }}
        >
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </Paper>
      </Box>
    </Layout>
  );
}

export default MonthlyRevenue; 