// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\modules\dashboard\modules\UserModule\components\UserList\UserDialog\UserCreateDialog.tsx
import React, { useState } from 'react';
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
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useUsers } from '../../../../../../users/hooks/useUsers';
import type { CreateUserRequest } from '../../../../../../users/types';
import { useNotification } from '../../../../../../../containers/common/Notification/NotificationContext';
// ✅ Validation function (moved from UserList)
const validateCreateUser = (user: CreateUserRequest): string[] => {
  const errors: string[] = [];
  if (!user.email) errors.push('Email is required');
  if (!user.username) errors.push('Username is required');
  if (!user.password) errors.push('Password is required');
  if (!user.firstName) errors.push('First name is required');
  if (!user.lastName) errors.push('Last name is required');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (user.email && !emailRegex.test(user.email)) {
    errors.push('Invalid email format');
  }
  if (user.password && user.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (user.username && user.username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  return errors;
};


interface UserCreateDialogProps {
  newUser: CreateUserRequest;
  setNewUser: React.Dispatch<React.SetStateAction<CreateUserRequest>>;
  open: boolean;
  onClose: () => void;
}

export const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
  newUser,
  setNewUser,
  open,
  onClose,
}) => {
  const { createUser } = useUsers({ page: 1, limit: 20 });
  const [isCreating, setIsCreating] = useState(false);
  const { showSuccess, showError } = useNotification();

  // ✅ Form handlers (moved from UserList)
  const handleNewUserChange = (field: keyof CreateUserRequest, value: any) => {
    setNewUser({ ...newUser, [field]: value });
  };

  // ✅ Save create handler (moved from UserList)
  const handleSaveCreate = async () => {
    const validationErrors = validateCreateUser(newUser);
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }

    // ✅ CLEANED PAYLOAD - Remove isActive field
    const createPayload = {
      email: newUser.email.trim(),
      username: newUser.username.trim(),
      password: newUser.password,
      firstName: newUser.firstName.trim(),
      lastName: newUser.lastName.trim(),
      role: newUser.role,
      // ✅ Only include optional fields if they have values
      ...(newUser.phone?.trim() && { phone: newUser.phone.trim() }),
      ...(newUser.avatarUrl?.trim() && { avatarUrl: newUser.avatarUrl.trim() })
      // ✅ DO NOT include isActive - backend doesn't accept it
    };

    console.log('📤 Sending cleaned create payload (no isActive):', createPayload);
    
    setIsCreating(true);
    try {
      await createUser(createPayload);
      onClose();
      showSuccess('User created successfully! They can now login with their credentials.');
    } catch (error: any) {
      console.error('❌ CREATE USER ERROR:');
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      const errorMsg = error.response?.data?.message || 'Failed to create user. Please try again.';
      showError(`Error: ${errorMsg}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name *"
              value={newUser.firstName}
              onChange={(e) => handleNewUserChange('firstName', e.target.value)}
              fullWidth
              required
              error={!newUser.firstName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name *"
              value={newUser.lastName}
              onChange={(e) => handleNewUserChange('lastName', e.target.value)}
              fullWidth
              required
              error={!newUser.lastName}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email *"
              type="email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange('email', e.target.value)}
              fullWidth
              required
              error={!newUser.email}
              helperText="This will be used for login"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Username *"
              value={newUser.username}
              onChange={(e) => handleNewUserChange('username', e.target.value)}
              fullWidth
              required
              error={!newUser.username}
              helperText="Unique username for login"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Password *"
              type="password"
              value={newUser.password}
              onChange={(e) => handleNewUserChange('password', e.target.value)}
              fullWidth
              required
              error={!newUser.password}
              helperText="Minimum 8 characters"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              value={newUser.phone}
              onChange={(e) => handleNewUserChange('phone', e.target.value)}
              fullWidth
              placeholder="+84123456789"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Role *</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => handleNewUserChange('role', e.target.value)}
                label="Role"
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="coach">Coach</MenuItem>
                <MenuItem value="player">Player</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Avatar URL"
              value={newUser.avatarUrl}
              onChange={(e) => handleNewUserChange('avatarUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/avatar.jpg"
              helperText="Optional profile picture URL"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={newUser.isActive}
                  onChange={(e) => handleNewUserChange('isActive', e.target.checked)}
                />
              }
              label="Active Status (Can login immediately)"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>
        <Button 
          onClick={handleSaveCreate}
          variant="contained"
          disabled={isCreating}
          startIcon={isCreating ? <CircularProgress size={16} /> : <PersonAdd />}
        >
          {isCreating ? 'Creating...' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
