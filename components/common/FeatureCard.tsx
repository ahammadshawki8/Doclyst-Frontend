import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  text: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white shadow-sm">
    <div className="p-3 bg-slate-100 text-slate-800 rounded-full mb-3">
      <Icon size={24} />
    </div>
    <span className="text-slate-600 font-semibold font-body">{text}</span>
  </div>
);

export default FeatureCard;
