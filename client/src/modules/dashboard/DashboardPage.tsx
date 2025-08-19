import React, { useState } from 'react';
import { Box } from '@mui/material';
import { CustomThemeProvider } from './context/ThemeContext';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import type { DashboardModule } from './types/dashboard.types';

const SIDEBAR_WIDTH = 280;

const DashboardPageContent: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<DashboardModule>('users');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ✅ Sidebar - Fixed position */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          position: 'fixed',
          height: '100vh',
          zIndex: 1200
        }}
      >
        <Sidebar 
          selectedModule={selectedModule}
          onSelectModule={setSelectedModule}
        />
      </Box>
      
      {/* ✅ Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${SIDEBAR_WIDTH}px`, // Push content right
          minHeight: '100vh',
          display: 'flex',
          paddingTop: '55px',
          flexDirection: 'column'
        }}
      >
        {/* TopBar */}
        <TopBar />
        
        {/* Content */}
        <Box sx={{ 
          flexGrow: 1,
          pt: 8, // Account for TopBar height
          p: 3,
          backgroundColor: 'background.default'
        }}>
          <ContentArea selectedModule={selectedModule} />
        </Box>
      </Box>
    </Box>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <CustomThemeProvider>
      <DashboardPageContent />
    </CustomThemeProvider>
  );
};

export default DashboardPage;
