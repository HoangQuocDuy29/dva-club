// src/modules/users/components/UserList/UserTable.tsx
import React from 'react';
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
  Box,
} from '@mui/material';
import { UserActions } from './UserActions';
import { getRoleColor, getStatusLabel, getStatusColor } from './utils/userHelpers';
import type { User } from '../../../../../users/types/user';

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewUser,
  onEditUser,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ width: '100%', overflowX: 'auto' }}>
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
                  {/* ✅ FIX: Display Cloudinary avatar or fallback to initials */}
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
                  onView={onViewUser}
                  onEdit={onEditUser}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
