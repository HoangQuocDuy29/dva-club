// src/modules/users/components/UserList/UserDialog/UserViewDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../../../../../users/api/userApi';
import { ProfileSection } from './ProfileSection';
//import { getRoleColor, getStatusLabel, getStatusColor } from '../utils/userHelpers';
import type { User } from '../../../../../../users/types';

// ✅ TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

// ✅ Helper functions
const getRoleColor = (role: string) => {
  const colors = { admin: 'error', coach: 'warning', player: 'primary', manager: 'secondary', viewer: 'info' };
  return colors[role as keyof typeof colors] || 'default';
};

const getStatusLabel = (isActive: boolean | undefined) => isActive ? "Active" : "Inactive";
const getStatusColor = (isActive: boolean | undefined) => isActive ? 'success' : 'error';

const UserDetailField: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

interface UserViewDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export const UserViewDialog: React.FC<UserViewDialogProps> = ({
  user,
  open,
  onClose,
  onEdit,
}) => {
  const [profileTab, setProfileTab] = useState(0);

  // ✅ Profile query - only fetch when dialog is open
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => {
      console.log('🔄 Fetching profile for user ID:', user?.id);
      return userApi.getUserProfile(user!.id);
    },
    enabled: open && !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Debug logging
  React.useEffect(() => {
    if (open && user) {
      console.log('🔍 UserViewDialog Debug:', {
        isOpen: open,
        userId: user.id,
        enabled: open && !!user.id,
        profileLoading,
        hasProfile: !!userProfile,
        profileError,
        profileData: userProfile
      });
    }
  }, [open, user?.id, profileLoading, userProfile, profileError]);

  // ✅ Handle tab change with refetch
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('📑 Tab changed to:', newValue, 'User ID:', user?.id);
    setProfileTab(newValue);
    
    // Force refetch when switching to profile tab
    if (newValue === 1 && user?.id) {
      console.log('🔄 Forcing profile refetch...');
      refetchProfile();
    }
  };

  // Reset tab when dialog opens
  React.useEffect(() => {
    if (open) {
      setProfileTab(0);
    }
  }, [open]);

  if (!user) return null;

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* ✅ FIX: Display Cloudinary avatar or fallback to initials */}
          <Avatar 
            src={user.avatarUrl || user.avatar || ''} // ✅ Use avatarUrl from Cloudinary
            sx={{ 
              width: 64, 
              height: 64,
              border: '3px solid',
              borderColor: 'primary.main',
            }}
          >
            {user.firstName?.[0] || '?'}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User Details & Profile
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* ✅ Tabs for Basic Info and Profile */}
        <Tabs 
          value={profileTab} 
          onChange={handleTabChange}
          sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Basic Information" />
          <Tab label="Profile Details" />
        </Tabs>

        {/* ✅ Basic Information Tab */}
        <TabPanel value={profileTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2">Basic Information</Typography>
                <Divider sx={{ my: 1 }} />
                <UserDetailField label="First Name" value={user.firstName || 'N/A'} />
                <UserDetailField label="Last Name" value={user.lastName || 'N/A'} />
                <UserDetailField label="Email" value={user.email || 'N/A'} />
                <UserDetailField 
                  label="Role" 
                  value={
                    <Chip 
                      label={user.role || 'Unknown'} 
                      color={getRoleColor(user.role || '') as any}
                      size="small" 
                    />
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2">Status Information</Typography>
                <Divider sx={{ my: 1 }} />
                <UserDetailField 
                  label="Status" 
                  value={
                    <Chip 
                      label={getStatusLabel(user.isActive)}
                      color={getStatusColor(user.isActive)}
                      size="small"
                    />
                  }
                />
                <UserDetailField 
                  label="Last Login" 
                  value={
                    user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'
                  }
                />
                <UserDetailField 
                  label="Created At" 
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* ✅ Profile Details Tab */}
        <TabPanel value={profileTab} index={1}>
        <ProfileSection 
            profile={userProfile ?? null}
            isLoading={profileLoading} 
            error={profileError}
            userId={user.id} // ✅ Pass userId prop
        />
        </TabPanel>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          onClick={() => {
            onClose();
            onEdit(user);
          }}
          variant="contained"
        >
          Edit User
        </Button>
      </DialogActions>
    </Dialog>
  );
};