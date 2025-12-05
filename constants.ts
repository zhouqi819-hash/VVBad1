import { RobotState, SystemStats, LogEntry, RobotSettings } from './types';

export const INITIAL_STATS: SystemStats = {
  batteryLevel: 87,
  storageCapacity: 45,
  dailyShoesOrganized: 12,
  totalShoesOrganized: 1403,
  temperature: 32.5,
  connectionStrength: 95,
};

export const INITIAL_SETTINGS: RobotSettings = {
  movementSpeed: 60,
  armSensitivity: 75,
  autoSchedule: true,
  nightMode: true,
  obstacleAvoidance: 'Balanced',
};

export const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '10:42:15', level: 'INFO', message: '系统初始化完成' },
  { id: '2', timestamp: '10:42:18', level: 'SUCCESS', message: '已连接至家庭网关 (Mesh)' },
  { id: '3', timestamp: '10:45:00', level: 'INFO', message: '巡逻开始: 客厅 A 区' },
  { id: '4', timestamp: '10:45:30', level: 'SUCCESS', message: '物体识别: 运动鞋 (Nike Air)' },
  { id: '5', timestamp: '10:46:12', level: 'SUCCESS', message: '归置操作执行成功' },
  { id: '6', timestamp: '11:00:00', level: 'INFO', message: '电量低，正在返回充电桩' },
];