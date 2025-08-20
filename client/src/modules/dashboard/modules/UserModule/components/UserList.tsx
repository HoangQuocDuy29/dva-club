// src/modules/users/components/UserList.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Box,
  CircularProgress,
  Alert,
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
  Divider,
  Grid
} from '@mui/material';
import {
  Edit,
  Visibility,
  Save,
  PersonAdd
} from '@mui/icons-material';
import { useUsers,useUserDetail } from '../../../../users/hooks/useUsers';
import { useDialogManagement } from '../../../../../hooks/useDialogManagement';
import type { User, UpdateUserRequest,CreateUserRequest } from '../../../../users/types/user';

// Validation function (same as before)
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

// Helper functions
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

// ✅ Updated Actions Component - Simple and Clean
interface UserActionsProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
}

const UserActions: React.FC<UserActionsProps> = ({ user, onView, onEdit }) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    <IconButton 
      size="small" 
      title="View Details"
      onClick={(e) => {
        e.stopPropagation();
        onView(user);
      }}
    >
      <Visibility fontSize="small" />
    </IconButton>
    <IconButton 
      size="small" 
      title="Edit User"
      onClick={(e) => {
        e.stopPropagation();
        onEdit(user);
      }}
    >
      <Edit fontSize="small" />
    </IconButton>
  </Box>
);

const UserList: React.FC = () => {
  const { users, isLoading, error, total, updateUser, createUser } = useUsers({ page: 1, limit: 20 });
  
  // ✅ Use centralized dialog management
  const { dialogState, openDialog, closeDialog, isDialogOpen } = useDialogManagement<User>();
  
  // States for forms
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'player',
    avatarUrl: '',
    isActive: true
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ✅ Clean action handlers
  const handleViewUser = (user: User) => {
    openDialog('view', user);
  };

  const handleEditUser = (user: User) => {
    setEditUserData({ ...user });
    openDialog('edit', user);
  };

  const handleCreateUser = () => {
    setNewUser({
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'player',
      avatarUrl: '',
      isActive: true
    });
    openDialog('create');
  };

  // Form handlers
  const handleEditChange = (field: keyof User, value: any) => {
    if (editUserData) {
      setEditUserData({ ...editUserData, [field]: value });
    }
  };

  const handleNewUserChange = (field: keyof CreateUserRequest, value: any) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleSaveEdit = async () => {
    if (!editUserData) return;
    
    setIsUpdating(true);
    try {
      const updateData: UpdateUserRequest = {
        firstName: editUserData.firstName,
        lastName: editUserData.lastName,
        email: editUserData.email,
        role: editUserData.role as any,
        isActive: editUserData.isActive,
      };
      
      await updateUser(editUserData.id, updateData);
      closeDialog();
      alert('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

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
    closeDialog();
    alert('User created successfully! They can now login with their credentials.');
  } catch (error: any) {
    console.error('❌ CREATE USER ERROR:');
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    
    const errorMsg = error.response?.data?.message || 'Failed to create user. Please try again.';
    alert(`Error: ${errorMsg}`);
  } finally {
    setIsCreating(false);
  }
};





  // Loading/Error states
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading users...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Failed to load users: {error.message}
      </Alert>
    );
  }

  if (!users || !Array.isArray(users) || users.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No users found
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={handleCreateUser}
          sx={{ mt: 2 }}
        >
          Create First User
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header with Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Users List ({users.length} of {total} total)
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={handleCreateUser}
          color="primary"
        >
          Create User
        </Button>
      </Box>
      
      {/* Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 180 }}>User</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Role</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Last Login</TableCell>
              <TableCell sx={{ minWidth: 100 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.firstName?.[0] || '?'}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}
                  >
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={getRoleColor(user.role) as any}
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(user.isActive)}
                    color={getStatusColor(user.isActive)}
                    size="small"
                    variant={user.isActive ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <UserActions
                    user={user}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ VIEW DIALOG - Centralized Rendering */}
      {isDialogOpen('view') && dialogState.data && (
        <Dialog 
          open={true}
          onClose={closeDialog}
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 48, height: 48 }}>
                {dialogState.data.firstName?.[0] || '?'}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {dialogState.data.firstName} {dialogState.data.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User Details
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2">Basic Information</Typography>
                <Divider sx={{ my: 1 }} />
                <UserDetailField label="First Name" value={dialogState.data.firstName || 'N/A'} />
                <UserDetailField label="Last Name" value={dialogState.data.lastName || 'N/A'} />
                <UserDetailField label="Email" value={dialogState.data.email || 'N/A'} />
                <UserDetailField 
                  label="Role" 
                  value={
                    <Chip 
                      label={dialogState.data.role || 'Unknown'} 
                      color={getRoleColor(dialogState.data.role || '') as any}
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
                      label={getStatusLabel(dialogState.data.isActive)}
                      color={getStatusColor(dialogState.data.isActive)}
                      size="small"
                    />
                  }
                />
                <UserDetailField 
                  label="Last Login" 
                  value={
                    dialogState.data.lastLogin 
                      ? new Date(dialogState.data.lastLogin).toLocaleDateString()
                      : 'Never'
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
            <Button 
  onClick={() => {
    // ✅ Check if data and id exist before using
    if (dialogState.data && dialogState.data.id != null) {
      const userToEdit: User = {
        ...dialogState.data,
        id: dialogState.data.id // Now TypeScript knows id is defined
      };
      closeDialog();
      handleEditUser(userToEdit);
    } else {
      alert('Invalid user data: missing id');
    }
  }}
  variant="contained"
>
  Edit User
</Button>

          </DialogActions>
        </Dialog>
      )}

      {/* ✅ EDIT DIALOG - Centralized Rendering */}
      {isDialogOpen('edit') && editUserData && (
        <Dialog 
          open={true}
          onClose={closeDialog}
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
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
            <Button onClick={closeDialog} disabled={isUpdating}>
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
      )}

      {/* ✅ CREATE DIALOG - Centralized Rendering */}
      {isDialogOpen('create') && (
        <Dialog 
          open={true}
          onClose={closeDialog}
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
            <Button onClick={closeDialog} disabled={isCreating}>
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
      )}
    </Box>
  );
};

export default UserList;