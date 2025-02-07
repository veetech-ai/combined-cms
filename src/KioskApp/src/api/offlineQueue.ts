type QueuedOperation = {
  id: string;
  type: 'order' | 'feedback';
  data: any;
  timestamp: number;
};

const QUEUE_KEY = 'offline_operation_queue';
const MAX_QUEUE_SIZE = 50;
const MAX_QUEUE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export class OfflineQueue {
  private queue: QueuedOperation[];

  constructor() {
    this.queue = this.loadQueue();
    this.cleanQueue();
  }

  private loadQueue(): QueuedOperation[] {
    try {
      const saved = localStorage.getItem(QUEUE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  private cleanQueue(): void {
    const now = Date.now();
    this.queue = this.queue
      .filter(op => now - op.timestamp < MAX_QUEUE_AGE)
      .slice(-MAX_QUEUE_SIZE);
    this.saveQueue();
  }

  enqueue(type: 'order' | 'feedback', data: any): string {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.queue.push({
      id,
      type,
      data,
      timestamp: Date.now()
    });
    this.saveQueue();
    return id;
  }

  dequeue(id: string): QueuedOperation | undefined {
    const index = this.queue.findIndex(op => op.id === id);
    if (index === -1) return undefined;
    
    const [operation] = this.queue.splice(index, 1);
    this.saveQueue();
    return operation;
  }

  peek(): QueuedOperation | undefined {
    return this.queue[0];
  }

  getAll(): QueuedOperation[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
    this.saveQueue();
  }

  size(): number {
    return this.queue.length;
  }
}