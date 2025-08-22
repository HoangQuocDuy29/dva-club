import React from "react";
import { Box } from "@mui/material";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import { IntroSection,  } from '../../../layout/Body/Home/IntroSection';
import { PlayersList } from '../../../layout/Body/Home/PlayersList';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      
    }}>
      {/* ✅ Header - Reused */}
      <Header />

      {/* ✅ Main Content Body */}
      <Box sx={{ flex: 1, pt: 2 }}>
        
        {/* ✅ Section 1: Intro Section */}
        <IntroSection />
        
        {/* ✅ Section 2: Players List */}
        <PlayersList />
        
      </Box>

      {/* ✅ Footer - Reused */}
      <Footer />
    </Box>
  );
};

export default HomePage;
