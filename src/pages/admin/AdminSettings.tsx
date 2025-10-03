import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsSkeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Settings,
  Save,
  RefreshCw,
  User,
  Globe,
  Edit,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logActivity } from '@/services/activityService';
import {
  getSystemSettings,
  saveSystemSettings,
  getUserProfile,
  saveUserProfile,
  initializeDefaultSettings,
  type SystemSettings,
  type UserProfile,
} from '@/services/settingsService';
import toast from 'react-hot-toast';

interface AdminSettingsProps {
  onNavigate: (page: string) => void;
}



export function AdminSettings({ onNavigate }: AdminSettingsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Nabus Motors',
    siteDescription: 'Premium car dealership with the best vehicles',
    adminEmail: 'admin@nabusmotors.com',
    supportEmail: 'support@nabusmotors.com',
    maintenanceMode: false,
    allowRegistration: false,
    maxFileSize: 10,
    emailNotifications: true,
    backupEnabled: true,
    backupFrequency: 'daily',
    timezone: 'UTC',
    currency: 'GHS',
    language: 'en',
    updatedAt: new Date(),
    updatedBy: ''
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    uid: user?.uid || '',
    displayName: user?.displayName || 'Admin User',
    email: user?.email || '',
    role: 'Administrator',
    department: 'Management',
    phoneNumber: '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      carUpdates: true,
      systemAlerts: true
    },
    updatedAt: new Date()
  });



  // Load data from Firebase on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;
      
      try {
        setInitialLoading(true);
        
        // Initialize default settings if needed
        await initializeDefaultSettings(user.uid);
        
        // Load system settings
        const settings = await getSystemSettings();
        if (settings) {
          setSystemSettings(settings);
        }
        
        // Load user profile
        const profile = await getUserProfile(user.uid);
        if (profile) {
          // Always use current user's email and displayName
          setUserProfile({
            ...profile,
            email: user.email || profile.email,
            displayName: user.displayName || profile.displayName
          });
        } else {
          // Create initial profile if doesn't exist
          const initialProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || 'Admin User',
            email: user.email || '',
            role: 'Administrator',
            department: 'Management',
            phoneNumber: '',
            bio: '',
            notifications: {
              email: true,
              push: true,
              carUpdates: true,
              systemAlerts: true
            },
            updatedAt: new Date()
          };
          await saveUserProfile(initialProfile);
          setUserProfile(initialProfile);
        }
        
      } catch (error) {
        console.error('Error loading settings data:', error);
        toast.error('Failed to load settings data');
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  // Subscribe to admin users
  useEffect(() => {
    // This effect is no longer needed but kept for potential future use
  }, []);

  const handleSaveSystemSettings = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const { updatedAt, updatedBy, ...settingsToSave } = systemSettings;
      await saveSystemSettings(settingsToSave, user.uid);
      
      await logActivity(
        'settings_updated', 
        'System settings updated', 
        user.uid,
        user.displayName || user.email || 'Admin',
        {
          status: 'success',
          details: { section: 'general' }
        }
      );
      
      toast.success('System settings saved successfully');
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUserProfile = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const { updatedAt, ...profileToSave } = userProfile;
      await saveUserProfile(profileToSave);
      
      await logActivity(
        'settings_updated', 
        'User profile updated', 
        user.uid,
        user.displayName || user.email || 'Admin',
        {
          status: 'success',
          details: { section: 'profile' }
        }
      );
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving user profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage system configuration and user preferences</p>
        </div>
        <Button variant="outline" onClick={() => onNavigate('dashboard')} className="w-full sm:w-auto">
          <Settings className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
          <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base md:text-lg">
                <Globe className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Site Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName" className="text-sm">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="adminEmail" className="text-sm">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={systemSettings.adminEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription" className="text-sm">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency" className="text-sm">Currency</Label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GHS">GHS (₵)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Disable public access to the site</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send system notifications via email</p>
                  </div>
                  <Switch
                    checked={systemSettings.emailNotifications}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystemSettings} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-red-100 text-red-700 text-lg font-medium">
                    {userProfile.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-600 mt-1">JPG, PNG or GIF (max 2MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={userProfile.displayName}
                    onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || userProfile.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={userProfile.role}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={userProfile.phoneNumber}
                    onChange={(e) => setUserProfile({...userProfile, phoneNumber: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveUserProfile} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}