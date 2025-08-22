// src/components/UserRowActions.tsx
import React from 'react';
import { IconButton } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

interface UserRowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const UserRowActions: React.FC<UserRowActionsProps> = ({ onView, onEdit, onDelete }) => (
  <>
    <IconButton size="small" title="View Details" onClick={onView}>
      <Visibility fontSize="small" />
    </IconButton>
    <IconButton size="small" title="Edit User" onClick={onEdit}>
      <Edit fontSize="small" />
    </IconButton>
    <IconButton size="small" title="Delete User" onClick={onDelete} color="error">
      <Delete fontSize="small" />
    </IconButton>
  </>
);

export default UserRowActions;
