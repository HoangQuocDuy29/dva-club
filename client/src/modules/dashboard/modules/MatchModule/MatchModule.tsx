import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

const mockMatches = [
  { 
    id: 1, 
    teamA: 'DVA Sharks', 
    teamB: 'Lightning Bolts', 
    date: '2025-01-20', 
    status: 'upcoming' 
  },
  { 
    id: 2, 
    teamA: 'Fire Dragons', 
    teamB: 'Wave Riders', 
    date: '2025-01-18', 
    status: 'completed',
    score: '3-1'
  },
  { 
    id: 3, 
    teamA: 'DVA Sharks', 
    teamB: 'Fire Dragons', 
    date: '2025-01-15', 
    status: 'completed',
    score: '3-2'
  }
];

const MatchModule: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Match Management
      </Typography>
      
      {/* Matches Layout với Box */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Matches
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Teams</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>
                        {match.teamA} vs {match.teamB}
                      </TableCell>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>
                        <Chip 
                          label={match.status}
                          color={match.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {match.score || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Match Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed match analytics and performance metrics.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MatchModule;
