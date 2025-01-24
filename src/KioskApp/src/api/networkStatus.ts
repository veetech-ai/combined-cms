type NetworkStatusListener = (online: boolean) => void;

class NetworkStatusManager {
  private listeners: Set<NetworkStatusListener> = new Set();
  private _isOnline: boolean = navigator.onLine;

  constructor() {
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
  }

  private updateStatus(online: boolean) {
    this._isOnline = online;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this._isOnline));
  }

  addListener(listener: NetworkStatusListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  removeListener(listener: NetworkStatusListener) {
    this.listeners.delete(listener);
  }

  get isOnline(): boolean {
    return this._isOnline;
  }
}

export const networkStatus = new NetworkStatusManager();