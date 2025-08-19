import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material';
import {
  People,
  BarChart,
  SportsVolleyball,
  Schedule,
  Settings
} from '@mui/icons-material';
import type { DashboardModule } from '../types/dashboard.types';

const DRAWER_WIDTH = 240;

const menuItems = [
  { id: 'users' as DashboardModule, label: 'Users', icon: <People /> },
  { id: 'stats' as DashboardModule, label: 'Statistics', icon: <BarChart /> },
  { id: 'teams' as DashboardModule, label: 'Teams', icon: <SportsVolleyball /> },
  { id: 'matches' as DashboardModule, label: 'Matches', icon: <Schedule /> },
  { id: 'settings' as DashboardModule, label: 'Settings', icon: <Settings /> },
];

interface MenuBarVerticalProps {
  selectedModule: DashboardModule;
  onSelectModule: (module: DashboardModule) => void;
}

const MenuBarVertical: React.FC<MenuBarVerticalProps> = ({
  selectedModule,
  onSelectModule
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar /> {/* Spacer for top menubar */}
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedModule === item.id}
              onClick={() => onSelectModule(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuBarVertical;
