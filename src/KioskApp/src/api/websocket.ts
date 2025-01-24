import { toast } from 'react-hot-toast';
import { useMenuStore } from '../stores/menuStore';

type WebSocketMessage = {
  type: 'menu_update' | 'order_status' | 'availability_update';
  data: any;
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: number | null = null;
  private enabled = false;

  connect(url: string) {
    // Skip connection if WebSocket is not needed
    if (!url || !this.enabled) {
      return;
    }

    try {
      this.ws = new WebSocket(url);
      this.ws.onerror = (error) => {
        // Initial connection error, silently fail
        this.ws = null;
      };

      this.setupEventHandlers();
      this.startHeartbeat();
    } catch (error) {
      this.ws = null;
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;
    
    // Remove the initial error handler
    this.ws.onerror = null;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      this.handleReconnect();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        // Silently handle parse errors
      }
    };
  }

  private handleMessage(message: WebSocketMessage) {
    const menuStore = useMenuStore.getState();

    switch (message.type) {
      case 'menu_update':
        menuStore.loadMenuItems();
        break;
      
      case 'availability_update':
        const { itemId, locationId, isAvailable } = message.data;
        menuStore.checkAvailability(itemId, locationId);
        break;
      
      case 'order_status':
        // Will be implemented when we add order tracking
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect() {
    this.stopHeartbeat();
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        if (this.ws?.url) {
          this.connect(this.ws.url);
        }
      }, delay);
    } else {
      this.ws = null;
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Silently fail if WebSocket is not connected
    }
  }
  // Enable/disable WebSocket functionality
  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.disconnect();
  }
}

export const websocketService = new WebSocketService();