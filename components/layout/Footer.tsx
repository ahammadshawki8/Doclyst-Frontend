import React from 'react';
import { Language } from '../../types';
import { t } from '../../services/translations';

interface FooterProps {
  language: Language;
  onAboutClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ language, onAboutClick }) => (
  <footer className="text-center py-8 text-slate-400 text-sm mt-auto">
    <p className="mb-2">© {new Date().getFullYear()} Doclyst • {t(language, 'footerText')} {t(language, 'footerBrand')}</p>
    {onAboutClick && (
      <button 
        onClick={onAboutClick}
        className="text-mint-500 hover:text-mint-600 underline underline-offset-2 transition-colors"
      >
        {t(language, 'aboutLink')}
      </button>
    )}
  </footer>
);

export default Footer;
