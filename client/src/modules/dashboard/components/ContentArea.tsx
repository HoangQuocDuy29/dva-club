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
        flexGrow: 1,
        bgcolor: 'background.default',
        p: 3,
        overflow: 'auto'
      }}
    >
      {/* ✅ TopBar được render ở đây - không fixed */}
      <TopBar />
      
      <Suspense 
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        }
      >
        {renderModule()}
      </Suspense>
      
    </Box>
    
  );
};

export default ContentArea;
