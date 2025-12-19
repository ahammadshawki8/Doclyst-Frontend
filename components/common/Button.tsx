import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, variant = 'primary', children, className = '' }) => {
  const baseStyles = 'flex items-center justify-center gap-2 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white shadow-lg shadow-mint-200',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg',
    outline: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
