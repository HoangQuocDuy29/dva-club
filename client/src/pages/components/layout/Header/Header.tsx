import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../modules/auth/hooks/useAuth";

// ✅ IMPORT LOGO TRỰC TIẾP
import DVALogo from '../../../../assets/images/logos/dva.png';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  // ✅ States
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // ✅ Logout confirmation dialog

  // ✅ Menu Data
  const menuData = [
    { id: 1, title: "Home", path: "/" },
    { id: 2, title: "Information", path: "/information" },
    { id: 3, title: "Ranking", path: "/ranking" },
    { id: 4, title: "Tournament", path: "/tournament" },
    { id: 5, title: "Contact", path: "/contact" }
  ];

  // ✅ Hide/Show on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
        setHidden(true);
      } else if (currentScrollPos < prevScrollPos) {
        setHidden(false);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // ✅ Check if path is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // ✅ SAFE USER NAME
  const getSafeUserName = (): string => {
    if (!user) return 'User';
    return user.firstName || user.username || user.email || 'User';
  };

  // ✅ SHOW LOGOUT CONFIRMATION
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  // ✅ CONFIRM LOGOUT
  const handleConfirmLogout = async () => {
    try {
      setLogoutDialogOpen(false);
      await logout();
      navigate('/'); // ✅ Redirect về trang chủ
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  // ✅ CANCEL LOGOUT
  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <AppBar 
        position="fixed"
        elevation={4}
        sx={{
          top: hidden ? '-80px' : '0',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1100,
          background: `linear-gradient(135deg, #FF4500 0%, #FF6200 30%, #FFA500 70%, #FFB84D 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(255, 69, 0, 0.3)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '64px' }}>
            
            {/* ✅ LEFT SECTION - Logo + Title + Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              
              {/* Logo + Title (Clickable to Home) */}
              <Box 
                component={Link}
                to="/"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  textDecoration: 'none',
                  flexShrink: 0,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    '& img': {
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))'
                    }
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box
                  component="img"
                  src={DVALogo}
                  alt="DVA Logo"
                  sx={{
                    width: { xs: 40, md: 50 },
                    height: { xs: 40, md: 50 },
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                    transition: 'all 0.3s ease'
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  DVA Volleyball Club
                </Typography>
              </Box>

              {/* Menu Options */}
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 1, ml: 3 }}>
                  {menuData.map((item) => (
                    <Button
                      key={item.id}
                      component={Link}
                      to={item.path}
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        backgroundColor: isActiveLink(item.path) 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-2px)',
                        },
                        '&::after': isActiveLink(item.path) ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '80%',
                          height: '2px',
                          background: 'white',
                          borderRadius: '1px'
                        } : {}
                      }}
                    >
                      {item.title}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            {/* ✅ RIGHT SECTION - Sign In/Sign Up */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAuthenticated ? (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      '&:hover': { 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/signup"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/profile"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      display: { xs: 'none', md: 'block' }
                    }}
                  >
                    {getSafeUserName()}
                  </Button>
                  <Button
                    onClick={handleLogoutClick} // ✅ Show confirmation dialog
                    startIcon={<LogoutIcon />}
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileOpen(!mobileOpen)}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    ml: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              )}
            </Box>
          </Toolbar>

          {/* ✅ MOBILE MENU */}
          {isMobile && mobileOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 69, 0, 0.95)',
                backdropFilter: 'blur(15px)',
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                p: 2,
                zIndex: 1000
              }}
            >
              {/* Mobile Navigation */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  Navigation
                </Typography>
                {menuData.map((item) => (
                  <Button
                    key={item.id}
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    fullWidth
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      py: 1.5,
                      mb: 0.5,
                      borderRadius: 2,
                      backgroundColor: isActiveLink(item.path) 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>

              {/* Mobile Auth */}
              {!isAuthenticated ? (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    Account
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      component={Link}
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      fullWidth
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={Link}
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      fullWidth
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                    Account
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      component={Link}
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      fullWidth
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        py: 1.5,
                        borderRadius: 2
                      }}
                    >
                      Profile ({getSafeUserName()})
                    </Button>
                    <Button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogoutClick(); // ✅ Show confirmation dialog
                      }}
                      fullWidth
                      startIcon={<LogoutIcon />}
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        py: 1.5,
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Logout 
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </AppBar>
      
      {/* ✅ LOGOUT CONFIRMATION DIALOG */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleCancelLogout}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.3rem',
            color: '#FF4500',
            pb: 1
          }}
        >
          Confirm Logout
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <LogoutIcon 
            sx={{ 
              fontSize: 48, 
              color: '#FF6200', 
              mb: 2,
              opacity: 0.8 
            }} 
          />
          <DialogContentText
            sx={{
              fontSize: '1rem',
              color: 'text.primary',
              fontWeight: 500,
              mb: 1
            }}
          >
            Are you sure you want to log out of the system?
          </DialogContentText>
          <DialogContentText
            sx={{
              fontSize: '0.9rem',
              color: 'text.secondary'
            }}
          >
            You will be redirected to the home page after logging out.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, px: 3 }}>
          <Button
            onClick={handleCancelLogout}
            variant="outlined"
            sx={{
              minWidth: 100,
              borderColor: '#ccc',
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Cancle
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            sx={{
              minWidth: 100,
              backgroundColor: '#FF4500',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#e03d00',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(255, 69, 0, 0.4)'
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      
      <Toolbar />
    </>
  );
};

export default Header;
