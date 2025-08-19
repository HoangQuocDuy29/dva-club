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
  IconButton,
  Box
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert
} from '@mui/icons-material';

// Mock data - sau này sẽ thay bằng API call
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'player',
    status: 'active',
    lastLogin: '2025-01-19'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'coach',
    status: 'active',
    lastLogin: '2025-01-18'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    role: 'admin',
    status: 'inactive',
    lastLogin: '2025-01-15'
  }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'error';
    case 'coach': return 'warning';
    case 'player': return 'primary';
    case 'manager': return 'secondary';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  return status === 'active' ? 'success' : 'default';
};

const UserList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
        Users List
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
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
                    label={user.status}
                    color={getStatusColor(user.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.lastLogin}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
