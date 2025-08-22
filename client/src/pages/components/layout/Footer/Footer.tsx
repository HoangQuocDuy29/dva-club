import React from 'react';
import DVALogo from '../../../../assets/images/logos/dva.png'
import { 
  Box, 
  Container, 
  Typography, 
  Link,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';

// ✅ Types Definition
interface ContactInfo {
  address: string;
  phone: string;
}

interface SocialLink {
  url: string;
  label: string;
  type: 'admin' | 'fanpage';
}

interface FooterProps {
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}

// ✅ Static Data
const defaultContactInfo: ContactInfo = {
  address: '155 Trường Chinh - Thanh Xuân - Hà Nội',
  phone: '0768 299 329'
};

const defaultSocialLinks: SocialLink[] = [
  {
    url: 'https://www.facebook.com/duy.hoangquoc.1/',
    label: 'Admin Profile',
    type: 'admin'
  },
  {
    url: 'https://www.facebook.com/profile.php?id=61552198143397',
    label: 'DVA Fan Page',
    type: 'fanpage'
  }
];

const Footer: React.FC<FooterProps> = ({
  contactInfo = defaultContactInfo,
  socialLinks = defaultSocialLinks
 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, #FF4500 0%, #FF6200 30%, #FFA500 70%, #FFB84D 100%)`,
        color: 'white',
        py: 2,
        position: 'relative',
        minHeight: 'auto',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '100%', px: { xs: 2, md: 4 } }}>
        {/* ✅ 4 COLUMNS LAYOUT */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          gap: { xs: 3, md: 2 },
          textAlign: { xs: 'center', md: 'left' },
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* ✅ COLUMN 1 - Club Name & Logo (1/4) */}
          <Box sx={{ 
            flex: '1 1 25%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 1.5
          }}>
            <Box
              component="img"
              src={DVALogo}
              alt="DVA Club Logo"
              onError={(e: any) => {
                console.error('Logo load failed');
                e.target.style.display = 'none';
              }}
              sx={{
                width: 60,
                height: 60,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
                mb: 1
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  lineHeight: 1.2
                }}
              >
                DVA
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.2
                }}
              >
                Volleyball Club
              </Typography>
            </Box>
          </Box>

          {/* ✅ COLUMN 2 - Address (1/4) */}
          <Box sx={{ 
            flex: '1 1 25%',
            minWidth: 0,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                mb: 1
              }}
            >
              Address
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1
            }}>
              <LocationIcon sx={{ 
                fontSize: '1.2rem', 
                color: 'white', 
                mt: 0.2,
                flexShrink: 0 
              }} />
              <Typography
                variant="body2"
                sx={{ 
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.4
                }}
              >
                {contactInfo.address}
              </Typography>
            </Box>
          </Box>

          {/* ✅ COLUMN 3 - Phone (1/4) */}
          <Box sx={{ 
            flex: '1 1 25%',
            minWidth: 0,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                mb: 1
              }}
            >
              Phone
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              <PhoneIcon sx={{ 
                fontSize: '1.2rem', 
                color: 'white',
                flexShrink: 0 
              }} />
              <Link
                href={`tel:${contactInfo.phone}`}
                sx={{ 
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: 'white',
                    textDecoration: 'underline'
                  }
                }}
              >
                {contactInfo.phone}
              </Link>
            </Box>
          </Box>

          {/* ✅ COLUMN 4 - Social Media (1/4) */}
          <Box sx={{ 
            flex: '1 1 25%',
            minWidth: 0,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 1.5
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                mb: 1
              }}
            >
              Social
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 1,
              alignItems: { xs: 'center', md: 'flex-start' }
            }}>
              {socialLinks.map((social, index) => (
                <Box key={index} sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <IconButton
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: '#1877F2', // Facebook blue
                      border: '1px solid #1877F2',
                      borderRadius: '8px',
                      color: 'white',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#1877F2',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 3px 8px rgba(24, 119, 242, 0.4)',
                        filter: 'brightness(1.1)'
                      }
                    }}
                    aria-label={social.label}
                  >
                    <FacebookIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                  
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.95)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'color 0.2s ease',
                      '&:hover': { 
                        color: 'white',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {social.type === 'admin' ? 'Admin' : 'Fan Page'}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ✅ COPYRIGHT */}
        <Box 
          sx={{ 
            textAlign: 'center',
            mt: 2,
            pt: 1.5,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '1200px',
            margin: '2rem auto 0'
          }}
        >
          <Typography
            variant="caption"
            sx={{ 
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400
            }}
          >
            © {new Date().getFullYear()} DVA Volleyball Club
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
