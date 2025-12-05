export enum RobotState {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  RETURNING = 'RETURNING',
  CHARGING = 'CHARGING',
  ERROR = 'ERROR'
}

export interface SystemStats {
  batteryLevel: number; // 0-100
  storageCapacity: number; // 0-100 percentage full
  dailyShoesOrganized: number;
  totalShoesOrganized: number;
  temperature: number; // Celsius
  connectionStrength: number; // 0-100
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface RobotSettings {
  movementSpeed: number; // 0-100
  armSensitivity: number; // 0-100
  autoSchedule: boolean;
  nightMode: boolean;
  obstacleAvoidance: 'Conservative' | 'Balanced' | 'Aggressive';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
