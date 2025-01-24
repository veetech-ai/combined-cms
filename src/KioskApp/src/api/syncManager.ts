import { OfflineQueue } from './offlineQueue';
import { networkStatus } from './networkStatus';
import { withRetry } from './errorHandler';
import { toast } from 'react-hot-toast';

class SyncManager {
  private queue: OfflineQueue;
  private isSyncing: boolean = false;
  private syncInterval: number | null = null;

  constructor() {
    this.queue = new OfflineQueue();
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    networkStatus.addListener((online) => {
      if (online && this.queue.size() > 0) {
        this.startSync();
      }
    });
  }

  async startSync() {
    if (this.isSyncing || !networkStatus.isOnline) return;

    this.isSyncing = true;
    let syncedCount = 0;
    let failedCount = 0;

    try {
      while (this.queue.size() > 0 && networkStatus.isOnline) {
        const operation = this.queue.peek();
        if (!operation) break;

        try {
          await this.processOperation(operation);
          this.queue.dequeue(operation.id);
          syncedCount++;
        } catch (error) {
          console.error(`Failed to sync operation ${operation.id}:`, error);
          failedCount++;
          if (failedCount >= 3) break;
        }
      }
    } finally {
      this.isSyncing = false;
      if (syncedCount > 0) {
        toast.success(`Synced ${syncedCount} offline ${syncedCount === 1 ? 'operation' : 'operations'}`);
      }
    }
  }

  private async processOperation(operation: any) {
    switch (operation.type) {
      case 'order':
        return await withRetry(() => this.syncOrder(operation.data));
      case 'feedback':
        return await withRetry(() => this.syncFeedback(operation.data));
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  private async syncOrder(orderData: any) {
    // Implementation will be added when we implement the order API
    console.log('Syncing order:', orderData);
  }

  private async syncFeedback(feedbackData: any) {
    // Implementation will be added when we implement the feedback API
    console.log('Syncing feedback:', feedbackData);
  }

  enqueueOperation(type: 'order' | 'feedback', data: any): string {
    const id = this.queue.enqueue(type, data);
    if (networkStatus.isOnline) {
      this.startSync();
    } else {
      toast.success('Order saved offline. Will sync when connection is restored.');
    }
    return id;
  }

  getQueueSize(): number {
    return this.queue.size();
  }

  getPendingOperations() {
    return this.queue.getAll();
  }
}

export const syncManager = new SyncManager();