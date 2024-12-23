// src/components/SyncStatus.jsx
import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useShoppingList } from '../contexts/ShoppingContext';
import { useTranslation } from '../hooks/useTranslation';

const SyncStatus = () => {
  const { state } = useShoppingList();
  const { t } = useTranslation();
  const { isConnected, error } = state.syncStatus;

  return (
    <div className="relative">
      <button
        className="p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none
                 focus:ring-2 focus:ring-inset focus:ring-white"
        aria-label={t('messages.syncStatus')}
      >
        {error ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : isConnected ? (
          <Wifi className="h-5 w-5 text-green-500" />
        ) : (
          <WifiOff className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md
                    shadow-lg py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-4 py-2 text-gray-700 dark:text-gray-300">
          {error ? t('messages.error') :
            isConnected ? t('messages.online') : t('messages.offline')}
        </div>
      </div>
    </div>
  );
};

export default SyncStatus;