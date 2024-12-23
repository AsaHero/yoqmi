// src/components/family/MembersList.jsx
import React, { useState } from 'react';
import { Crown, MoreVertical, Trash2, Shield } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useFamily } from '../../contexts/FamilyContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ROLES = ['admin', 'moderator', 'member'];

const MembersList = () => {
  const { t } = useTranslation();
  const { state, removeMember, updateMemberRole } = useFamily();
  const { addNotification } = useNotifications();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Safely access members with default empty array
  const members = state?.members || [];

  const getMemberInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" title={t('family.roles.admin')} />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" title={t('family.roles.moderator')} />;
      default:
        return null;
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(memberId);
      addNotification({
        type: 'success',
        message: t('family.memberRemoved')
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: t('family.errorRemovingMember')
      });
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      addNotification({
        type: 'success',
        message: t('family.roleUpdated')
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: t('family.errorUpdatingRole')
      });
    }
    setActiveDropdown(null);
  };

  if (state?.isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {t('family.membersList')}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('family.memberCount', { count: members.length })}
        </p>
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{state.error}</p>
        </div>
      )}

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member) => (
          <li
            key={member.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {getMemberInitials(member.user.name)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {member.user.name}
                    </span>
                    {getRoleIcon(member.role)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {member.role !== 'admin' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t('family.removeMember')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                             rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {activeDropdown === member.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md
                                  shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      {ROLES.map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(member.id, role)}
                          className={`block w-full text-left px-4 py-2 text-sm
                            ${role === member.role
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            {getRoleIcon(role)}
                            {t(`family.roles.${role}`)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}

        {members.length === 0 && !state?.isLoading && (
          <li className="p-8 text-center text-gray-500 dark:text-gray-400">
            {t('family.noMembers')}
          </li>
        )}
      </ul>
    </div>
  );
};

export default MembersList;