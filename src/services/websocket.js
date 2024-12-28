// src/services/websocket.js
import { authService } from './authService';
import { Config } from './config';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryTimeout = null;
    this.handlers = new Map();
    this.isConnected = false;
  }

  connect() {
    try {
      const token = authService.getToken();
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${Config.DOMAIN}/api/ws?access_token=${token}`;

      // Create WebSocket connection with token in the protocol header
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.retryCount = 0;
      this.notifyHandlers('connectionChange', true);

      // Request initial sync using server's message type
      this.send({
        type: 'SYNC_REQUEST'
      });
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.notifyHandlers('connectionChange', false);
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifyHandlers('error', { message: 'Connection error occurred' });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  handleMessage(message) {
    // Map server message types to client handlers
    switch (message.type) {
      case 'SYNC_UPDATE':
        this.notifyHandlers('syncUpdate', message.data);
        break;
      case 'CREATE_ITEM':
        this.notifyHandlers('itemAdded', message.data);
        break;
      case 'UPDATE_ITEM':
        this.notifyHandlers('itemUpdated', message.data);
        break;
      case 'DELETE_ITEM':
        this.notifyHandlers('itemDeleted', message.data?.id);
        break;
      case 'ERROR':
        this.notifyHandlers('error', message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  // Send messages using server's expected format
  sendCreateItem(item) {
    return this.send({
      type: 'CREATE_ITEM',
      data: {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || 'pcs',
        priority: item.priority || 'medium',
        notes: item.notes || ''
      }
    });
  }

  sendUpdateItem(item) {
    return this.send({
      type: 'UPDATE_ITEM',
      data: {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        priority: item.priority,
        notes: item.notes,
        checked: item.checked
      }
    });
  }

  sendDeleteItem(itemId) {
    return this.send({
      type: 'DELETE_ITEM',
      data: {
        id: itemId
      }
    });
  }

  send(message) {
    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  addHandler(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(handler);
  }

  removeHandler(event, handler) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  notifyHandlers(event, data) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }
}

export const wsService = new WebSocketService();