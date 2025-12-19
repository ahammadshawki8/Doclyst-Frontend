import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  text: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center p-2 sm:p-4 bg-white/50 rounded-xl sm:rounded-2xl border border-white shadow-sm">
    <div className="p-2 sm:p-3 bg-slate-100 text-slate-800 rounded-full mb-2 sm:mb-3">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <span className="text-slate-600 font-semibold font-body text-xs sm:text-sm text-center">{text}</span>
  </div>
);

export default FeatureCard;
