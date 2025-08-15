export interface LogEntry {
  id: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  userId: string;
  timestamp: any; // Firestore timestamp
  metadata?: Record<string, any>;
}

export interface CreateLogRequest {
  message: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  userId: string;
  metadata?: Record<string, any>;
}