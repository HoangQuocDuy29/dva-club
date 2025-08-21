// src/modules/users/components/UserList/index.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useUsers } from '../../../../../users/hooks/useUsers';
import { UserTable } from './UserTable';
import { UserViewDialog } from './UserDialog/UserViewDialog';
import { UserEditDialog } from './UserDialog/UserEditDialog';
import { UserCreateDialog } from './UserDialog/UserCreateDialog';
import { useUserDialogs } from './hooks/useUserDialogs';

const UserList: React.FC = () => {
  const { users, isLoading, error, total } = useUsers({ page: 1, limit: 20 });
  
  const {
    // View Dialog
    viewUser,
    isViewOpen,
    openViewDialog,
    closeViewDialog,
    
    // Edit Dialog
    editUser,
    isEditOpen,
    openEditDialog,
    closeEditDialog,
    
    // Create Dialog
    newUser,
    setNewUser,
    isCreateOpen,
    openCreateDialog,
    closeCreateDialog,
  } = useUserDialogs();

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
          onClick={openCreateDialog}
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
          onClick={openCreateDialog}
          color="primary"
        >
          Create User
        </Button>
      </Box>
      
      {/* Table */}
      <UserTable
        users={users}
        onViewUser={openViewDialog}
        onEditUser={openEditDialog}
      />

      {/* Dialogs */}
      <UserViewDialog
        user={viewUser}
        open={isViewOpen}
        onClose={closeViewDialog}
        onEdit={openEditDialog}
      />
      
      <UserEditDialog
        user={editUser}
        open={isEditOpen}
        onClose={closeEditDialog}
      />
      
      <UserCreateDialog
        newUser={newUser}
        setNewUser={setNewUser}
        open={isCreateOpen}
        onClose={closeCreateDialog}
      />
    </Box>
  );
};

export default UserList;
