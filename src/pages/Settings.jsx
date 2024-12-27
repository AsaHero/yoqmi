// src/pages/Settings.jsx
import React, { useState } from 'react';
import { User, Moon, Globe, Loader } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from '../hooks/useTranslation';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'uz', label: 'O`zbekcha' },
];

const Settings = () => {
  const { state: { user, preferences, isLoading, error }, updateUser, updatePreferences } = useUser();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Update form data when user data becomes available
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'preferences', label: t('settings.preferences'), icon: Globe },
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateUser(formData);
  };

  const handleLanguageChange = async (e) => {
    await updatePreferences({ language:  e.target.value});
  };

  const handleDarkModeToggle = async () => {
    await updatePreferences({ darkMode: !preferences?.darkMode });
  };

  // Show loading spinner when loading or no user
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {t('messages.error')}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {t('settings.title')}
      </h1>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm
                ${activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                dark:text-gray-400 dark:hover:text-gray-300
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.profilePicture')}
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700
                             flex items-center justify-center text-2xl">
                  {user.avatar || user.name[0]}
                </div>
                <button
                  type="button"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600
                           rounded-md text-sm font-medium text-gray-700 dark:text-gray-300
                           hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('profile.changePictureButton')}
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100
                         focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100
                         focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark
                         transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? t('profile.updating') : t('profile.saveChanges')}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.language')}
              </label>
              <select
                value={preferences?.language}
                onChange={handleLanguageChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
              >
                {LANGUAGES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.theme')}
              </label>
              <div className="mt-1 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  <span>{t('settings.darkMode')}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences?.darkMode}
                  onClick={handleDarkModeToggle}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
                    border-2 border-transparent transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${preferences?.darkMode ? 'bg-primary' : 'bg-gray-200'}
                  `}
                >
                  <span className="sr-only">{t('settings.darkMode')}</span>
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full
                      bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${preferences?.darkMode ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;