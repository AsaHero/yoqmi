// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER'
};

const initialState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
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
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        isLoading: false,
        error: null,
      };
    case ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await userService.getProfile();
      dispatch({ type: ACTIONS.SET_USER, payload: user });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await authService.login(credentials);
      dispatch({ type: ACTIONS.SET_USER, payload: response.user });
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await authService.signup(data);
      dispatch({ type: ACTIONS.SET_USER, payload: response.user });
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const joinFamily = async (data) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      console.log(data);

      const response = await authService.joinFamily({
        invite_code: data.inviteCode,
        ...(state.user ? { user_id: state.user.id } : {
          name: data.name,
          email: data.email,
          password: data.password
        })
      });

      if (response.user) {
        // New user case - set full user data and auth state
        dispatch({ type: ACTIONS.SET_USER, payload: response.user });
      } else {
        // Existing user case - update families/members lists
        dispatch({
          type: ACTIONS.UPDATE_USER,
          payload: {
            families: [...(state.user?.families || []), response.familyId],
            members: [...(state.user?.members || []), response.memberId]
          }
        });
      }

      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: ACTIONS.LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        signup,
        joinFamily,
        logout,
        login,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}