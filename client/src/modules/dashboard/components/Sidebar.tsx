import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Divider,
  Menu,
  MenuItem,
  ListItemAvatar
} from '@mui/material';
import {
  People,
  BarChart,
  SportsVolleyball,
  Schedule,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  MoreVert
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Add useNavigate
import { useAuthStore } from '../../auth/store/authStore';
import { useAuth } from '../../auth/hooks/useAuth';
import type { DashboardModule } from '../types/dashboard.types';
import DVALogo from '../../../assets/images/logos/dva.png';

const SIDEBAR_WIDTH = 280;

const menuItems = [
  { id: 'users' as DashboardModule, label: 'Users', icon: <People /> },
  { id: 'stats' as DashboardModule, label: 'Statistics', icon: <BarChart /> },
  { id: 'teams' as DashboardModule, label: 'Teams', icon: <SportsVolleyball /> },
  { id: 'matches' as DashboardModule, label: 'Matches', icon: <Schedule /> },
  { id: 'settings' as DashboardModule, label: 'Settings', icon: <Settings /> },
];

const mockNotifications = [
  { id: 1, message: 'New user registered', time: '5m ago' },
  { id: 2, message: 'Match scheduled', time: '1h ago' },
  { id: 3, message: 'Team created', time: '2h ago' },
];

interface SidebarProps {
  selectedModule: DashboardModule;
  onSelectModule: (module: DashboardModule) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedModule, onSelectModule }) => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate(); // ✅ Add useNavigate hook
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setNotificationAnchor(null);
    setProfileAnchor(null);
  };

  // ✅ Enhanced logout handler with redirect
  const handleLogout = async () => {
    try {
      // ✅ Optional: Show confirmation dialog
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (!confirmLogout) {
        handleClose();
        return;
      }

      console.log('🚪 Starting logout process...');

      // ✅ Call logout from auth hook (clears auth state)
      await logout();

      // ✅ Additional cleanup - clear any remaining localStorage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('user-data');

      console.log('✅ Logout successful - redirecting to homepage');

      // ✅ Close any open menus
      handleClose();

      // ✅ Redirect to homepage
      navigate('/', { replace: true });

      // ✅ Optional: Show success message
      setTimeout(() => {
        console.log('🏠 Redirected to homepage');
      }, 100);

    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // ✅ Force logout even if auth hook fails
      localStorage.clear();
      handleClose();
      navigate('/', { replace: true });
      
      alert('Logout completed. You have been redirected to the homepage.');
    }
  };

  // ✅ Complete optional chaining
  const userInitial = (
  (user?.firstName?.length ? user.firstName : null) ||
  (user?.email?.length ? user.email : null) ||
  'U'
).toUpperCase();


  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Unknown User';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderRight: 1,
          borderColor: 'divider'
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <img 
            src={DVALogo} 
            alt="DVA Club Logo" 
            style={{ 
              width: 120,
              height: 'auto',
              marginBottom: 12,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        </Link>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          Admin Dashboard
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selectedModule === item.id}
              onClick={() => onSelectModule(item.id)}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#2c2c2c',
                  color: '#ff7043',
                  '& .MuiListItemIcon-root': { color: '#ff7043' },
                },
                '&.Mui-selected': {
                  backgroundColor: '#1a1a1a',
                  color: '#ff5722',
                  '&:hover': { backgroundColor: '#333333' },
                  '& .MuiListItemIcon-root': { color: '#ff5722' },
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Notifications */}
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => setNotificationAnchor(e.currentTarget)}
            sx={{
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#2c2c2c',
                color: '#ff7043',
                '& .MuiListItemIcon-root': { color: '#ff7043' },
              },
            }}
          >
            <ListItemIcon>
              <Badge badgeContent={mockNotifications.length} color="error">
                <Notifications />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>
        </ListItem>
      </Box>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Recent Notifications</Typography>
        </MenuItem>
        <Divider />
        {mockNotifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleClose}>
            <ListItemText
              primary={notification.message}
              secondary={notification.time}
            />
          </MenuItem>
        ))}
      </Menu>

      <Divider />

      {/* Profile */}
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              borderRadius: 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#2c2c2c',
                color: '#ff7043',
                '& .MuiAvatar-root': { backgroundColor: '#ff5722', color: 'white' },
              },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ width: 40, height: 40 }}>
                {userInitial}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body2" fontWeight="medium">{fullName}</Typography>}
              secondary={<Typography variant="caption">{user?.email || 'No email'}</Typography>}
            />
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </ListItemButton>
        </ListItem>
      </Box>

      {/* ✅ UPDATED: Profile Menu with enhanced logout */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText primary="Profile Settings" />
        </MenuItem>
        <Divider />
        {/* ✅ UPDATED: Enhanced logout menu item */}
        <MenuItem 
          onClick={handleLogout}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            secondary="Return to homepage"
          />
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default Sidebar;
