import React from 'react';
import { Shield, AlertTriangle, Heart, Zap, Lock, HelpCircle, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { t } from '../services/translations';

interface AboutPageProps {
  language: Language;
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ language, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 animate-slide-up">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">{t(language, 'back')}</span>
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-mint-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t(language, 'aboutTitle')}</h1>
        <p className="text-slate-500">{t(language, 'aboutSubtitle')}</p>
      </div>

      {/* What is Doclyst */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-mint-100 rounded-lg">
            <HelpCircle className="w-5 h-5 text-mint-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t(language, 'whatIsDoclyst')}</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          {t(language, 'whatIsDoclystDesc')}
        </p>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-mint-500 mt-1">✓</span>
            <span>{t(language, 'feature1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-mint-500 mt-1">✓</span>
            <span>{t(language, 'feature2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-mint-500 mt-1">✓</span>
            <span>{t(language, 'feature3')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-mint-500 mt-1">✓</span>
            <span>{t(language, 'feature4')}</span>
          </li>
        </ul>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-lavender-100 rounded-lg">
            <Zap className="w-5 h-5 text-lavender-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t(language, 'howItWorksTitle')}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-mint-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="font-semibold text-slate-800">{t(language, 'step1Title')}</h3>
              <p className="text-slate-500 text-sm">{t(language, 'howStep1')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-mint-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="font-semibold text-slate-800">{t(language, 'howStep2Title')}</h3>
              <p className="text-slate-500 text-sm">{t(language, 'howStep2')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-mint-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="font-semibold text-slate-800">{t(language, 'howStep3Title')}</h3>
              <p className="text-slate-500 text-sm">{t(language, 'howStep3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t(language, 'privacyTitle')}</h2>
        </div>
        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">🔒</span>
            <span>{t(language, 'privacy1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">🗑️</span>
            <span>{t(language, 'privacy2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">👤</span>
            <span>{t(language, 'privacy3')}</span>
          </li>
        </ul>
      </section>

      {/* Important Disclaimer */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-rose-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-rose-800">{t(language, 'disclaimerTitle')}</h2>
        </div>
        <div className="space-y-3 text-rose-900">
          <p className="font-medium">{t(language, 'disclaimer1')}</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✗</span>
              <span>{t(language, 'disclaimer2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✗</span>
              <span>{t(language, 'disclaimer3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✗</span>
              <span>{t(language, 'disclaimer4')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✗</span>
              <span>{t(language, 'disclaimer5')}</span>
            </li>
          </ul>
          <p className="font-semibold pt-2 border-t border-rose-200">{t(language, 'disclaimer6')}</p>
        </div>
      </section>

      {/* Consult Your Doctor */}
      <section className="bg-gradient-to-br from-mint-50 to-emerald-50 rounded-2xl p-6 border border-mint-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-mint-100 rounded-lg">
            <Heart className="w-5 h-5 text-mint-600" />
          </div>
          <h2 className="text-xl font-bold text-mint-800">{t(language, 'consultTitle')}</h2>
        </div>
        <p className="text-mint-900 leading-relaxed">
          {t(language, 'consultDesc')}
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
