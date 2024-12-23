// src/services/websocket.js
class WebSocketService {
    constructor() {
      this.ws = null;
      this.retryCount = 0;
      this.maxRetries = 5;
      this.retryTimeout = null;
      this.handlers = new Map();
      this.isConnected = false;
    }

    connect(userId) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//localhost:8080/ws?user_id=${userId}`;

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    }

    setupEventHandlers() {
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.retryCount = 0;
        this.notifyHandlers('connectionChange', true);

        // Request initial sync
        this.send({
          type: 'SYNC_REQUEST',
          timestamp: Date.now()
        });
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.notifyHandlers('connectionChange', false);
        this.retryConnection();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyHandlers('error', error);
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

    retryConnection() {
      if (this.retryCount < this.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 10000);
        this.retryTimeout = setTimeout(() => {
          this.retryCount++;
          this.connect();
        }, delay);
      } else {
        this.notifyHandlers('maxRetriesReached');
      }
    }

    send(message) {
      if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
        return true;
      }
      return false;
    }

    handleMessage(message) {
      switch (message.type) {
        case 'SYNC_UPDATE':
          this.notifyHandlers('syncUpdate', message.data);
          break;
        case 'ITEM_ADDED':
          this.notifyHandlers('itemAdded', message.data);
          break;
        case 'ITEM_UPDATED':
          this.notifyHandlers('itemUpdated', message.data);
          break;
        case 'ITEM_DELETED':
          this.notifyHandlers('itemDeleted', message.data);
          break;
        case 'ERROR':
          this.notifyHandlers('error', message.data);
          break;
        default:
          console.warn('Unknown message type:', message.type);
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