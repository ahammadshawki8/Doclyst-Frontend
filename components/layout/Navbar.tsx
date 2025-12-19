import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onLogoClick: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, showBackButton = false, onBack }) => (
  <nav className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 flex items-center max-w-5xl mx-auto relative">
    {showBackButton && onBack && (
      <button 
        onClick={onBack} 
        className="flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-slate-700 transition-colors z-10"
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Back</span>
      </button>
    )}
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={onLogoClick}>
      <div className="bg-mint-400 w-7 h-7 sm:w-8 sm:h-8 rounded-lg rotate-3 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm">
        D
      </div>
      <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-700">Doclyst</span>
    </div>
  </nav>
);

export default Navbar;
