// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\dashboard\modules\UserModule\components\UserList\UserDialog\UserEditDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  CircularProgress,
  Box, // ✅ ADD
  Typography, // ✅ ADD
  Divider, // ✅ ADD
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from '@mui/icons-material';
import { useUsers } from '../../../../../../users/hooks/useUsers';
import type { User, UpdateUserRequest } from '../../../../../../users/types';
import { AvatarUpload } from '../../../../../../../containers/common/AvatarUpload/AvatarUpload';
import { useNotification } from '../../../../../../../containers/common/Notification/NotificationContext';
interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  user,
  open,
  onClose,
}) => {
  const { updateUser } = useUsers({ page: 1, limit: 20 });
  const { showSuccess, showError } = useNotification();
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // ✅ ADD: Avatar file state to fix 'Cannot find name avatarFile' error
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ✅ Set edit data when user changes
  useEffect(() => {
    if (user && open) {
      setEditUserData({ ...user });
      setAvatarFile(null); // Reset avatar file when opening dialog
    }
  }, [user, open]);

  // ✅ Form handlers
  const handleEditChange = (field: keyof User, value: any) => {
    if (editUserData) {
      setEditUserData({ ...editUserData, [field]: value });
    }
  };

  // ✅ ADD: Handle avatar change (URL from successful upload)
  const handleAvatarChange = (avatarUrl: string) => {
    if (editUserData) {
      setEditUserData({ ...editUserData, avatar: avatarUrl });
    }
  };

  // ✅ ADD: Handle avatar file selection
  const handleAvatarFileChange = (file: File | null) => {
    setAvatarFile(file);
  };

  // ✅ UPDATED: Combined save function - calls both APIs sequentially
  const queryClient = useQueryClient();
const handleSaveEdit = async () => {
  if (!editUserData) return;
  
  setIsUpdating(true);
  try {
    // ✅ Step 1: Update user basic info (WITHOUT avatar field to avoid 400 error)
    const updateData: UpdateUserRequest = {
      firstName: editUserData.firstName,
      lastName: editUserData.lastName,
      email: editUserData.email,
      role: editUserData.role as any,
      isActive: editUserData.isActive,
      // ✅ NO avatar field here - this was causing 400 error
    };
    
    console.log('📤 Step 1: Updating user basic info...', updateData);
    await updateUser(editUserData.id, updateData);
    console.log('✅ Step 1: User updated successfully');
    
    // ✅ Step 2: Upload avatar if file is selected
    if (avatarFile) {
      console.log('📤 Step 2: Uploading avatar file...', avatarFile.name);
      
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:3001/api/v1/users/${editUserData.id}/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Avatar upload failed: ${response.status} ${errorText}`);
      }

      const avatarData = await response.json();
      console.log('✅ Step 2: Avatar uploaded successfully:', avatarData);
      
      // Update local state with new avatar URL
      const newAvatarUrl = avatarData.data?.avatarUrl || avatarData.avatarUrl || avatarData.avatar;
      if (newAvatarUrl) {
        handleAvatarChange(newAvatarUrl);
      }
    }
    
    // ✅ CÁCH 1: REFRESH USER LIST DATA VIA REACT QUERY
    console.log('📤 Step 3: Refreshing user list data...');
    queryClient.invalidateQueries({ queryKey: ['users'] });
    console.log('✅ Step 3: User list refreshed');
    // ✅ Force refresh user list after upload
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.refetchQueries({ queryKey: ['users'] });
    onClose();
    showSuccess('User and avatar updated successfully! ✅');
    
  } catch (error: any) {
    console.error('❌ Failed to save:', error);
    
    // Enhanced error messages
    let errorMessage = 'Failed to update user. Please try again.';
    if (error.message.includes('Avatar upload')) {
      errorMessage = 'User updated but avatar upload failed. Please try uploading avatar again.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    showError(errorMessage);
  } finally {
    setIsUpdating(false);
  }
};

  // ✅ Don't render if no user data
  if (!editUserData) return null;

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* ✅ Avatar Upload Section */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Profile Avatar
              </Typography>
              <AvatarUpload
                currentAvatar={editUserData.avatar || ''}
                onAvatarChange={handleAvatarChange}
                onFileChange={handleAvatarFileChange} // ✅ Pass file change handler
                userId={editUserData.id}
                size={120}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
          </Grid>

          {/* ✅ Basic Information Section */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          {/* ✅ Form Fields */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              value={editUserData.firstName || ''}
              onChange={(e) => handleEditChange('firstName', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              value={editUserData.lastName || ''}
              onChange={(e) => handleEditChange('lastName', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email"
              type="email"
              value={editUserData.email || ''}
              onChange={(e) => handleEditChange('email', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editUserData.role || ''}
                onChange={(e) => handleEditChange('role', e.target.value)}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="coach">Coach</MenuItem>
                <MenuItem value="player">Player</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={editUserData.isActive || false}
                  onChange={(e) => handleEditChange('isActive', e.target.checked)}
                />
              }
              label="Active Status"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveEdit}
          variant="contained"
          disabled={isUpdating}
          startIcon={isUpdating ? <CircularProgress size={16} /> : <Save />}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};