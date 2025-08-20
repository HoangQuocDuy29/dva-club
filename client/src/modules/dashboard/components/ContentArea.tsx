import React, { Suspense } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import TopBar from './TopBar'; // ✅ Import TopBar
import type { DashboardModule } from '../types/dashboard.types';

const UserModule = React.lazy(() => import('../modules/UserModule/UserModule'));
const StatsModule = React.lazy(() => import('../modules/StatsModule/StatsModule'));
const TeamModule = React.lazy(() => import('../modules/TeamModule/TeamModule'));
const MatchModule = React.lazy(() => import('../modules/MatchModule/MatchModule'));
const SettingsModule = React.lazy(() => import('../modules/SettingsModule/SettingsModule'));

interface ContentAreaProps {
  selectedModule: DashboardModule;
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedModule }) => {
  const renderModule = () => {
    switch (selectedModule) {
      case 'users':
        return <UserModule />;
      case 'stats':
        return <StatsModule />;
      case 'teams':
        return <TeamModule />;
      case 'matches':
        return <MatchModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return (
          <Typography variant="h6" color="error">
            Module "{selectedModule}" not found
          </Typography>
        );
    }
  };

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        maxWidth: '100%', // ✅ Never exceed container width
        height: '100%',
        
        // ✅ CRITICAL: Prevent horizontal scroll
        overflowX: 'hidden',
        overflowY: 'auto', // Only vertical scroll
        
        // ✅ Proper box model
        boxSizing: 'border-box',
        
        // ✅ Content styling
        bgcolor: 'background.default',
        p: 3,
        
        // ✅ Ensure content fits
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      {/* ✅ TopBar rendered inline (not fixed) */}
      <Box sx={{ mb: 3 }}>
        <TopBar />
      </Box>
      
      {/* ✅ Module content with proper containment */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden', // Ensure modules don't overflow
        }}
      >
        <Suspense 
          fallback={
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="200px"
            >
              <CircularProgress />
            </Box>
          }
        >
          {renderModule()}
        </Suspense>
      </Box>
    </Box>
  );
};

export default ContentArea;