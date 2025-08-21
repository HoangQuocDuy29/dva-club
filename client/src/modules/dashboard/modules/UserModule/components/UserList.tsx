// src/modules/users/components/UserList.tsx (UPDATED with Profile)
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
  Button,
  
} from '@mui/material';
import {
  Edit,
  Visibility,
  PersonAdd
} from '@mui/icons-material';
import { useUsers } from '../../../../users/hooks/useUsers';
import { useDialogManagement } from '../../../../../hooks/useDialogManagement';
import { UserCreateDialog } from '../components/UserList/UserDialog/UserCreateDialog';
import { UserEditDialog } from '../components/UserList/UserDialog/UserEditDialog';
import { UserViewDialog } from './UserList/UserDialog/UserViewDialog';
import type { User, CreateUserRequest } from '../../../../users/types/user';

// ✅ Helper functions
const getRoleColor = (role: string) => {
  const colors = { admin: 'error', coach: 'warning', player: 'primary', manager: 'secondary', viewer: 'info' };
  return colors[role as keyof typeof colors] || 'default';
};

const getStatusLabel = (isActive: boolean | undefined) => isActive ? "Active" : "Inactive";
const getStatusColor = (isActive: boolean | undefined) => isActive ? 'success' : 'error';

// ✅ UserActions component
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
  const { users, isLoading, error, total } = useUsers({ page: 1, limit: 20 });
  const { dialogState, openDialog, closeDialog, isDialogOpen } = useDialogManagement<User>();
  
  // ✅ States for new user
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

  // ✅ Action handlers
  const handleViewUser = (user: User) => {
    console.log('🔄 Opening view dialog with user:', user);
    openDialog('view', user);
  };

  const handleEditUser = (user: User) => {
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

  // ✅ Loading/Error states
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
      {/* Header */}
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
                    <Avatar 
                      src={user.avatar || user.avatarUrl || ''} // ✅ Hiển thị ảnh từ URL
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid',
                        borderColor: 'primary.light',
                      }}
                    >
                      {user.firstName?.[0] || '?'} {/* ✅ FIX: Thêm  để lấy ký tự đầu */}
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

      {/* ✅ ALL DIALOGS - Just imports and coordination */}
      <UserViewDialog
        user={dialogState.data}
        open={isDialogOpen('view')}
        onClose={closeDialog}
        onEdit={handleEditUser}
      />

      <UserEditDialog
        user={dialogState.data}
        open={isDialogOpen('edit')}
        onClose={closeDialog}
      />

      <UserCreateDialog
        newUser={newUser}
        setNewUser={setNewUser}
        open={isDialogOpen('create')}
        onClose={closeDialog}
      />
    </Box>
  );
};

export default UserList;