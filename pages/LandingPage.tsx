import React from 'react';
import { Upload, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import Mascot from '../components/Mascot';
import FeatureCard from '../components/common/FeatureCard';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 sm:px-6 animate-fade-in max-w-2xl mx-auto">
    <Mascot state="happy" className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 sm:mb-6" />
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3 sm:mb-4 font-sans tracking-tight">
      Medical Report <span className="text-mint-500">Simplified.</span>
    </h1>
    <p className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 max-w-lg font-body leading-relaxed px-2">
      Doclyst turns complex medical reports into clear, human-readable explanations with safety alerts in under 30 seconds.
    </p>

    <button 
      onClick={onStart}
      className="group relative bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white text-base sm:text-lg font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full shadow-lg shadow-mint-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10"
    >
      <Upload size={20} className="sm:w-[22px] sm:h-[22px]" />
      <span>Upload Medical Report</span>
      <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
    </button>

    <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full">
      <FeatureCard icon={Upload} text="Upload report" />
      <FeatureCard icon={Heart} text="Simple English" />
      <FeatureCard icon={CheckCircle} text="Peace of mind" />
    </div>
    
    <p className="mt-8 sm:mt-10 text-xs text-slate-400 font-body bg-slate-100/50 px-3 sm:px-4 py-2 rounded-full">
      🔒 Secure & Private • Not medical advice
    </p>
  </div>
);

export default LandingPage;
