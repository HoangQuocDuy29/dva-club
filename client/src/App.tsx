// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\App.tsx
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { queryClient } from './services/api/client'
import { AppRouter } from './router/AppRouter'
import { NotificationProvider } from './containers/common/Notification/NotificationContext'
import { useAuthStore } from './modules/auth/store/authStore' // ✅ Add import
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Enhanced MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 500,
        },
      },
    },
  },
})

// ✅ NEW: Auth Initializer Component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🚀 Starting app auth initialization...');
        await initializeAuth();
        console.log('✅ App auth initialization completed');
      } catch (error) {
        console.error('❌ App auth initialization failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, [initializeAuth]);

  // Show loading spinner during initialization (optional)
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <div>Initializing...</div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <NotificationProvider>
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            {/* ✅ Wrap AppRouter với AuthInitializer */}
            <AuthInitializer>
              <AppRouter />
            </AuthInitializer>
          </BrowserRouter>
          
          <ToastContainer 
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastStyle={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '15px',
              borderRadius: '12px',
              fontWeight: 500,
            }}
            style={{
              zIndex: 9999,
            }}
          />
          
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </div>
    </NotificationProvider>
  )
}

export default App
