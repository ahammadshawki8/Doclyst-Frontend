import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onLogoClick: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, showBackButton = false, onBack }) => (
  <nav className="px-6 pt-8 pb-6 flex items-center max-w-5xl mx-auto relative">
    {showBackButton && onBack && (
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-semibold">Back</span>
      </button>
    )}
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
      <div className="bg-mint-400 w-8 h-8 rounded-lg rotate-3 flex items-center justify-center text-white font-bold text-lg shadow-sm">
        D
      </div>
      <span className="font-bold text-xl tracking-tight text-slate-700">Doclyst</span>
    </div>
  </nav>
);

export default Navbar;
