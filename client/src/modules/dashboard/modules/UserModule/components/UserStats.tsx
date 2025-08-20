// src/modules/users/components/UserStats.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  People,
  PersonAdd,
  TrendingUp,
  SportsVolleyball,
  Refresh
} from '@mui/icons-material';
import { useUserStatistics } from '../../../../users/hooks/useUserStatistics';

const UserStats: React.FC = () => {
  const { statistics, isLoading, error, refetch } = useUserStatistics();

  // ✅ FIXED: Proper event handler wrapper
  const handleRefresh = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Failed to load statistics: {error.message}
      </Alert>
    );
  }

  // No data state
  if (!statistics) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        No statistics data available
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 160 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          User Statistics
        </Typography>
        {/* ✅ FIXED: Use proper event handler */}
        <IconButton 
          onClick={handleRefresh} 
          size="small" 
          title="Refresh Statistics"
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Overview Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <People color="primary" />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {statistics.totalUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUp color="success" />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {statistics.activeUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonAdd color="info" />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  +{statistics.newUsersThisMonth.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New This Month
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Users by Role */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsVolleyball fontSize="small" />
            Users by Role
          </Typography>
          
          {statistics.usersByRole.length > 0 ? (
            <List dense>
              {statistics.usersByRole.map((item, index) => (
                <React.Fragment key={item.role}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary={item.role}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">
                              {item.count.toLocaleString()} users
                            </Typography>
                            <Typography variant="caption">
                              {item.percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(item.percentage, 100)}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < statistics.usersByRole.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No role data available
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserStats;