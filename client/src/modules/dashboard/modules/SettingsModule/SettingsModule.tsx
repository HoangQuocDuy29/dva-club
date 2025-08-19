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
  Switch,
  Divider
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language
} from '@mui/icons-material';

const SettingsModule: React.FC = () => {
  const [settings, setSettings] = React.useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    publicProfile: false
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Settings
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Application Settings
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText 
                primary="Push Notifications" 
                secondary="Receive notifications for important updates"
              />
              <Switch
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <Palette />
              </ListItemIcon>
              <ListItemText 
                primary="Dark Mode" 
                secondary="Use dark theme for the interface"
              />
              <Switch
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText 
                primary="Auto Save" 
                secondary="Automatically save changes"
              />
              <Switch
                checked={settings.autoSave}
                onChange={() => handleToggle('autoSave')}
              />
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText 
                primary="Public Profile" 
                secondary="Make your profile visible to others"
              />
              <Switch
                checked={settings.publicProfile}
                onChange={() => handleToggle('publicProfile')}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsModule;
