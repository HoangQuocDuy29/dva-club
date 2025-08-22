import React, { useState, useMemo } from "react";
import { 
  Typography, 
  Box, 
  Button,
  Fade,
  TextField,
  InputAdornment,
  Chip,
  Stack
} from "@mui/material";
import { 
  Search as SearchIcon,
  Clear as ClearIcon 
} from "@mui/icons-material";
import PlayerCard from './PlayerCard';
import { Player } from '../../../../../modules/home/types/home.types';

// ✅ Updated Sample data với Opposite position và quê quán
const samplePlayers: Player[] = [
  {
    id: 1,
    name: "Artiukh Lyuba",
    position: "Outside Hitter",
    height: "1m75",
    avatar: "/images/players/player1.jpg",
    address: "Russian"
  },
  {
    id: 2,
    name: "Quoc Duy", 
    position: "Outside Hitter",
    height: "1m6",
    avatar: "/images/players/player2.jpg",
    address: "Mỹ"
  },
  {
    id: 3,
    name: "Aaron Russell",
    position: "Outside Hitter", 
    height: "6-9",
    avatar: "/images/players/player3.jpg",
    address: "Mỹ"
  },
  {
    id: 4,
    name: "Michael Johnson",
    position: "Middle Blocker",
    height: "6-10",
    avatar: "/images/players/player4.jpg",
    address: "Mỹ"
  },
  {
    id: 5,
    name: "David Chen",
    position: "Libero",
    height: "5-11",
    avatar: "/images/players/player5.jpg",
    address: "Việt Nam"
  },
  {
    id: 6,
    name: "Maria Garcia",
    position: "Opposite",
    height: "6-2",
    avatar: "/images/players/player6.jpg",
    address: "Tây Ban Nha"
  },
  {
    id: 7,
    name: "Nguyễn Văn A",
    position: "Middle Blocker",
    height: "6-3",
    avatar: "/images/players/player7.jpg",
    address: "Hà Nội"
  },
  {
    id: 8,
    name: "Trần Thị B",
    position: "Outside Hitter",
    height: "5-9",
    avatar: "/images/players/player8.jpg",
    address: "Hồ Chí Minh"
  },
  {
    id: 9,
    name: "Lê Minh C",
    position: "Opposite",
    height: "6-4",
    avatar: "/images/players/player9.jpg",
    address: "Đà Nẵng"
  }
];

const PlayersList: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  // ✅ Get unique positions for filter chips
  const positions = useMemo(() => {
    const allPositions = [...new Set(samplePlayers.map(player => player.position))];
    const positionOrder = ['Setter', 'Opposite', 'Outside Hitter', 'Middle Blocker', 'Libero'];
    return positionOrder.filter(pos => allPositions.includes(pos));
  }, []);

  // ✅ Filter players
  const filteredPlayers = useMemo(() => {
    return samplePlayers.filter(player => {
      const matchesSearch = searchTerm === '' || 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPosition = selectedPosition === '' || 
        player.position === selectedPosition;
      
      return matchesSearch && matchesPosition;
    });
  }, [searchTerm, selectedPosition]);

  const displayPlayers = showAll ? filteredPlayers : filteredPlayers.slice(0, 3);

  // ✅ Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPosition('');
  };

  return (
    <Box sx={{ 
      mb: 6, 
      width: '100%',
      px: { xs: 2, md: 4 }
    }}>
      
      {/* ✅ HEADER SECTION */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '2.5rem' },
            color: '#FF4500',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
            mb: 2
          }}
        >
          Danh Sách Thành Viên
        </Typography>
        <Typography 
          variant="h6" 
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.2rem' },
            maxWidth: '600px',
            mx: 'auto',
            mb: 4
          }}
        >
          Tìm kiếm và khám phá đội hình DVA Volleyball Club
        </Typography>
      </Box>

      {/* ✅ SEARCH & FILTER SECTION */}
      <Box sx={{ 
        maxWidth: '800px', 
        mx: 'auto', 
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        
        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên, vị trí, hoặc quê quán..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#FF4500' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => setSearchTerm('')}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <ClearIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
                </Button>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#FF6200',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF4500',
              },
            },
          }}
        />

        {/* Position Filter Chips */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Lọc theo vị trí:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label="Tất cả"
              variant={selectedPosition === '' ? 'filled' : 'outlined'}
              onClick={() => setSelectedPosition('')}
              sx={{
                backgroundColor: selectedPosition === '' ? '#FF4500' : 'transparent',
                color: selectedPosition === '' ? 'white' : '#FF4500',
                borderColor: '#FF4500',
                fontWeight: selectedPosition === '' ? 700 : 500,
                '&:hover': {
                  backgroundColor: selectedPosition === '' ? '#e03d00' : 'rgba(255, 69, 0, 0.1)',
                }
              }}
            />
            {positions.map((position) => (
              <Chip
                key={position}
                label={position}
                variant={selectedPosition === position ? 'filled' : 'outlined'}
                onClick={() => setSelectedPosition(position)}
                sx={{
                  backgroundColor: selectedPosition === position ? '#FF4500' : 'transparent',
                  color: selectedPosition === position ? 'white' : '#FF4500',
                  borderColor: '#FF4500',
                  fontWeight: selectedPosition === position ? 700 : 500,
                  '&:hover': {
                    backgroundColor: selectedPosition === position ? '#e03d00' : 'rgba(255, 69, 0, 0.1)',
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Search Results Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredPlayers.length === samplePlayers.length 
              ? `Hiển thị tất cả ${filteredPlayers.length} cầu thủ`
              : `Tìm thấy ${filteredPlayers.length} cầu thủ`
            }
            {selectedPosition && (
              <span style={{ color: '#FF4500', fontWeight: 600 }}>
                {` • Vị trí: ${selectedPosition}`}
              </span>
            )}
          </Typography>
          
          {(searchTerm || selectedPosition) && (
            <Button
              size="small"
              onClick={clearFilters}
              sx={{
                color: '#FF4500',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 69, 0, 0.1)',
                }
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Box>
      </Box>

      {/* ✅ PLAYERS GRID - REPLACED WITH FLEXBOX */}
      {filteredPlayers.length > 0 ? (
        <>
          <Box sx={{ 
            maxWidth: '1400px',
            mx: 'auto' 
          }}>
            {/* ✅ Flexbox Grid Layout */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 4,
                '@media (max-width: 600px)': {
                  gap: 2
                }
              }}
            >
              {displayPlayers.map((player, index) => (
                <Box
                  key={player.id}
                  sx={{
                    flex: {
                      xs: '1 1 100%',      // Mobile: 1 column
                      sm: '1 1 calc(50% - 16px)',  // Small: 2 columns
                      md: '1 1 calc(33.333% - 22px)', // Medium: 3 columns
                      lg: '1 1 calc(25% - 24px)'   // Large: 4 columns
                    },
                    maxWidth: {
                      xs: '100%',
                      sm: 'calc(50% - 16px)',
                      md: 'calc(33.333% - 22px)',
                      lg: 'calc(25% - 24px)'
                    },
                    minWidth: '280px' // Minimum card width
                  }}
                >
                  <Fade in={true} timeout={300 + (index * 100)}>
                    <Box>
                      <PlayerCard player={player} />
                    </Box>
                  </Fade>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Show More Button */}
          {filteredPlayers.length > 3 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => setShowAll(!showAll)}
                sx={{
                  backgroundColor: '#FF4500',
                  color: 'white',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#e03d00',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 69, 0, 0.4)'
                  }
                }}
              >
                {showAll ? 'Thu gọn' : `Xem thêm ${filteredPlayers.length - 3} cầu thủ`}
              </Button>
            </Box>
          )}
        </>
      ) : (
        /* ✅ NO RESULTS STATE */
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          maxWidth: '400px',
          mx: 'auto'
        }}>
          <SearchIcon sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy cầu thủ nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
          </Typography>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{
              borderColor: '#FF4500',
              color: '#FF4500',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#e03d00',
                backgroundColor: 'rgba(255, 69, 0, 0.1)',
              }
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PlayersList;
