type AlertCallback = (data: any) => void;

class SignalRService {
  private listeners: Map<string, Set<AlertCallback>> = new Map();
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.initListeners();
  }

  private initListeners() {
    this.listeners.set('EmergencyAlert', new Set());
    this.listeners.set('StockAlert', new Set());
    this.listeners.set('BiobankAlert', new Set());
    this.listeners.set('PGxAlert', new Set());
  }

  public on(event: 'EmergencyAlert' | 'StockAlert' | 'BiobankAlert' | 'PGxAlert', callback: AlertCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: AlertCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  public emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[SignalR] Callback error on event ${event}:`, err);
      }
    });
  }

  public connect(url: string = 'http://localhost:5005/hubs/hospital') {
    // Graceful fallback for local development
    console.log(`[SignalR] Initialisation du listener temps réel sur ${url}`);
    this.isConnected = true;
  }

  public simulateAlert(type: 'EmergencyAlert' | 'StockAlert' | 'BiobankAlert' | 'PGxAlert', payload: any) {
    this.emit(type, payload);
  }
}

export const signalRService = new SignalRService();
export default signalRService;
