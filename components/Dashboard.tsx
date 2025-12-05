import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity, Battery, Thermometer, Wifi } from 'lucide-react';
import { Card } from './Card';
import { SystemStats, RobotState } from '../types';

interface DashboardProps {
  stats: SystemStats;
  state: RobotState;
}

const data = [
  { name: '周一', shoes: 8 },
  { name: '周二', shoes: 12 },
  { name: '周三', shoes: 5 },
  { name: '周四', shoes: 15 },
  { name: '周五', shoes: 20 },
  { name: '周六', shoes: 32 },
  { name: '周日', shoes: 28 },
];

const stateMap: Record<string, string> = {
  'IDLE': '待机中',
  'WORKING': '工作中',
  'RETURNING': '回充中',
  'CHARGING': '充电中',
  'ERROR': '系统故障'
};

export const Dashboard: React.FC<DashboardProps> = ({ stats, state }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 animate-in fade-in duration-500">
      {/* Key Metrics Row */}
      <Card className="col-span-1 border-l-4 border-l-cyan-500">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">系统状态 (STATUS)</p>
                <h2 className={`text-2xl font-bold mt-1 tracking-wide ${state === RobotState.ERROR ? 'text-red-500' : 'text-white'}`}>
                    {stateMap[state] || state}
                </h2>
            </div>
            <Activity className={`w-8 h-8 ${state === RobotState.WORKING ? 'text-green-400 animate-pulse' : 'text-slate-600'}`} />
        </div>
      </Card>

      <Card className="col-span-1">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">电池电量 (BATTERY)</p>
                <div className="flex items-end gap-2 mt-1">
                    <h2 className="text-2xl font-bold text-white">{stats.batteryLevel}%</h2>
                    <span className="text-xs text-slate-500 mb-1">剩余约 4小时</span>
                </div>
            </div>
            <Battery className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden relative">
             <div className="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
            <div className="bg-cyan-400 h-full transition-all duration-1000 relative z-10" style={{ width: `${stats.batteryLevel}%` }}></div>
        </div>
      </Card>

      <Card className="col-span-1">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">内部温度 (TEMP)</p>
                <h2 className="text-2xl font-bold text-white mt-1">{stats.temperature.toFixed(1)}°C</h2>
            </div>
            <Thermometer className="w-8 h-8 text-orange-400" />
        </div>
      </Card>
      
      <Card className="col-span-1">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">信号强度 (SIGNAL)</p>
                <h2 className="text-2xl font-bold text-white mt-1">{stats.connectionStrength}%</h2>
            </div>
            <Wifi className="w-8 h-8 text-purple-400" />
        </div>
      </Card>

      {/* Main Charts Area */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 h-80" title="周优化性能统计">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px', color: '#fff' }}
                itemStyle={{ color: '#22d3ee' }}
                cursor={{ fill: '#1e293b', opacity: 0.5 }}
            />
            <Bar dataKey="shoes" fill="#06b6d4" radius={[4, 4, 0, 0]} name="整理数量" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1 h-80" title="鞋柜容量监控">
        <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-40 h-40">
                 {/* Rotating outer ring */}
                 <div className="absolute inset-0 rounded-full border border-slate-700 border-dashed animate-spin-slow opacity-50"></div>
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                        className="text-slate-800"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        strokeDasharray={`${stats.storageCapacity}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{stats.storageCapacity}%</span>
                    <span className="text-xs text-slate-400 font-mono">已占用</span>
                </div>
            </div>
            <div className="mt-6 w-full space-y-3 px-4">
                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                    <span className="text-slate-400">历史累计整理</span>
                    <span className="text-white font-mono">{stats.totalShoesOrganized}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">今日新增</span>
                    <span className="text-cyan-400 font-mono">+{stats.dailyShoesOrganized}</span>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};