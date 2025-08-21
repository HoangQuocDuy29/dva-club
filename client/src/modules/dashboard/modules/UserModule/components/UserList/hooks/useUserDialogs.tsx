// src/modules/users/components/UserList/hooks/useUserDialogs.tsx
import { useState } from 'react';
import type { User, CreateUserRequest } from '../../../../../../users/types/user';

export const useUserDialogs = () => {
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
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

  const openViewDialog = (user: User) => setViewUser(user);
  const closeViewDialog = () => setViewUser(null);
  
  const openEditDialog = (user: User) => setEditUser(user);
  const closeEditDialog = () => setEditUser(null);
  
  const openCreateDialog = () => {
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
    setShowCreateDialog(true);
  };
  const closeCreateDialog = () => setShowCreateDialog(false);

  const resetNewUser = () => {
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
  };

  return {
    // View Dialog
    viewUser,
    isViewOpen: !!viewUser,
    openViewDialog,
    closeViewDialog,
    
    // Edit Dialog  
    editUser,
    isEditOpen: !!editUser,
    openEditDialog,
    closeEditDialog,
    
    // Create Dialog
    newUser,
    setNewUser,
    isCreateOpen: showCreateDialog,
    openCreateDialog,
    closeCreateDialog,
    resetNewUser,
  };
};
