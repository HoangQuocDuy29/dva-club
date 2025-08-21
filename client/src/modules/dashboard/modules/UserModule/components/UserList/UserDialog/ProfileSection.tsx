// ProfileSection.tsx - Add Update Profile functionality
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Link,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Phone,
  LocationOn,
  Cake,
  Person,
  ContactPhone,
  Facebook,
  Edit,
  Save,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../../../../../users/api/userApi';
import type { UserProfile } from '../../../../../../users/types/user';
import { useNotification } from '../../../../../../../containers/common/Notification/NotificationContext';
interface ProfileSectionProps {
  profile: UserProfile | null;
  isLoading: boolean;
  error: any;
  userId: number; // ✅ Add userId prop
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  profile, 
  isLoading, 
  error,
  userId 
}) => {
  const queryClient = useQueryClient();
  
  // ✅ State for update dialog
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const { showSuccess, showError } = useNotification(); // ✅ Use Notification
  const [formData, setFormData] = useState<UserProfile>({
    dateOfBirth: '',
    gender: 'male',
    address: '',
    bio: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
    },
  });

  // ✅ Update profile mutation
  const updateProfileMutation = useMutation({
  mutationFn: (data: UserProfile) => userApi.updateUserProfile(userId, data),
  onSuccess: () => {
    // ✅ CORRECT: Use object syntax
    queryClient.invalidateQueries({ 
      queryKey: ['userProfile', userId] 
    });
    setUpdateDialogOpen(false);
    showSuccess('Profile updated successfully!');
  },
  onError: (error: any) => {
    console.error('Profile update error:', error);
    showError('Failed to update profile. Please try again.');
  },
});

  // ✅ Open update dialog
  const handleUpdateClick = () => {
    // Pre-fill form with existing data
    setFormData({
      dateOfBirth: profile?.dateOfBirth || '',
      gender: profile?.gender || 'male',
      address: profile?.address || '',
      bio: profile?.bio || '',
      emergencyContact: {
        name: profile?.emergencyContact?.name || '',
        phone: profile?.emergencyContact?.phone || '',
        relationship: profile?.emergencyContact?.relationship || '',
      },
      socialLinks: {
        facebook: profile?.socialLinks?.facebook || '',
        instagram: profile?.socialLinks?.instagram || '',
        twitter: profile?.socialLinks?.twitter || '',
      },
    });
    setUpdateDialogOpen(true);
  };

  // ✅ Handle form changes
  const handleFormChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserProfile] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // ✅ Handle form submit
  const handleSubmit = () => {
    console.log('🔄 Updating profile with data:', formData);
    updateProfileMutation.mutate(formData);
  };

  // Existing loading/error states...
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
        <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Unable to load profile information: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ UPDATE PROFILE BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={handleUpdateClick}
          color="primary"
        >
          Update Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Show existing data or placeholders */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Cake color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body2" color={profile?.dateOfBirth ? 'text.primary' : 'text.secondary'}>
                    {profile?.dateOfBirth 
                      ? new Date(profile.dateOfBirth).toLocaleDateString()
                      : 'Not specified'
                    }
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Person color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Gender</Typography>
                  <Typography variant="body2" color={profile?.gender ? 'text.primary' : 'text.secondary'} sx={{ textTransform: 'capitalize' }}>
                    {profile?.gender || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocationOn color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body2" color={profile?.address ? 'text.primary' : 'text.secondary'}>
                    {profile?.address || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Bio</Typography>
                <Typography variant="body2" sx={{ mt: 1 }} color={profile?.bio ? 'text.primary' : 'text.secondary'}>
                  {profile?.bio || 'No bio available'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContactPhone color="primary" />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Emergency Contact */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Emergency Contact
                </Typography>
                {profile?.emergencyContact ? (
                  <Box sx={{ pl: 2, borderLeft: 2, borderColor: 'primary.light' }}>
                    <Typography variant="body2" fontWeight="medium">
                      {profile.emergencyContact.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.emergencyContact.relationship}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Phone fontSize="small" />
                      {profile.emergencyContact.phone}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                    No emergency contact specified
                  </Typography>
                )}
              </Box>
              
              {/* Social Links */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Social Links
                </Typography>
                {profile?.socialLinks?.facebook ? (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Link 
                      href={profile.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5, 
                        textDecoration: 'none',
                        color: '#1877f2',
                        '&:hover': { opacity: 0.8 }
                      }}
                    >
                      <Facebook fontSize="small" />
                      <Typography variant="body2">Facebook</Typography>
                    </Link>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No social links added
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ UPDATE PROFILE DIALOG */}
      <Dialog 
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleFormChange('gender', e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Bio"
                value={formData.bio}
                onChange={(e) => handleFormChange('bio', e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Emergency Contact</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                value={formData.emergencyContact?.name}
                onChange={(e) => handleFormChange('emergencyContact.name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                value={formData.emergencyContact?.phone}
                onChange={(e) => handleFormChange('emergencyContact.phone', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Relationship"
                value={formData.emergencyContact?.relationship}
                onChange={(e) => handleFormChange('emergencyContact.relationship', e.target.value)}
                fullWidth
                placeholder="e.g., spouse, parent, sibling"
              />
            </Grid>

            {/* Social Links */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Social Links</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Facebook URL"
                value={formData.socialLinks?.facebook}
                onChange={(e) => handleFormChange('socialLinks.facebook', e.target.value)}
                fullWidth
                placeholder="https://www.facebook.com/your.profile"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Instagram"
                value={formData.socialLinks?.instagram}
                onChange={(e) => handleFormChange('socialLinks.instagram', e.target.value)}
                fullWidth
                placeholder="@your_username"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Twitter"
                value={formData.socialLinks?.twitter}
                onChange={(e) => handleFormChange('socialLinks.twitter', e.target.value)}
                fullWidth
                placeholder="@your_username"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)} disabled={updateProfileMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={updateProfileMutation.isPending}
            startIcon={updateProfileMutation.isPending ? <CircularProgress size={16} /> : <Save />}
          >
            {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
