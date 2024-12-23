// src/components/layout/AppLayout.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { Home, Settings, Users, LogOut } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useUser } from '../../contexts/UserContext';

const AppLayout = ({ children }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { state: { user } } = useUser();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: t('navigation.home'), path: '/' },
    { icon: <Settings className="w-5 h-5" />, label: t('navigation.settings'), path: '/settings' },
    { icon: <Users className="w-5 h-5" />, label: t('navigation.familyMembers'), path: '/family' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsSideMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header onMenuClick={() => setIsSideMenuOpen(true)} />

      {/* Side Menu Overlay */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsSideMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div className={`
        fixed top-0 left-0 w-64 h-full bg-white dark:bg-surface-dark
        transform transition-transform duration-300 ease-in-out z-50
        ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* User Info */}
        <div className="bg-primary p-6 text-white">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="text-center font-semibold">John Doe</h2>
          <p className="text-center text-sm opacity-80">john@example.com</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                ${location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
                rounded-lg transition-colors
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Sign Out Button */}
          <button
            onClick={() => {/* Handle sign out */}}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('navigation.signOut')}</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;