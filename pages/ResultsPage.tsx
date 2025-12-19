import React from 'react';
import { CheckCircle, AlertCircle, Download, Sparkles, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ReportStatus, AnalysisResult } from '../types';
import Mascot from '../components/Mascot';
import { generatePDF } from '../services/pdfGenerator';

interface ResultsPageProps {
  result: AnalysisResult;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result }) => {
  const getStatusConfig = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.NORMAL:
        return {
          bg: 'bg-gradient-to-br from-mint-50 via-mint-100 to-emerald-50',
          border: 'border-mint-200',
          text: 'text-mint-700',
          icon: <CheckCircle className="w-8 h-8" />,
          label: 'Everything looks good',
          mascotState: 'happy' as const
        };
      case ReportStatus.ATTENTION:
        return {
          bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertCircle className="w-8 h-8" />,
          label: 'Needs a little attention',
          mascotState: 'idle' as const
        };
      case ReportStatus.URGENT:
        return {
          bg: 'bg-gradient-to-br from-rose-50 via-red-50 to-pink-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          icon: <AlertCircle className="w-8 h-8" />,
          label: 'Please see a doctor soon',
          mascotState: 'thinking' as const
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          icon: <Minus className="w-8 h-8" />,
          label: 'Analysis complete',
          mascotState: 'idle' as const
        };
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <Minus className="w-4 h-4" />;
      default: return <TrendingDown className="w-4 h-4" />;
    }
  };

  const statusConfig = getStatusConfig(result.overallStatus);
  const normalCount = result.tests.filter(t => t.status === 'normal').length;
  const totalCount = result.tests.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 animate-slide-up">
      {/* Hero Status Card */}
      <div className={`relative rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 mb-6 sm:mb-10 border-2 ${statusConfig.bg} ${statusConfig.border} shadow-xl overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center">
            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${statusConfig.text} bg-white/50 mb-2 sm:mb-3`}>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${statusConfig.text} mb-1 sm:mb-2`}>
              {statusConfig.label}
            </h2>
            <p className="text-slate-500 font-body text-sm sm:text-base">
              {normalCount} of {totalCount} tests within normal range
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
            <Mascot state={statusConfig.mascotState} className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative z-10 drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <section className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-mint-500" />
          <h3 className="text-slate-800 font-bold text-lg sm:text-xl">Simple Summary</h3>
        </div>
        <div className="relative bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mint-400 via-lavender-300 to-mint-400"></div>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-body">
            {result.summary}
          </p>
        </div>
      </section>

      {/* Test Breakdown */}
      <section className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-mint-500" />
          <h3 className="text-slate-800 font-bold text-lg sm:text-xl">Test Breakdown</h3>
        </div>
        <div className="grid gap-3 sm:gap-4">
          {result.tests.map((test, idx) => (
            <div 
              key={idx} 
              className="group bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-slate-100 hover:shadow-xl hover:border-mint-200 transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg transition-colors
                    ${test.status === 'normal' ? 'bg-mint-100 text-mint-600' : 
                      test.status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                      'bg-rose-100 text-rose-600'}`}>
                    {getTestStatusIcon(test.status)}
                  </div>
                  <h4 className="font-bold text-slate-800 text-base sm:text-lg">{test.name}</h4>
                </div>
                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold tracking-wide shadow-sm self-start
                  ${test.status === 'normal' ? 'bg-gradient-to-r from-mint-50 to-emerald-50 text-mint-700 border border-mint-200' : 
                    test.status === 'warning' ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200' : 
                    'bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200'}`}>
                  {test.value}
                </span>
              </div>
              <p className="text-slate-500 mb-2 sm:mb-3 font-body leading-relaxed text-sm sm:text-base">{test.explanation}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-50 inline-flex px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-100">
                <span className="text-slate-500">Normal:</span>
                <span className="font-semibold text-slate-600">{test.range}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="relative bg-gradient-to-r from-lavender-50 to-purple-50 border border-lavender-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-6 sm:mb-10 flex items-start gap-3 sm:gap-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-lavender-100/50 rounded-full blur-2xl"></div>
        <div className="p-1.5 sm:p-2 bg-lavender-100 rounded-lg flex-shrink-0">
          <AlertCircle className="text-lavender-500 w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="relative z-10">
          <p className="text-xs sm:text-sm font-semibold text-lavender-700 mb-1">Important Note</p>
          <p className="text-xs sm:text-sm text-slate-600 font-body">
            {result.disclaimer || "Doclyst does not provide medical advice. This explanation is for informational purposes only. Always consult with a healthcare professional."}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button 
          onClick={() => generatePDF(result)}
          className="group flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full shadow-xl shadow-slate-300 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          <Download size={18} className="sm:w-5 sm:h-5 group-hover:animate-bounce" />
          Download Summary
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
