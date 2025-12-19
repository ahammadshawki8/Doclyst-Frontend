import React, { useState, useEffect } from 'react';
import Mascot from '../components/Mascot';
import { Language } from '../types';
import { t } from '../services/translations';

interface ProcessingPageProps {
  language: Language;
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ language }) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    "Reading your report...",
    "Understanding medical terms...",
    "Translating to plain English...",
    "Double checking clarity..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-mint-200 rounded-full blur-2xl opacity-20 animate-pulse-slow"></div>
        <Mascot state="thinking" className="w-40 h-40 relative z-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-2 transition-all duration-500 h-8">
        {t(language, 'processing')}
      </h3>
      <p className="text-slate-400 font-body">{t(language, 'pleaseWait')}</p>
      
      <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-mint-400 rounded-full animate-[loading_2s_ease-in-out_infinite] w-1/3 origin-left"></div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingPage;
