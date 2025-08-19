import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  LinearProgress 
} from '@mui/material';
import {
  TrendingUp,
  People,
  SportsTennis,
  EmojiEvents
} from '@mui/icons-material';

const StatsModule: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Statistics Dashboard
      </Typography>
      
      {/* Stats Cards với Box Flexbox */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: 3,
        mb: 4
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <People color="primary" />
              <Box>
                <Typography variant="h5">156</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SportsTennis color="success" />
              <Box>
                <Typography variant="h5">12</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Teams
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp color="warning" />
              <Box>
                <Typography variant="h5">48</Typography>
                <Typography variant="body2" color="text.secondary">
                  Matches Played
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmojiEvents color="error" />
              <Box>
                <Typography variant="h5">8</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tournaments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Performance Overview Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This is a placeholder for detailed statistics and charts.
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsModule;
