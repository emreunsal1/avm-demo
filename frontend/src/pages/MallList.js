import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { GET_MALLS } from '../services/api';
import { useAuth } from '../context/AuthContext';

function MallList() {
  const { loading, error, data } = useQuery(GET_MALLS);
  const navigate = useNavigate();
  const { user } = useAuth();
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
          Error loading malls
        </Typography>
      </Layout>
    );
  }

  const malls = user.role === 'MANAGER' && user.managedMall
    ? [user.managedMall]
    : data.malls;

  const MobileView = () => (
    <Grid container spacing={2}>
      {malls.map((mall) => (
        <Grid item xs={12} key={mall.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {mall.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Number of Stores: {mall.stores?.length || 0}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => navigate(`/malls/${mall.id}`)}
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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mall Name</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Number of Stores</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {malls.map((mall) => (
            <TableRow 
              key={mall.id}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <TableCell>{mall.name}</TableCell>
              <TableCell>{mall.stores?.length || 0}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/malls/${mall.id}`)}
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
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontWeight: 'bold'
          }}
        >
          Shopping Malls
        </Typography>
        {isMobile ? <MobileView /> : <DesktopView />}
      </Box>
    </Layout>
  );
}

export default MallList; 