// E:\2_NodeJs\DVA_Club\volleyball-club-management\client\src\containers\common\AvatarUpload\AvatarUpload.tsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PhotoCamera, Delete, Upload } from '@mui/icons-material';
import { useNotification } from '../Notification/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  onFileChange?: (file: File | null) => void;
  userId: number;
  size?: number;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  onFileChange,
  userId,
  size = 120,
}) => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient(); // ✅ ADD: Initialize queryClient
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (onFileChange) {
      onFileChange(file);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file (JPG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('Image size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // If no onFileChange handler, upload immediately
    if (!onFileChange) {
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    
    try {
      // ✅ Validate file
      if (!file) {
        throw new Error('No file selected');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // ✅ FIX: Properly declare FormData
      const formData = new FormData(); // ✅ Was: formData (wrong case)
      formData.append('avatar', file);

      console.log('📤 Uploading avatar:', {
        userId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // ✅ FIX: Properly declare token variable
      const token = localStorage.getItem('auth-token'); // ✅ Was: token (not declared)
      
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
      
      const response = await fetch(`http://localhost:3001/api/v1/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary
        },
      });

      console.log('📥 Upload response status:', response.status);

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.message || `Upload failed with status ${response.status}`;
        } catch {
          errorText = `Upload failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('✅ Avatar upload success:', data);

      // ✅ Handle response data
      const newAvatarUrl = data.data?.avatarUrl || 
                          data.data?.avatar || 
                          data.avatarUrl || 
                          data.avatar || 
                          '';

      if (!newAvatarUrl) {
        throw new Error('Avatar URL not received from server');
      }

      // ✅ Update local state
      onAvatarChange(newAvatarUrl);
      
      // ✅ FIX: Refresh user data via queryClient
      queryClient.invalidateQueries({ queryKey: ['users'] }); // ✅ Was: queryClient (not declared)
      
      showSuccess('Avatar updated successfully! ✅');

    } catch (error: any) {
      console.error('❌ Avatar upload error:', error);
      
      let errorMessage = 'Failed to upload avatar. Please try again.';
      
      if (error.message.includes('Authentication')) {
        errorMessage = 'Please login again to upload avatar.';
      } else if (error.message.includes('file')) {
        errorMessage = error.message;
      } else if (error.message.includes('size')) {
        errorMessage = 'File is too large. Please choose a smaller image (max 5MB).';
      } else if (error.message.includes('Network') || error.name === 'NetworkError') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      showError(errorMessage);
      
      // Cleanup preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    onAvatarChange('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayAvatarUrl = previewUrl || currentAvatar;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Avatar Display */}
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={displayAvatarUrl}
          sx={{
            width: size,
            height: size,
            border: '4px solid',
            borderColor: 'primary.main',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
        >
          {!displayAvatarUrl && <PhotoCamera sx={{ fontSize: size * 0.4 }} />}
        </Avatar>

        {/* Upload Progress Overlay */}
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress size={32} sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Upload Button */}
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Upload new avatar image"
          title="Upload new avatar image"
          sx={{
            position: 'absolute',
            bottom: -8,
            right: -8,
            backgroundColor: 'primary.main',
            color: 'white',
            width: 40,
            height: 40,
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Upload fontSize="small" />
        </IconButton>

        {/* Remove Button */}
        {displayAvatarUrl && !uploading && (
          <IconButton
            onClick={handleRemoveAvatar}
            aria-label="Remove current avatar"
            title="Remove current avatar"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'error.main',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                backgroundColor: 'error.dark',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Helper Text */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {uploading ? 'Uploading...' : 'Click the upload button to change avatar'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported: JPG, PNG, GIF (Max 5MB)
        </Typography>
      </Box>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-label="Avatar image file input"
        title="Select avatar image file"
      />
    </Box>
  );
};