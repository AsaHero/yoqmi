// src/contexts/UserContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

const ACTIONS = {
    SET_USER: 'SET_USER',
    UPDATE_USER: 'UPDATE_USER',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
};

const initialState = {
    user: null,
    preferences: {
        language: 'en',  // Default language
        darkMode: false, // Default theme
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
        default:
            return state;
    }
}

export function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const { state: authState } = useAuth();

    // Load saved preferences
    useEffect(() => {
      const savedLanguage = localStorage.getItem('preferred-language');
      const savedDarkMode = localStorage.getItem('dark-mode') === 'true';

      if (savedLanguage || savedDarkMode) {
        dispatch({
          type: ACTIONS.SET_USER,
          payload: {
            ...state.user,
            preferences: {
              language: savedLanguage || state.preferences.language,
              darkMode: savedDarkMode
            }
          }
        });
      }
    }, []);

    // Update user when auth state changes
    useEffect(() => {
        if (authState.user) {
            dispatch({ type: ACTIONS.SET_USER, payload: authState.user });
        }
    }, [authState.user]);

    const updateUser = async (updates) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            // TODO: API call to update user
            dispatch({ type: ACTIONS.UPDATE_USER, payload: updates });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: 'Failed to update user information'
            });
        }
    };

    const updatePreferences = async (newPreferences) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });

            // Save to localStorage
            if (newPreferences.language) {
                localStorage.setItem('preferred-language', newPreferences.language);
            }
            if (newPreferences.darkMode !== undefined) {
                localStorage.setItem('dark-mode', newPreferences.darkMode.toString());
            }

            dispatch({
                type: ACTIONS.SET_USER,
                payload: {
                    ...state.user,
                    preferences: { ...state.preferences, ...newPreferences }
                }
            });
        } catch (error) {
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: 'Failed to update preferences'
            });
        }
    };

    return (
        <UserContext.Provider
            value={{
                state,
                updateUser,
                updatePreferences,
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