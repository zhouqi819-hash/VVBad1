import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  glow = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-sm font-mono tracking-wider transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const variants = {
    primary: "bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    secondary: "bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-400",
    danger: "bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
  };

  const glowStyle = glow ? "shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
