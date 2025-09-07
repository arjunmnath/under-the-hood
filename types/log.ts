export type RawLogLevel =
  | "SHOUT"
  | "SEVERE"
  | "WARNING"
  | "INFO"
  | "CONFIG"
  | "FINE"
  | "FINER"
  | "FINEST"
  | "shout"
  | "severe"
  | "warning"
  | "info"
  | "config"
  | "fine"
  | "finer"
  | "finest";

export type NormalizedLogLevel = "info" | "warning" | "error" | "debug";

export interface LogEntry {
  id: string;
  userid: string;
  application: string;
  timestamp: string;
  logger: string;
  level: NormalizedLogLevel;
  originalLevel: RawLogLevel; 
  value: number;
  message: string;
  metadata?: Record<string, any>;
}

export interface CreateLogRequest {
  userid: string;
  application: string;
  timestamp: string;
  logger: string;
  level: RawLogLevel; 
  value: number;
  message: string;
  metadata?: Record<string, any>;
}
