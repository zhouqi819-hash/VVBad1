import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage, RobotState, SystemStats, RobotSettings } from '../types';

interface AIChatProps {
  stats: SystemStats;
  state: RobotState;
  settings: RobotSettings;
}

export const AIChat: React.FC<AIChatProps> = ({ stats, state, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: '蓝视智寻 AI 核心已上线。系统运转正常，请问有什么可以帮您？', timestamp: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await generateAIResponse(input, { stats, state, settings });
    
    const botMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText, 
        timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full shadow-[0_0_20px_rgba(8,145,178,0.6)] flex items-center justify-center text-white hover:scale-110 transition-all z-50 group border border-cyan-400/50"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-900 text-cyan-400 text-xs px-3 py-1.5 rounded border border-cyan-500/50 whitespace-nowrap shadow-xl">
            呼叫 AI 助手
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col z-50 h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-slate-800/50 rounded-t-2xl">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
                 <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
                <h3 className="font-sans text-sm text-white font-bold tracking-wide">系统智能中枢</h3>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-cyan-500/70">ONLINE</span>
                </div>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded transition-colors">
            <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-cyan-900/40 text-white border border-cyan-700/50 rounded-br-none' 
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                    {msg.text}
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none flex gap-1.5 items-center border border-slate-700">
                    <span className="text-xs text-slate-500 mr-2">思考中</span>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-700/50 flex gap-2 bg-slate-900/50 rounded-b-2xl">
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入指令或询问..."
            className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] focus:outline-none transition-all placeholder:text-slate-600"
        />
        <button 
            type="submit" 
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-lg transition-all disabled:opacity-50 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]"
        >
            <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};