// src/components/family/InviteSection.jsx
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useFamily } from '../../contexts/FamilyContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import QRCode from './QRCode';
import LoadingSpinner from '../ui/LoadingSpinner';

const InviteSection = () => {
  const { t } = useTranslation();
  const { createInvite } = useFamily();
  const { addNotification } = useNotifications();
  const [inviteData, setInviteData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInvite = async () => {
    try {
      setIsGenerating(true);
      const invite = await createInvite();
      setInviteData(invite);
      addNotification({
        type: 'success',
        message: t('family.inviteGenerated')
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: t('family.errorGeneratingInvite')
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshLink = () => {
    handleGenerateInvite();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {t('family.invite')}
        </h3>
        {inviteData && (
          <button
            onClick={handleRefreshLink}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title={t('family.refreshLink')}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <LoadingSpinner size="small" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        {!inviteData && !isGenerating && (
          <button
            onClick={handleGenerateInvite}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark
                     transition-colors"
          >
            {t('family.generateInvite')}
          </button>
        )}

        {isGenerating && (
          <div className="py-12">
            <LoadingSpinner size="large" />
          </div>
        )}

        {inviteData && !isGenerating && (
          <>
            <QRCode value={inviteData.inviteUrl} />

            <div className="mt-6 w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                {t('family.inviteDescription')}
              </p>
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <code className="flex-1 text-sm text-gray-600 dark:text-gray-300 break-all">
                  {inviteData.inviteUrl}
                </code>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('family.inviteExpires', {
                  time: new Date(inviteData.expiresAt).toLocaleString()
                })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteSection;