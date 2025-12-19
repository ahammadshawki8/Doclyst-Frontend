import React, { useState } from 'react';
import { ArrowLeft, Globe, ChevronDown } from 'lucide-react';
import { Language, LANGUAGES } from '../../types';
import { t } from '../../services/translations';

interface NavbarProps {
  onLogoClick: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onLogoClick, 
  showBackButton = false, 
  onBack,
  language,
  onLanguageChange
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <nav className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 flex items-center justify-between max-w-5xl mx-auto relative">
      {/* Back Button */}
      <div className="w-24 sm:w-32">
        {showBackButton && onBack && (
          <button 
            onClick={onBack} 
            className="flex items-center gap-1 sm:gap-2 text-slate-500 hover:text-slate-700 transition-colors z-10"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold hidden sm:inline">{t(language, 'back')}</span>
          </button>
        )}
      </div>

      {/* Logo - Center */}
      <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={onLogoClick}>
        <div className="bg-mint-400 w-7 h-7 sm:w-8 sm:h-8 rounded-lg rotate-3 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm">
          D
        </div>
        <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-700">Doclyst</span>
      </div>

      {/* Language Selector - Right */}
      <div className="w-24 sm:w-32 flex justify-end relative">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white border border-slate-200 hover:border-mint-300 hover:bg-mint-50 transition-all text-sm shadow-sm"
        >
          <Globe className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline text-slate-600 font-medium">{currentLang.flag}</span>
          <span className="text-xs sm:text-sm text-slate-600">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isLangOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsLangOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 min-w-[160px] animate-slide-up">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-mint-50 transition-colors ${
                    language === lang.code ? 'bg-mint-50 text-mint-700' : 'text-slate-600'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <span className="text-xs text-slate-400">{lang.nativeName}</span>
                  </div>
                  {language === lang.code && (
                    <span className="ml-auto text-mint-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
