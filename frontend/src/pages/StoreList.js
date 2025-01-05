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
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { GET_MALL } from '../services/api';

function StoreList() {
  const { mallId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_MALL, {
    variables: { id: mallId },
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return (
    <Layout>
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>
    </Layout>
  );

  if (error) {
    return (
      <Layout>
        <Typography color="error" variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Error loading mall details
        </Typography>
      </Layout>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const MobileView = () => (
    <Grid container spacing={2}>
      {data.mall.stores.map((store) => (
        <Grid item xs={12} key={store.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {store.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Monthly Rent: {formatCurrency(store.rentAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Owner: {store.owner?.name || 'No Owner Assigned'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Payments: {store.payments?.length || 0} payments
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => navigate(`/stores/${store.id}/payments`)}
              >
                View Details
              </Button>
            </CardActions>
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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Store Name</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Monthly Rent</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Store Owner</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Total Payments</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.mall.stores.map((store) => (
            <TableRow 
              key={store.id}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <TableCell>{store.name}</TableCell>
              <TableCell align="right">{formatCurrency(store.rentAmount)}</TableCell>
              <TableCell>{store.owner?.name || 'No Owner Assigned'}</TableCell>
              <TableCell align="right">
                {store.payments?.length || 0} payments
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/stores/${store.id}/payments`)}
                >
                  Detail
                </Button>
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
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            mb: { xs: 2, sm: 3 },
            flexWrap: 'wrap'
          }}
        >
          {isMobile ? (
            <IconButton 
              onClick={() => navigate('/malls')}
              sx={{ p: 0 }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Button 
              variant="outlined" 
              onClick={() => navigate('/malls')}
              startIcon={<ArrowBackIcon />}
            >
              Back to Malls
            </Button>
          )}
          <Typography 
            variant={isMobile ? "h5" : "h4"}
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '2rem' }
            }}
          >
            {data.mall.name} - Stores
          </Typography>
        </Box>
        {isMobile ? <MobileView /> : <DesktopView />}
      </Box>
    </Layout>
  );
}

export default StoreList; 