'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MOCK_USERS } from '@/lib/DummyData';
import { FullUserData, UserRole, LaborMetadata } from '@/types/user';
import { useUserData } from '@/hooks/use-user-data';

interface SettingsState {
  userData: FullUserData;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: string;
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

type Section = 'profile' | 'notifications' | 'privacy';

export default function SettingsPage() {
  const { user } = useUserData();
  const [useMockData, setUseMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('profile');

  const defaultSettings: SettingsState = {
    userData: {
      account: {
        publicKey: '',
        authority: '',
        name: '',
        metadata_uri: '',
        active: true,
        verified: false,
        rating: 0,
        rating_count: 0,
        timestamp: Date.now(),
        index: 0,
        role: UserRole.Labour,
        spam: false
      },
      metadata: {
        name: '',
        bio: '',
        profileImage: '',
        skillsets: [],
        experience: []
      } as LaborMetadata
    },
    notifications: {
      email: true,
      push: true,
      marketing: false,
      updates: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
      showLocation: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30
    }
  };

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    if (useMockData && MOCK_USERS.length > 0) {
      const mockUser = MOCK_USERS[0];
      setSettings(prev => ({
        ...prev,
        userData: mockUser
      }));
    } else if (user) {
      setSettings(prev => ({
        ...prev,
        userData: user
      }));
    }
  }, [useMockData, user]);

  const handleSave = async () => {
    setIsLoading(true);
    // Implement save logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const scrollToSection = (section: Section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => scrollToSection('profile')}
                  className={`w-full text-left py-2 px-4 rounded transition-colors ${
                    activeSection === 'profile' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => scrollToSection('notifications')}
                  className={`w-full text-left py-2 px-4 rounded transition-colors ${
                    activeSection === 'notifications' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => scrollToSection('privacy')}
                  className={`w-full text-left py-2 px-4 rounded transition-colors ${
                    activeSection === 'privacy' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  Privacy & Security
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Profile Settings */}
            <section id="profile" className="bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={settings.userData.metadata.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      userData: {
                        ...prev.userData,
                        metadata: {
                          ...prev.userData.metadata,
                          name: e.target.value
                        }
                      }
                    }))}
                    className="bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={settings.userData.metadata.bio}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      userData: {
                        ...prev.userData,
                        metadata: {
                          ...prev.userData.metadata,
                          bio: e.target.value
                        }
                      }
                    }))}
                    className="bg-gray-700"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={useMockData}
                    onCheckedChange={setUseMockData}
                  />
                  <span>Use Mock Data</span>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section id="notifications" className="bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [key]: checked
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy & Security */}
            <section id="privacy" className="bg-gray-800 backdrop-blur-lg bg-opacity-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Privacy & Security</h3>
              <div className="space-y-6">
                {Object.entries(settings.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Switch
                      checked={typeof value === 'boolean' ? value : false}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          [key]: checked
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 