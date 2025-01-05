import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggle; 