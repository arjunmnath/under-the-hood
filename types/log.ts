export interface LogEntry {
  id: string;
  userid: string;
  application: string;
  timestamp: string;
  logger: string;
  level: "warning" | "info" | "debug" | "info";
  log_value: number;
  message: string;
  metadata?: Record<string, any>;
}

export interface CreateLogRequest {
  id: string;
  userid: string;
  application: string;
  timestamp: string;
  logger: string;
  level: "warning" | "info" | "debug" | "info";
  log_value: number;
  message: string;
  metadata?: Record<string, any>;
}
