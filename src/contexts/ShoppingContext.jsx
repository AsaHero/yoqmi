// src/contexts/ShoppingContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { wsService } from '../services/websocket';

const ShoppingContext = createContext(null);

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  TOGGLE_ITEM: 'TOGGLE_ITEM',
  SET_SYNC_STATUS: 'SET_SYNC_STATUS',
};

const initialState = {
  items: [],
  isLoading: true,
  error: null,
  syncStatus: {
    isConnected: false,
    error: null,
  },
};


function shoppingReducer(state, action) {
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
    case ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
      };
    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
        isLoading: false,
        error: null,
      };
    case ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        isLoading: false,
        error: null,
      };
    case ACTIONS.DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case ACTIONS.TOGGLE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, checked: !item.checked }
            : item
        ),
      };
    case ACTIONS.SET_SYNC_STATUS:
      return {
        ...state,
        syncStatus: {
          ...state.syncStatus,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export function ShoppingProvider({ children }) {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  // Setup WebSocket handlers
  useEffect(() => {
    const handleConnectionChange = (isConnected) => {
      dispatch({
        type: ACTIONS.SET_SYNC_STATUS,
        payload: { isConnected, error: null },
      });
    };

    const handleSyncUpdate = (items) => {
      dispatch({ type: ACTIONS.SET_ITEMS, payload: items });
    };

    const handleItemAdded = (item) => {
      if (!state.items.find(i => i.id === item.id)) {
        dispatch({ type: ACTIONS.ADD_ITEM, payload: item });
      }
    };

    const handleItemUpdated = (item) => {
      dispatch({ type: ACTIONS.UPDATE_ITEM, payload: item });
    };

    const handleItemDeleted = (itemId) => {
      dispatch({ type: ACTIONS.DELETE_ITEM, payload: itemId });
    };

    const handleError = (error) => {
      dispatch({
        type: ACTIONS.SET_SYNC_STATUS,
        payload: { error: error.message || 'Sync error occurred' },
      });
    };

    wsService.addHandler('connectionChange', handleConnectionChange);
    wsService.addHandler('syncUpdate', handleSyncUpdate);
    wsService.addHandler('itemAdded', handleItemAdded);
    wsService.addHandler('itemUpdated', handleItemUpdated);
    wsService.addHandler('itemDeleted', handleItemDeleted);
    wsService.addHandler('error', handleError);

    // Connect with a temporary user ID (in real app, use actual user ID)
    wsService.connect('temp-user-id');

    return () => {
      wsService.removeHandler('connectionChange', handleConnectionChange);
      wsService.removeHandler('syncUpdate', handleSyncUpdate);
      wsService.removeHandler('itemAdded', handleItemAdded);
      wsService.removeHandler('itemUpdated', handleItemUpdated);
      wsService.removeHandler('itemDeleted', handleItemDeleted);
      wsService.removeHandler('error', handleError);
    };
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (!state.isLoading && !state.error) {
      localStorage.setItem('shopping-items', JSON.stringify(state.items));
    }
  }, [state.items]);

  const actions = {
    addItem: async (item) => {
      try {
        const newItem = {
          ...item,
          id: Date.now().toString(),
          checked: false,
          createdAt: new Date().toISOString(),
        };

        dispatch({ type: ACTIONS.ADD_ITEM, payload: newItem });

        // Sync with other clients
        wsService.send({
          type: 'ITEM_ADDED',
          data: newItem,
        });

        return newItem;
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: 'Failed to add item',
        });
        throw error;
      }
    },

    updateItem: async (item) => {
      try {
        const updatedItem = {
          ...item,
          updatedAt: new Date().toISOString(),
        };

        dispatch({ type: ACTIONS.UPDATE_ITEM, payload: updatedItem });

        // Sync with other clients
        wsService.send({
          type: 'ITEM_UPDATED',
          data: updatedItem,
        });

        return updatedItem;
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: 'Failed to update item',
        });
        throw error;
      }
    },

    deleteItem: async (id) => {
      try {
        dispatch({ type: ACTIONS.DELETE_ITEM, payload: id });

        // Sync with other clients
        wsService.send({
          type: 'ITEM_DELETED',
          data: id,
        });
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: 'Failed to delete item',
        });
        throw error;
      }
    },

    toggleItem: async (id) => {
      try {
        const item = state.items.find(i => i.id === id);
        if (item) {
          const updatedItem = { ...item, checked: !item.checked };
          dispatch({ type: ACTIONS.UPDATE_ITEM, payload: updatedItem });

          // Sync with other clients
          wsService.send({
            type: 'ITEM_UPDATED',
            data: updatedItem,
          });
        }
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: 'Failed to toggle item',
        });
        throw error;
      }
    },
  };

  return (
    <ShoppingContext.Provider value={{ state, actions }}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingProvider');
  }
  return context;
}