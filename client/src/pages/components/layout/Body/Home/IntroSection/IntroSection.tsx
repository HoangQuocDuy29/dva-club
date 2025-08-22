import React from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { 
  CheckCircle as CheckIcon,
  DateRange as DateIcon,
  Sports as SportsIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon
} from "@mui/icons-material";

// ✅ Import ảnh từ local (thay đổi path theo cấu trúc folder của bạn)
import intro1 from '../../../../../../assets/images/intro/intro1.jpg';
import intro2 from '../../../../../../assets/images/intro/intro2.jpg';
import intro3 from '../../../../../../assets/images/intro/intro3.jpg';
import intro4 from '../../../../../../assets/images/intro/intro4.jpg';
import intro5 from '../../../../../../assets/images/intro/intro5.jpg';
import intro6 from '../../../../../../assets/images/intro/intro6.jpg';
import clubImage from '../../../../../../assets/images/intro/club_main.jpg';

const IntroSection: React.FC = () => {
  const topRowImages = [intro1, intro2, intro3];
  const bottomRowImages = [intro4, intro5, intro6];

  return (
    <Container maxWidth="lg" sx={{ mb: 8, mt: 4 }}>
      
      {/* ✅ CONTINUOUS SLIDING IMAGES SECTION */}
      <Box sx={{ mb: 6,width: '100%' }}>
        
        {/* Top Row - Slide Right to Left - SEAMLESS */}
        <Box sx={{ 
          overflow: 'hidden',
          mb: 3,
          width: '100%'
        }}>
          <Box
            sx={{
              display: 'flex',
              width: '200%', // ✅ Double width for seamless loop
              animation: 'slideRightContinuous 15s linear infinite',
              '@keyframes slideRightContinuous': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' } // ✅ Move exactly half for seamless loop
              }
            }}
          >
            {/* ✅ Duplicate array for continuous effect */}
            {[...topRowImages, ...topRowImages].map((img, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 300px', // ✅ Fixed width, no shrink
                  height: 200,
                  mr: 2, // ✅ Consistent gap between images
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      zIndex: 2
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`DVA Club ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom Row - Slide Left to Right - SEAMLESS */}
        <Box sx={{ 
          overflow: 'hidden',
          width: '100%'
        }}>
          <Box
            sx={{
              display: 'flex',
              width: '200%', // ✅ Double width for seamless loop
              animation: 'slideLeftContinuous 18s linear infinite',
              '@keyframes slideLeftContinuous': {
                '0%': { transform: 'translateX(-50%)' }, // ✅ Start from half
                '100%': { transform: 'translateX(0)' } // ✅ Move to start for seamless loop
              }
            }}
          >
            {/* ✅ Duplicate array for continuous effect */}
            {[...bottomRowImages, ...bottomRowImages].map((img, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 300px', // ✅ Fixed width, no shrink
                  height: 200,
                  mr: 2, // ✅ Consistent gap between images
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      zIndex: 2
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`DVA Club ${index + 4}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ✅ CONTENT SECTION - Text + Side Image */}
      <Box sx={{ 
        display: 'flex', 
        gap: 4,
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        
        {/* Left - Club Introduction */}
        <Box sx={{ flex: 2 }}>
          <Typography 
            variant="h3" 
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#FF4500',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
              mb: 3
            }}
          >
            DVA Volleyball Club
          </Typography>

          <List sx={{ '& .MuiListItem-root': { pl: 0, py: 1 } }}>
            <ListItem>
              <ListItemIcon>
                <CheckIcon sx={{ color: '#FF4500', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="DVA Club là một đội bóng chuyền phong trào chuyên nghiệp"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <DateIcon sx={{ color: '#FF6200', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Thành lập ngày 16 tháng 4 năm 2023 tại Hà Nội"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <SportsIcon sx={{ color: '#FFA500', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Thể loại: Indoor Volleyball"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <PeopleIcon sx={{ color: '#FFB84D', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Tổng số thành viên lên đến 200+"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <TrophyIcon sx={{ color: '#FF4500', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Tham gia các giải đấu cấp CLB khu vực Hà Nội và 1 số tỉnh phía Bắc"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckIcon sx={{ color: '#FF6200', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Môi trường sinh hoạt hoà đồng"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <PeopleIcon sx={{ color: '#FFA500', fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Tạo cộng đồng thể thao tích cực, đoàn kết và phát triển bền vững"
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              />
            </ListItem>

          </List>
        </Box>

        {/* Right - Side Image */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              maxWidth: 400,
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box
              component="img"
              src={clubImage}
              alt="DVA Volleyball Club"
              sx={{
                width: '100%',
                height: { xs: 300, md: 500 },
                objectFit: 'cover'
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default IntroSection;