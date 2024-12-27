// src/contexts/UserContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { useNotifications } from './NotificationsContext';

const UserContext = createContext(null);

const ACTIONS = {
    SET_USER: 'SET_USER',
    UPDATE_USER: 'UPDATE_USER',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
};

const initialState = {
    user: null,
    preferences: {
        language: navigator.language.split('-')[0] || 'en',
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
    },
    isLoading: false,
    error: null,
};

function userReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                error: null,
            };
        case ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
                isLoading: false,
                error: null,
            };
        case ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                error: null,
            };
        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case ACTIONS.UPDATE_PREFERENCES:
            return {
                ...state,
                preferences: { ...state.preferences, ...action.payload },
                isLoading: false,
                error: null,
            };
        default:
            return state;
    }
}

export function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const { state: authState } = useAuth();
    const { addNotification } = useNotifications();

    // Load user profile when auth state changes
    useEffect(() => {
        const loadUserProfile = async () => {
            if (authState.user && !state.user) {
                try {
                    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                    const profile = await userService.getProfile();
                    dispatch({ type: ACTIONS.SET_USER, payload: profile });
                } catch (error) {
                    dispatch({
                        type: ACTIONS.SET_ERROR,
                        payload: error.message || 'Failed to load user profile'
                    });
                    addNotification({
                        type: 'error',
                        message: error.message || 'Failed to load user profile'
                    });
                }
            }
        };

        loadUserProfile();
    }, [authState.user]);

    // Load saved preferences from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferred-language');
        const savedDarkMode = localStorage.getItem('dark-mode') === 'true';

        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        console.log(savedDarkMode, savedLanguage)
        if (savedLanguage || savedDarkMode !== null) {
            dispatch({
                type: ACTIONS.UPDATE_PREFERENCES,
                payload: {
                    language: savedLanguage || state.preferences.language,
                    darkMode: savedDarkMode
                }
            });
        }
    }, []);

    const updateUser = async (updates) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const updatedUser = await userService.updateProfile(updates);
            dispatch({ type: ACTIONS.UPDATE_USER, payload: updatedUser });
            addNotification({
                type: 'success',
                message: 'Profile updated successfully'
            });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to update user information'
            });
            addNotification({
                type: 'error',
                message: error.message || 'Failed to update user information'
            });
        }
    };

    const updatePreferences = async (newPreferences) => {
        try {
            // Then update localStorage and apply changes
            if (newPreferences.language) {
                localStorage.setItem('preferred-language', newPreferences.language);
            }

            if (newPreferences.darkMode !== undefined) {
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('dark-mode', newPreferences.darkMode.toString());
            }

            dispatch({
                type: ACTIONS.UPDATE_PREFERENCES,
                payload: newPreferences
            });

            console.log(newPreferences);

            addNotification({
                type: 'success',
                message: 'Preferences updated successfully'
            });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to update preferences'
            });
            addNotification({
                type: 'error',
                message: error.message || 'Failed to update preferences'
            });
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            await userService.changePassword(currentPassword, newPassword);
            addNotification({
                type: 'success',
                message: 'Password changed successfully'
            });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to change password'
            });
            addNotification({
                type: 'error',
                message: error.message || 'Failed to change password'
            });
        }
    };

    const deleteAccount = async (password) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            await userService.deleteAccount(password);
            addNotification({
                type: 'success',
                message: 'Account deleted successfully'
            });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to delete account'
            });
            addNotification({
                type: 'error',
                message: error.message || 'Failed to delete account'
            });
        }
    };

    return (
        <UserContext.Provider
            value={{
                state,
                updateUser,
                updatePreferences,
                changePassword,
                deleteAccount
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}