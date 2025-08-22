import React from "react";
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Box,
  Avatar,
  Chip
} from "@mui/material";
import { Player } from '../../../../../modules/home/types/home.types';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <Card
      sx={{
        maxWidth: 320,
        mx: 'auto',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      {/* Player Avatar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        pt: 3, 
        pb: 2,
        background: `linear-gradient(135deg, #FF4500 0%, #FF6200 50%, #FFA500 100%)`
      }}>
        <Avatar
          src={player.avatar}
          alt={player.name}
          sx={{
            width: 100,
            height: 100,
            border: '4px solid white',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}
        >
          {player.name.charAt(0)}
        </Avatar>
      </Box>

      <CardContent sx={{ textAlign: 'center', pb: 3 }}>
        {/* Player Name */}
        <Typography 
          variant="h6" 
          sx={{
            fontWeight: 800,
            fontSize: '1.3rem',
            color: '#333',
            mb: 1
          }}
        >
          {player.name}
        </Typography>

        {/* Position & Height */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={player.position}
            sx={{
              backgroundColor: '#FF4500',
              color: 'white',
              fontWeight: 600,
              mb: 1,
              mr: 1
            }}
          />
          <Chip
            label={player.height}
            variant="outlined"
            sx={{
              borderColor: '#FF4500',
              color: '#FF4500',
              fontWeight: 600
            }}
          />
        </Box>

        {/* Nationality */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Address:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#FF4500' }}>
            {player.address}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
