// src/hooks/useWebSocket.js
import { useState, useEffect } from 'react';
import { wsService } from '../services/websocket';

export function useWebSocket(userId) {
  const [isConnected, setIsConnected] = useState(false);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    // Setup WebSocket handlers
    const handleConnectionChange = (connected) => {
      setIsConnected(connected);
      if (connected) {
        setSyncError(null);
      }
    };

    const handleError = (error) => {
      setSyncError(error.message || 'Connection error occurred');
    };

    const handleMaxRetries = () => {
      setSyncError('Unable to connect after maximum retries');
    };

    // Add handlers
    wsService.addHandler('connectionChange', handleConnectionChange);
    wsService.addHandler('error', handleError);
    wsService.addHandler('maxRetriesReached', handleMaxRetries);

    // Connect to WebSocket
    wsService.connect(userId);

    // Cleanup
    return () => {
      wsService.removeHandler('connectionChange', handleConnectionChange);
      wsService.removeHandler('error', handleError);
      wsService.removeHandler('maxRetriesReached', handleMaxRetries);
      wsService.disconnect();
    };
  }, [userId]);

  return {
    isConnected,
    syncError,
    sendMessage: wsService.send.bind(wsService)
  };
}