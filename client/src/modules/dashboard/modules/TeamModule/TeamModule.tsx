import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import { Group } from '@mui/icons-material';

const mockTeams = [
  { id: 1, name: 'DVA Sharks', members: 12, status: 'active' },
  { id: 2, name: 'Lightning Bolts', members: 10, status: 'active' },
  { id: 3, name: 'Fire Dragons', members: 8, status: 'inactive' },
  { id: 4, name: 'Wave Riders', members: 11, status: 'active' }
];

const TeamModule: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Team Management
      </Typography>
      
      {/* Teams Grid với Box */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'repeat(2, 1fr)' 
        },
        gap: 3
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Teams List
            </Typography>
            
            <List>
              {mockTeams.map((team) => (
                <ListItem key={team.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <Group />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={team.name}
                    secondary={`${team.members} members`}
                  />
                  <Chip 
                    label={team.status}
                    color={team.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Team performance metrics and analytics will be displayed here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TeamModule;
