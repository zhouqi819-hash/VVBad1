import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg overflow-hidden relative ${className}`}>
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50"></div>

        {(title || action) && (
            <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                {title && <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-widest">{title}</h3>}
                {action && <div>{action}</div>}
            </div>
        )}
        <div className="p-4">
            {children}
        </div>
    </div>
  );
};
