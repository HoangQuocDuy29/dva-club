// src/modules/users/components/UserList/UserActions.tsx
import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import type { User } from '../../../../../users/types/user';

interface UserActionsProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, onView, onEdit }) => (
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
