import React from 'react';
import { Home, Gamepad2, Settings as SettingsIcon, LogOut, Cpu } from 'lucide-react';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: '系统总览' },
    { id: 'control', icon: Gamepad2, label: '远程操控' },
    { id: 'settings', icon: SettingsIcon, label: '参数设置' },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans text-slate-200 selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur border-r border-slate-800 hidden md:flex flex-col relative z-20">
        <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Cpu className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-white font-bold tracking-tight text-lg">蓝视智寻</h1>
                    <p className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">Smart Search</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                        activeTab === item.id 
                        ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                    }`}
                >
                    {activeTab === item.id && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400"></div>
                    )}
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
                    <span className="font-medium text-sm tracking-wide">{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
            <div className="mb-4 px-4">
                <p className="text-[10px] text-slate-500 font-mono mb-1 uppercase">系统运行时间 (UPTIME)</p>
                <p className="text-sm text-white font-mono flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    14天 03小时 22分
                </p>
            </div>
            <Button variant="secondary" onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-sm">
                <LogOut className="w-4 h-4" /> 退出登录
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-black">
        {/* Mobile Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex md:hidden items-center justify-between px-4 z-20">
            <span className="text-white font-bold flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" /> 蓝视智寻
            </span>
            <button onClick={onLogout}>
                <LogOut className="w-5 h-5 text-slate-400" />
            </button>
        </header>
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-grid-pattern animate-pulse-slow"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none"></div>

        <div className="flex-1 overflow-auto z-10 relative custom-scrollbar">
            <div className="p-6 max-w-7xl mx-auto w-full">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
                            {menuItems.find(i => i.id === activeTab)?.label}
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono font-normal tracking-normal">
                                / VIEW: {activeTab.toUpperCase()}
                            </span>
                        </h2>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                        <span className="text-xs font-mono text-green-400 tracking-wider">SYSTEM ONLINE</span>
                    </div>
                </div>
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};