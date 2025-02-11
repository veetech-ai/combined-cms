import { useEffect, useCallback } from 'react';
import { websocketService } from '../api/websocket';
import { networkStatus } from '../api/networkStatus';
import { toast } from 'react-hot-toast';

export function useWebSocket(url: string) {
  const connectWithFallback = useCallback(() => {
    if (!url) {
      // Silently skip if no URL is configured
      return;
    }

    try {
      websocketService.connect(url);
    } catch (error) {
      // Silently fall back to polling
    }
  }, [url]);

  useEffect(() => {
    // Only attempt WebSocket connection if we're online and have a URL
    if (networkStatus.isOnline && url) {
      connectWithFallback();
    }

    // Reconnect when network status changes
    const cleanup = networkStatus.addListener((online) => {
      if (online) {
        connectWithFallback();
      }
    });

    return () => {
      cleanup();
      websocketService.disconnect();
    };
  }, [url, connectWithFallback]);

  return websocketService;
}
