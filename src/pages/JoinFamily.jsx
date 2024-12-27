import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { authService } from '../services/authService';
import AvatarUpload from '../components/auth/AvatarUpload';
import { Eye, EyeOff, Loader } from 'lucide-react';

const JoinFamily = () => {
  const { inviteCode } = useParams();
  const { t } = useTranslation();
  const { joinFamily, user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null,
    inviteCode
  });

  const [familyInfo, setFamilyInfo] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [joinCompleted, setJoinCompleted] = useState(false);

  // Validate invite code on mount
  useEffect(() => {
    const validateInvite = async () => {
      // Skip validation if join was completed
      if (joinCompleted) return;

      try {
        const info = await authService.validateInvite(formData.inviteCode);
        setFamilyInfo(info);

        // If user is already in the family, redirect
        if (info.userInFamily) {
          addNotification({
            type: 'info',
            message: t('auth.alreadyInFamily')
          });
          navigate('/');
          return;
        }

        // If user is authenticated, try to join immediately
        if (user) {
          handleJoinSubmit();
        }
      } catch (error) {
        addNotification({
          type: 'error',
          message: t('auth.invalidInvite')
        });
        navigate('/signup');
      } finally {
        setIsValidating(false);
      }
    };
    validateInvite();
  }, [inviteCode, user, navigate, addNotification, t]);

  const validateForm = () => {
    if (user) return true; // No validation needed for existing users

    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    if (!formData.password) {
      newErrors.password = t('validation.required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('validation.passwordMin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJoinSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) return;
    console.log(inviteCode);

    setIsLoading(true);
    try {
      await joinFamily({
        inviteCode,
        ...(!user && {
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      // Set the join completed flag before navigation
      setJoinCompleted(true);

      addNotification({
        type: 'success',
        message: t('auth.joinSuccess')
      });
      navigate('/');
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, show simplified view
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('auth.joinFamily')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('auth.joiningAs', { name: user.name })}
            </p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {t('auth.joiningFamily', { name: familyInfo?.familyName })}
            </p>
          </div>

          <button
            onClick={handleJoinSubmit}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                     shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              t('auth.confirmJoin')
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          {t('auth.joinFamily')}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.joiningFamily', { name: familyInfo?.familyName })}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleJoinSubmit} className="space-y-6">
            <div className="flex justify-center">
              <AvatarUpload
                value={formData.avatar}
                onChange={(file) => setFormData({ ...formData, avatar: file })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-1 block w-full rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-1 block w-full rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.password')}
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`block w-full rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                       shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                t('auth.joinFamily')
              )}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-primary hover:text-primary-dark"
              >
                {t('auth.login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinFamily;
