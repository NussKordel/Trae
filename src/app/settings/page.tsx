'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { useUserStore } from '@/store/useAppStore';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { AISettings } from '@/components/settings/AISettings';
import { ThemeToggle } from '@/components/ThemeToggle';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const { settings, updateSettings, profile } = useUserStore();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Initialize settings with profile data if available
  React.useEffect(() => {
    if (profile && !settings.profile.name) {
      updateSettings('profile', {
        name: profile.name || '',
        email: profile.email || ''
      });
    }
  }, [profile, settings.profile.name, updateSettings]);

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your personal information',
      icon: User
    },
    {
      id: 'ai',
      title: 'AI Settings',
      description: 'Configure AI features and preferences',
      icon: Settings
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Control your notification preferences',
      icon: Bell
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Manage your privacy and security settings',
      icon: Shield
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the app appearance',
      icon: Palette
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your app preferences',
      icon: Globe
    }
  ];

  const handleSettingChange = (section: keyof typeof settings, key: string, value: any) => {
    updateSettings(section, { ...settings[section], [key]: value });
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // Settings are automatically saved to store via updateSettings
    setHasUnsavedChanges(false);
    // You could add a toast notification here
  };

  const handleResetSettings = () => {
    // Reset to default values - you'd implement this in your store
    setHasUnsavedChanges(false);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={settings.profile.timezone}
            onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Change Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <h3 className="font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-sm text-gray-600">
              {key === 'workoutReminders' && 'Get reminded about scheduled workouts'}
              {key === 'achievementAlerts' && 'Notifications when you earn achievements'}
              {key === 'weeklyReports' && 'Weekly progress and summary reports'}
              {key === 'emailNotifications' && 'Receive notifications via email'}
              {key === 'pushNotifications' && 'Push notifications on your device'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-4">
      <div className="p-3 border rounded-lg">
        <h3 className="font-medium mb-2">Profile Visibility</h3>
        <select
          value={settings.privacy.profileVisibility}
          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <h3 className="font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-sm text-gray-600">
              {key === 'shareWorkouts' && 'Allow others to see your workout activities'}
              {key === 'shareAchievements' && 'Share your achievements with others'}
              {key === 'dataCollection' && 'Allow anonymous data collection for app improvement'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-4">
      <div className="p-3 border rounded-lg">
        <h3 className="font-medium mb-2">Theme</h3>
        <p className="text-sm text-gray-600 mb-3">Choose your preferred app theme</p>
        <ThemeToggle />
      </div>
      
      <div className="p-3 border rounded-lg">
        <h3 className="font-medium mb-2">Color Scheme</h3>
        <p className="text-sm text-gray-600 mb-3">Select your preferred color scheme</p>
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer border-2 border-blue-600"></div>
          <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer border-2 border-transparent hover:border-green-600"></div>
          <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer border-2 border-transparent hover:border-purple-600"></div>
          <div className="w-8 h-8 bg-orange-500 rounded-full cursor-pointer border-2 border-transparent hover:border-orange-600"></div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={settings.preferences.language}
            onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Units</label>
          <select
            value={settings.preferences.units}
            onChange={(e) => handleSettingChange('preferences', 'units', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, ft)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Start of Week</label>
          <select
            value={settings.preferences.startOfWeek}
            onChange={(e) => handleSettingChange('preferences', 'startOfWeek', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Default Workout Duration (minutes)</label>
          <input
            type="number"
            min="15"
            max="120"
            value={settings.preferences.defaultWorkoutDuration}
            onChange={(e) => handleSettingChange('preferences', 'defaultWorkoutDuration', parseInt(e.target.value))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'ai':
        return <AISettings />;
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'preferences':
        return renderPreferencesSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and app preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={handleResetSettings}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
          <Button 
            className="flex items-center space-x-2"
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {settingsSections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <CardDescription>
                {settingsSections.find(s => s.id === activeSection)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;