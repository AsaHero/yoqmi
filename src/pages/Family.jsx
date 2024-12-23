// src/pages/Family.jsx
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useFamily } from '../contexts/FamilyContext';
import MembersList from '../components/family/MembersList';
import InviteSection from '../components/family/InviteSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Family = () => {
  const { t } = useTranslation();
  const { state, retry } = useFamily();
  const { isLoading, error, members } = state;

  if (isLoading && !members.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={retry}
            className="mt-2 text-red-600 dark:text-red-400 underline hover:no-underline"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        {t('family.title')}
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <MembersList />
        </div>

        <div className="md:col-span-2">
          <InviteSection />
        </div>
      </div>
    </div>
  );
};

export default Family;