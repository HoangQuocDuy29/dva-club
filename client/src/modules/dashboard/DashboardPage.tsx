import React, { useState } from 'react';
import { Box } from '@mui/material';
import { CustomThemeProvider } from './context/ThemeContext';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import type { DashboardModule } from './types/dashboard.types';

const SIDEBAR_WIDTH = 280;
const TOPBAR_HEIGHT = 64;

const DashboardPageContent: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<DashboardModule>('users');

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* TopBar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: TOPBAR_HEIGHT,
          zIndex: 1300,
        }}
      >
        <TopBar />
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: TOPBAR_HEIGHT,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          zIndex: 1200,
        }}
      >
        <Sidebar 
          selectedModule={selectedModule}
          onSelectModule={setSelectedModule}
        />
      </Box>
      
      {/* ✅ FIXED: Content Area - NO HORIZONTAL SCROLL */}
      <Box
        component="main"
        sx={{
          position: 'fixed',
          top: TOPBAR_HEIGHT,
          left: SIDEBAR_WIDTH,
          width: `calc(100vw - ${SIDEBAR_WIDTH}px)`, // ✅ Exact width calculation
          height: `calc(100vh - ${TOPBAR_HEIGHT}px)`, // ✅ Exact height calculation
          
          // ✅ CRITICAL: Prevent all horizontal scrolling
          overflowX: 'hidden',
          overflowY: 'auto',
          
          // ✅ Ensure content stays within bounds
          boxSizing: 'border-box',
          
          backgroundColor: 'background.default',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Inner container with controlled padding */}
        <Box 
          sx={{ 
            width: '100%',
            maxWidth: '100%', // ✅ Never exceed container width
            minHeight: '100%',
            padding: 3,
            boxSizing: 'border-box',
            
            // ✅ Prevent content from overflowing
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
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