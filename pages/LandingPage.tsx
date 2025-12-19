import React from 'react';
import { Upload, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import Mascot from '../components/Mascot';
import FeatureCard from '../components/common/FeatureCard';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in max-w-2xl mx-auto">
    <Mascot state="happy" className="w-48 h-48 mb-6" />
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-sans tracking-tight">
      Medical Report <span className="text-mint-500">Simplified.</span>
    </h1>
    <p className="text-lg text-slate-500 mb-8 max-w-lg font-body leading-relaxed">
      Doclyst turns complex medical reports into clear, human-readable explanations with safety alerts in under 30 seconds.
    </p>

    <button 
      onClick={onStart}
      className="group relative bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg shadow-mint-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mb-10"
    >
      <Upload size={22} />
      Upload Medical Report
      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
    </button>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <FeatureCard icon={Upload} text="Upload report" />
      <FeatureCard icon={Heart} text="Simple English" />
      <FeatureCard icon={CheckCircle} text="Peace of mind" />
    </div>
    
    <p className="mt-10 text-xs text-slate-400 font-body bg-slate-100/50 px-4 py-2 rounded-full">
      🔒 Secure & Private • Not medical advice
    </p>
  </div>
);

export default LandingPage;
