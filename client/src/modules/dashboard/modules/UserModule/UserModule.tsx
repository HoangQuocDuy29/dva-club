// modules/UserModule/UserModule.tsx
import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import UserList from './components/UserList';
import UserStats from './components/UserStats';

const UserModule: React.FC = () => {
  return (
     <Box>
      <Typography variant="h4" 
        gutterBottom
        sx={{ color: 'text.primary' }}>
        User Management
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexDirection: { xs: 'column', lg: 'row' }
      }}>
        <Box sx={{ flex: 1 }}>
          <UserList />
        </Box>
        
        <Box sx={{ 
          width: { lg: 300 }, 
          flexShrink: 0 
        }}>
          <UserStats />
        </Box>
      </Box>
    </Box>
  );
};

export default UserModule;
