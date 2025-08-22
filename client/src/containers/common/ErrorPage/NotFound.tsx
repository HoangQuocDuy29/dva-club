import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LogoNotFound from '../../../assets/images/error/dva2.png';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',         // ✅ THÊM: fixed position
        top: 0,                    // ✅ THÊM: stick to top
        left: 0,                   // ✅ THÊM: stick to left
        overflow: 'hidden',        // ✅ QUAN TRỌNG: ẩn scroll
        background: `
          radial-gradient(circle at 30% 40%, rgba(255, 184, 77, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 70% 60%, rgba(255, 98, 0, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #8B0000 0%, #A52A2A 50%, #8B0000 100%)
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.1) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1,
          height: '100%',                    // ✅ THÊM: full height
          display: 'flex',                   // ✅ THÊM: flex layout
          flexDirection: 'column',           // ✅ THÊM: column direction
          justifyContent: 'center',          // ✅ THÊM: center content
          alignItems: 'center',              // ✅ THÊM: center items
          padding: '2rem 1rem',              // ✅ THÊM: safe padding
          boxSizing: 'border-box',           // ✅ THÊM: include padding in height
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            mb: 0,
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        >
          <img
            src={LogoNotFound}
            alt="DVA Logo"
            style={{
              width: '180px',
              height: 'auto',
              filter: 'drop-shadow(0 10px 30px rgba(255, 69, 0, 0.4))',
            }}
          />
        </Box>

        {/* 404 Text */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
            fontWeight: 900,
            color: '#FF4500',
            textShadow: `
              0 0 20px rgba(255, 69, 0, 0.8),
              0 0 40px rgba(255, 98, 0, 0.6),
              0 0 60px rgba(255, 165, 0, 0.4)
            `,
            mb: 0,
            background: `linear-gradient(45deg, #FF4500, #FF6200, #FFA500)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'glow 2s ease-in-out infinite alternate',
            '@keyframes glow': {
              '0%': { 
                textShadow: '0 0 20px rgba(255, 69, 0, 0.8), 0 0 40px rgba(255, 98, 0, 0.6)' 
              },
              '100%': { 
                textShadow: '0 0 30px rgba(255, 165, 0, 1), 0 0 60px rgba(255, 184, 77, 0.8)' 
              },
            },
          }}
        >
          404
        </Typography>

        {/* Not Found Text */}
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            fontWeight: 600,
            color: '#FFB84D',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Page Not Found
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            color: '#FFA500',
            mb: 3,
            maxWidth: '400px',
            mx: 'auto',
            lineHeight: 1.5,
            opacity: 0.9,
          }}
        >
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{
              background: 'linear-gradient(45deg, #FF4500, #FF6200)',
              color: 'white',
              px: 3,
              py: 1.2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(255, 69, 0, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF6200, #FFA500)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(255, 69, 0, 0.6)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              borderColor: '#FFA500',
              color: '#FFA500',
              px: 3,
              py: 1.2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              borderWidth: 2,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#FFB84D',
                color: '#8B0000',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Go Back
          </Button>
        </Box>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(255, 165, 0, 0.3), transparent)',
            borderRadius: '50%',
            animation: 'rotate 10s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(255, 69, 0, 0.2), transparent)',
            borderRadius: '50%',
            animation: 'rotate 15s linear infinite reverse',
          }}
        />
      </Container>
    </Box>
  );
};

export default NotFound;
