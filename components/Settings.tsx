import React from 'react';
import { Card } from './Card';
import { RobotSettings } from '../types';

interface SettingsProps {
  settings: RobotSettings;
  updateSetting: (key: keyof RobotSettings, value: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSetting }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Card title="运动参数设置 (MOTION)">
        <div className="space-y-8 p-2">
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">最大移动速度</label>
                    <span className="text-cyan-400 font-mono bg-cyan-900/30 px-2 py-1 rounded">{settings.movementSpeed}%</span>
                </div>
                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                        <div style={{ width: `${settings.movementSpeed}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-300"></div>
                    </div>
                    <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={settings.movementSpeed}
                        onChange={(e) => updateSetting('movementSpeed', parseInt(e.target.value))}
                        className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                    />
                </div>
            </div>
            
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">伸缩臂灵敏度</label>
                    <span className="text-cyan-400 font-mono bg-cyan-900/30 px-2 py-1 rounded">{settings.armSensitivity}%</span>
                </div>
                <div className="relative pt-1">
                     <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                        <div style={{ width: `${settings.armSensitivity}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 transition-all duration-300"></div>
                    </div>
                    <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={settings.armSensitivity}
                        onChange={(e) => updateSetting('armSensitivity', parseInt(e.target.value))}
                        className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
                    />
                </div>
            </div>
        </div>
      </Card>

      <Card title="自主逻辑配置 (AUTONOMOUS)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
             <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                <div>
                    <h4 className="text-white font-medium">自动排程整理</h4>
                    <p className="text-xs text-slate-400 mt-1">每日上午 10:00 自动执行</p>
                </div>
                <button 
                    onClick={() => updateSetting('autoSchedule', !settings.autoSchedule)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.autoSchedule ? 'bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.5)]' : 'bg-slate-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.autoSchedule ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                <div>
                    <h4 className="text-white font-medium">夜间静音模式</h4>
                    <p className="text-xs text-slate-400 mt-1">降低灯光亮度与电机噪音</p>
                </div>
                <button 
                    onClick={() => updateSetting('nightMode', !settings.nightMode)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.nightMode ? 'bg-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.5)]' : 'bg-slate-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.nightMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="col-span-full mt-2">
                <label className="block text-sm font-medium text-slate-300 mb-3">避障策略 (OBSTACLE AVOIDANCE)</label>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { id: 'Conservative', label: '保守模式', desc: '最大安全距离' }, 
                        { id: 'Balanced', label: '平衡模式', desc: '标准导航' }, 
                        { id: 'Aggressive', label: '激进模式', desc: '狭窄空间优先' }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => updateSetting('obstacleAvoidance', mode.id)}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all relative overflow-hidden group ${
                                settings.obstacleAvoidance === mode.id 
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                            }`}
                        >
                            <span className="relative z-10 block font-bold">{mode.label}</span>
                            <span className="relative z-10 block text-[10px] mt-1 opacity-70">{mode.desc}</span>
                            {settings.obstacleAvoidance === mode.id && (
                                <div className="absolute inset-0 bg-cyan-400/5 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
             </div>
        </div>
      </Card>
      
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
        <button className="text-slate-400 text-sm hover:text-white transition-colors px-4 py-2">恢复默认</button>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-md font-medium shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all hover:scale-105 active:scale-95">
            保存配置
        </button>
      </div>
    </div>
  );
};