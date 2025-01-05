import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import MallList from './pages/MallList';
import StoreList from './pages/StoreList';
import DoPayment from './pages/DoPayment';
import Unauthorized from './pages/Unauthorized';
import MonthlyRevenue from './pages/MonthlyRevenue';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import MyPayments from './pages/MyPayments';
import StorePayments from './pages/StorePayments';

function AppContent() {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route
            path="/revenue"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
                <MonthlyRevenue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/malls"
            element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <MallList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/malls/:mallId"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
                <StoreList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/stores/:storeId/payments"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
                <StorePayments />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/do-payment"
            element={
              <ProtectedRoute requiredRoles={['STORE_OWNER']}>
                <DoPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-payments"
            element={
              <ProtectedRoute requiredRoles={['STORE_OWNER']}>
                <MyPayments />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {({ user }) => {
                  if (user.role === 'STORE_OWNER') {
                    return <Navigate to="/my-payments" replace />;
                  } else if (user.role === 'MANAGER' && user.managedMall) {
                    return <Navigate to={`/malls/${user.managedMall.id}`} replace />;
                  } else {
                    return <Navigate to="/malls" replace />;
                  }
                }}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 