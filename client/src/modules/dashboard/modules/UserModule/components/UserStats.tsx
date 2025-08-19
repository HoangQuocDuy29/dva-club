import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  People,
  PersonAdd,
  TrendingUp,
  SportsVolleyball
} from '@mui/icons-material';

// Mock stats data
const userStats = {
  totalUsers: 156,
  activeUsers: 142,
  newUsersThisMonth: 23,
  usersByRole: [
    { role: 'Players', count: 98, percentage: 62.8 },
    { role: 'Coaches', count: 24, percentage: 15.4 },
    { role: 'Managers', count: 18, percentage: 11.5 },
    { role: 'Admins', count: 8, percentage: 5.1 },
    { role: 'Viewers', count: 8, percentage: 5.1 }
  ]
};

const UserStats: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
        User Statistics
      </Typography>
      
      {/* Overview Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Card variant="outlined">
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <People color="primary" />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {userStats.totalUsers}
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
                  {userStats.activeUsers}
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
                  +{userStats.newUsersThisMonth}
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
          
          <List dense>
            {userStats.usersByRole.map((item, index) => (
              <React.Fragment key={item.role}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary={item.role}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">
                            {item.count} users
                          </Typography>
                          <Typography variant="caption">
                            {item.percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.percentage}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < userStats.usersByRole.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserStats;
