import React, { useState, useMemo, useEffect } from 'react';
import { Crown, MoreVertical, Trash2, Shield } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useFamily } from '../../contexts/FamilyContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ROLES = ['admin', 'moderator', 'member'];

const MembersList = () => {
  const { t } = useTranslation();
  const { state, removeMember, updateMemberRole } = useFamily();
  const { addNotification } = useNotifications();
  const currentUser = useUser().state.user;
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);


  // Safely access members with default empty array
  const members = state?.members || [];

  // Sort members with current user first
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if (a.user.id === currentUser.id) return -1;
      if (b.user.id === currentUser.id) return 1;
      return 0;
    });
  }, [members, currentUser.id]);

  const getMemberInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'moderator':
        return <Crown className="w-4 h-4 text-yellow-500" title={t('family.roles.moderator')} />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" title={t('family.roles.admin')} />;
      default:
        return null;
    }
  };

  // Check if current user can delete a member
  const canDeleteMember = (memberRole) => {
    const currentUserRole = members.find(m => m.user.id === currentUser.id)?.role;

    if (currentUserRole === 'moderator') {
      return true; // Moderators can delete anyone
    }

    if (currentUserRole === 'admin') {
      return memberRole !== 'moderator'; // Admins can't delete moderators
    }

    return false; // Members can't delete anyone
  };

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    const currentUserRole = members.find(m => m.user.id === currentUser.id)?.role;

    switch (currentUserRole) {
      case 'moderator':
        return ROLES; // Moderators can assign any role
      case 'admin':
        return ['admin', 'member']; // Admins can't assign moderator role
      default:
        return []; // Members can't assign roles
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

  const availableRoles = getAvailableRoles();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-visible">
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
        {sortedMembers.map((member) => (
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
                {canDeleteMember(member.role) && member.user.id !== currentUser.id && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t('family.removeMember')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                {availableRoles.length > 0 && member.user.id !== currentUser.id && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                               rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {activeDropdown === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md
                                    shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700 overflow-visible">
                        {availableRoles.map((role) => (
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
                )}
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