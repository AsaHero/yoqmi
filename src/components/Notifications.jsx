// src/components/Notifications.jsx
import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationsContext';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const Notifications = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg
            overflow-hidden transform transition-all duration-300 animate-slideIn
          `}
        >
          <div className="p-4 flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              {icons[notification.type] || icons.info}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1">
              {notification.title && (
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {notification.title}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {notification.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500
                       dark:hover:text-gray-300 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;