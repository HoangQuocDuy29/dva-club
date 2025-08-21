// src/contexts/NotificationContext.tsx - ENHANCED VERSION
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertColor, 
  Slide, 
  SlideProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Backdrop
} from '@mui/material';
import { CheckCircle, ErrorOutline, Warning, Info, HelpOutline } from '@mui/icons-material';

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

// ✅ Custom slide transition from top
const SlideTransition = React.forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  return <Slide direction="down" ref={ref} {...props} />;
});
SlideTransition.displayName = 'SlideTransition';

// ✅ Custom icons mapping
const severityIcons: Record<AlertColor, React.ReactElement> = {
  success: <CheckCircle fontSize="inherit" />,
  error: <ErrorOutline fontSize="inherit" />,
  warning: <Warning fontSize="inherit" />,
  info: <Info fontSize="inherit" />,
};

// ✅ Custom colors for each severity
const severityStyles: Record<AlertColor, object> = {
  success: {
    backgroundColor: '#2e7d32',
    color: '#fff',
    '& .MuiAlert-icon': { color: '#fff' },
  },
  error: {
    backgroundColor: '#d32f2f',
    color: '#fff',
    '& .MuiAlert-icon': { color: '#fff' },
  },
  warning: {
    backgroundColor: '#f57500',
    color: '#fff',
    '& .MuiAlert-icon': { color: '#fff' },
  },
  info: {
    backgroundColor: '#1976d2',
    color: '#fff',
    '& .MuiAlert-icon': { color: '#fff' },
  },
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // ✅ Notification states
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(4000);

  // ✅ Confirmation dialog states
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationOnConfirm, setConfirmationOnConfirm] = useState<(() => void) | null>(null);
  const [confirmationOnCancel, setConfirmationOnCancel] = useState<(() => void) | null>(null);

  // ✅ Notification methods
  const showNotification = useCallback((msg: string, sev: AlertColor = 'info', dur: number = 4000) => {
    setMessage(msg);
    setSeverity(sev);
    setDuration(dur);
    setOpen(true);
  }, []);

  const showSuccess = useCallback((msg: string) => showNotification(msg, 'success', 3000), [showNotification]);
  const showError = useCallback((msg: string) => showNotification(msg, 'error', 5000), [showNotification]);
  const showWarning = useCallback((msg: string) => showNotification(msg, 'warning', 4000), [showNotification]);
  const showInfo = useCallback((msg: string) => showNotification(msg, 'info', 3000), [showNotification]);

  // ✅ NEW: Confirmation dialog method
  const showConfirmation = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setConfirmationTitle(title);
    setConfirmationMessage(message);
    setConfirmationOnConfirm(() => onConfirm);
    setConfirmationOnCancel(() => onCancel || (() => {}));
    setConfirmationOpen(true);
  }, []);

  // ✅ Handle notification close
  const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  // ✅ Handle confirmation dialog actions
  const handleConfirmationConfirm = () => {
    if (confirmationOnConfirm) {
      confirmationOnConfirm();
    }
    setConfirmationOpen(false);
  };

  const handleConfirmationCancel = () => {
    if (confirmationOnCancel) {
      confirmationOnCancel();
    }
    setConfirmationOpen(false);
  };

  // ✅ Memoize context value
  const contextValue = React.useMemo(() => ({
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
  }), [showNotification, showSuccess, showError, showWarning, showInfo, showConfirmation]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* ✅ TOP-CENTER Snackbar Notifications */}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{ 
          zIndex: (theme) => theme.zIndex.snackbar + 1000,
          '& .MuiSnackbar-root': {
            top: { xs: 24, sm: 24 },
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          icon={severityIcons[severity]}
          sx={{
            width: '100%',
            minWidth: '300px',
            maxWidth: '500px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            marginTop: '20px',
            '& .MuiAlert-icon': {
              fontSize: '22px',
              marginRight: '12px',
            },
            '& .MuiAlert-message': {
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiAlert-action': {
              paddingTop: 0,
              alignItems: 'center',
              '& .MuiIconButton-root': {
                color: 'inherit',
                opacity: 0.8,
                padding: '4px',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
            ...severityStyles[severity],
            '&:hover': {
              transform: 'translateY(2px)',
              transition: 'transform 0.2s ease-in-out',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* ✅ NEW: CUSTOM CONFIRMATION DIALOG */}
      <Dialog
        open={confirmationOpen}
        onClose={handleConfirmationCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.15)',
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HelpOutline color="warning" sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {confirmationTitle}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            {confirmationMessage}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleConfirmationCancel}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmationConfirm}
            variant="contained"
            color="warning"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)',
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};

// ✅ Custom hook
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export type { NotificationContextType };
