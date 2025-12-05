import React, { useState } from 'react';
import { Lock, ScanFace, ChevronRight, Cpu, Activity, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20 animate-pulse-slow"></div>
      
      {/* Rotating Background Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-900/30 rounded-full animate-spin-slow pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-500/10 rounded-full animate-pulse pointer-events-none"></div>

      {/* Scanning Line */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-1/4 w-full animate-scan pointer-events-none"></div>

      <div className="relative z-20 w-full max-w-md p-4">
        {/* Holographic Card Effect */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(8,145,178,0.2)] relative overflow-hidden group">
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-950/50 border border-cyan-400 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative">
              <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-t border-cyan-200 animate-spin-slow"></div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-wider mb-2" style={{ textShadow: '0 0 10px rgba(6,182,212,0.6)' }}>蓝视智寻</h1>
            <div className="flex items-center justify-center gap-2 text-cyan-500/80 font-mono text-xs tracking-[0.2em] uppercase">
               <Activity className="w-3 h-3" />
               <span>智能鞋位导正系统</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group/input">
              <label className="block text-cyan-400/70 text-xs font-mono mb-2 flex justify-between">
                <span>操作员 ID (OPERATOR ID)</span>
                {/* 修复：将 > 转义为 &gt; */}
                <span className="opacity-0 group-focus-within/input:opacity-100 transition-opacity text-cyan-500">&gt;_ READY</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 text-white px-4 py-4 pl-12 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-mono tracking-widest"
                  placeholder="ADMIN"
                />
                <ScanFace className="w-5 h-5 text-slate-500 absolute left-4 top-4 group-focus-within/input:text-cyan-400 transition-colors" />
              </div>
            </div>

            <div className="group/input">
              <label className="block text-cyan-400/70 text-xs font-mono mb-2 flex justify-between">
                <span>访问密钥 (ACCESS KEY)</span>
                <ShieldCheck className="w-3 h-3 opacity-0 group-focus-within/input:opacity-100 text-cyan-500" />
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 text-white px-4 py-4 pl-12 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-mono tracking-widest"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-4 group-focus-within/input:text-cyan-400 transition-colors" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full flex items-center justify-center group h-12 text-lg font-bold bg-gradient-to-r from-cyan-900/50 to-blue-900/50 hover:from-cyan-800 hover:to-blue-800 border-cyan-500/50 relative overflow-hidden" 
              disabled={loading}
              glow
            >
              <div className="absolute inset-0 bg-cyan-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              {loading ? (
                <span className="flex items-center gap-2 animate-pulse">
                   验证中 <span className="tracking-widest">...</span>
                </span>
              ) : (
                <>
                  接入控制终端
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex justify-between items-center text-[10px] text-slate-600 font-mono border-t border-slate-800 pt-4">
            <span>系统版本: v2.5.0-CN</span>
            <span className="flex items-center gap-1 text-green-500/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                服务器在线
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};