// src/components/layout/Header.jsx
import React from 'react';
import { Menu } from 'lucide-react';
import SyncStatus from '../SyncStatus';
import { useShoppingList } from '../../contexts/ShoppingContext';
import { useTranslation } from '../../hooks/useTranslation';

const Header = ({ onMenuClick }) => {
  const { state } = useShoppingList();
  const { t } = useTranslation();
  const { isConnected } = state.syncStatus;

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-white hover:bg-primary-dark
                     focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label={t('navigation.menu')}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Center: Title */}
          <h1 className="text-xl font-semibold text-white flex-1 text-center">
          {t('shopping.title')}
            {!isConnected && (
              <span className="ml-2 text-sm text-white/70">(Offline)</span>
            )}
          </h1>

          {/* Right: Sync Status */}
          <SyncStatus />
        </div>
      </div>
    </header>
  );
};

export default Header;