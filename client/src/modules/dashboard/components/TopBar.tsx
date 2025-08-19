import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Box,
  alpha
} from '@mui/material';
import {
  Search,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const SIDEBAR_WIDTH = 280;

const TopBar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        zIndex: 1100, // ✅ Lower z-index to avoid content overlap
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none', // ✅ Remove heavy shadow
        borderBottom: 1,
        borderColor: 'divider',
        height: 64 // ✅ Fixed height
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Search Box */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: alpha('#000', 0.05),
            '&:hover': {
              backgroundColor: alpha('#000', 0.1),
            },
            marginLeft: 0,
            width: '100%',
            maxWidth: 400,
            mr: 2
          }}
        >
          <Box
            sx={{
              padding: (theme) => theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search />
          </Box>
          <InputBase
            placeholder="Search users, teams, matches..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: (theme) => theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${40}px)`,
                width: '100%',
              },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ mr: 1 }}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
