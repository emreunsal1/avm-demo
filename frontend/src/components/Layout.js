import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Store as StoreIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import * as api from '../services/api';
import { useState } from 'react';

const drawerWidth = 240;

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getMenuItems = () => {
    const items = [];

    if (['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase())) {
      items.push(
        { text: 'Revenue', icon: <BarChartIcon />, path: '/revenue' },
        { text: 'Malls', icon: <BusinessIcon />, path: '/malls' },
      );
    }

    if (user?.role?.toUpperCase() === 'STORE_OWNER') {
      items.push(
        { text: 'Make Payment', icon: <PaymentIcon />, path: '/do-payment' },
        { text: 'Payment History', icon: <PaymentIcon />, path: '/payment-history' }
      );
    }

    return items;
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {user && isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Mall Management System
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle />
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{ 
                  display: { xs: 'flex', sm: 'none' }
                }}
              >
                <LogoutIcon />
              </IconButton>
              <Button 
                color="inherit" 
                onClick={handleLogout} 
                startIcon={<LogoutIcon />}
                sx={{
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {user && (
        <>
          <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            {drawer}
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2 },
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              marginTop: '64px',
            }}
          >
            {children}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Layout; 