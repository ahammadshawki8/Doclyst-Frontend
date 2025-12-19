import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Download, Sparkles, Shield, TrendingUp, TrendingDown, Minus, XCircle, ArrowRight, HelpCircle, GitCompare, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { ReportStatus, AnalysisResult, ComparisonItem, Language } from '../types';
import Mascot from '../components/Mascot';
import { generatePDF } from '../services/pdfGenerator';
import { t } from '../services/translations';
import { ttsPlayer } from '../services/ttsService';

interface ResultsPageProps {
  result: AnalysisResult;
  language: Language;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up TTS callbacks
    ttsPlayer.onEnd(() => {
      setIsSpeaking(false);
      setIsLoading(false);
    });
    
    return () => {
      ttsPlayer.stop();
    };
  }, []);

  const speakResults = async () => {
    if (isSpeaking || isLoading) {
      ttsPlayer.stop();
      setIsSpeaking(false);
      setIsLoading(false);
      return;
    }

    const textParts: string[] = [];
    
    // Add summary
    if (result.summary) {
      textParts.push(result.summary);
    }

    // Add test explanations
    result.tests.forEach(test => {
      textParts.push(`${test.name}: ${test.value}. ${test.explanation}`);
    });

    // Add anti-panic sections
    if (result.doesNotMean && result.doesNotMean.length > 0) {
      textParts.push(t(language, 'whatDoesNotMean'));
      result.doesNotMean.forEach(item => textParts.push(item));
    }

    if (result.nextSteps && result.nextSteps.length > 0) {
      textParts.push(t(language, 'whatToDoNext'));
      result.nextSteps.forEach(step => textParts.push(step));
    }

    if (result.doctorQuestions && result.doctorQuestions.length > 0) {
      textParts.push(t(language, 'questionsForDoctor'));
      result.doctorQuestions.forEach(q => textParts.push(q));
    }

    const fullText = textParts.join('. ');
    setIsLoading(true);
    
    try {
      await ttsPlayer.speak(fullText, language);
      setIsLoading(false);
      setIsSpeaking(true);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.NORMAL:
        return {
          bg: 'bg-gradient-to-br from-mint-50 via-mint-100 to-emerald-50',
          border: 'border-mint-200',
          text: 'text-mint-700',
          icon: <CheckCircle className="w-8 h-8" />,
          label: t(language, 'everythingLooksGood'),
          mascotState: 'happy' as const
        };
      case ReportStatus.ATTENTION:
        return {
          bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertCircle className="w-8 h-8" />,
          label: t(language, 'needsAttention'),
          mascotState: 'idle' as const
        };
      case ReportStatus.URGENT:
        return {
          bg: 'bg-gradient-to-br from-rose-50 via-red-50 to-pink-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          icon: <AlertCircle className="w-8 h-8" />,
          label: t(language, 'seeDoctor'),
          mascotState: 'thinking' as const
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          icon: <Minus className="w-8 h-8" />,
          label: t(language, 'analysisComplete'),
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
              {normalCount} / {totalCount} {t(language, 'testsInRange')}
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
          <h3 className="text-slate-800 font-bold text-lg sm:text-xl">
            {result.isComparison ? t(language, 'comparisonSummary') : t(language, 'simpleSummary')}
          </h3>
        </div>
        <div className="relative bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.isComparison ? 'from-lavender-400 via-purple-300 to-lavender-400' : 'from-mint-400 via-lavender-300 to-mint-400'}`}></div>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-body">
            {result.summary}
          </p>
        </div>
      </section>

      {/* Comparison Results */}
      {result.isComparison && result.comparison && (
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
            <GitCompare className="w-4 h-4 sm:w-5 sm:h-5 text-lavender-500" />
            <h3 className="text-slate-800 font-bold text-lg sm:text-xl">{t(language, 'changesBetweenReports')}</h3>
          </div>

          {/* Comparison Summary */}
          {result.comparison.comparisonSummary && (
            <div className="bg-gradient-to-br from-lavender-50 to-purple-50 border border-lavender-200 p-4 sm:p-5 rounded-xl mb-4">
              <p className="text-slate-700 font-body text-sm sm:text-base">{result.comparison.comparisonSummary}</p>
            </div>
          )}

          <div className="grid gap-4">
            {/* Improved */}
            {result.comparison.improved && result.comparison.improved.length > 0 && (
              <div className="bg-gradient-to-br from-mint-50 to-emerald-50 border border-mint-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                <h4 className="font-bold text-mint-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t(language, 'improved')} ({result.comparison.improved.length})
                </h4>
                <div className="space-y-3">
                  {result.comparison.improved.map((item: ComparisonItem, idx: number) => (
                    <div key={idx} className="bg-white/70 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-xs bg-mint-100 text-mint-700 px-2 py-1 rounded-full">↑ Improved</span>
                      </div>
                      <div className="text-sm text-slate-500 mb-1">
                        <span className="text-amber-600">{item.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span className="text-mint-600 font-medium">{item.newValue}</span>
                      </div>
                      <p className="text-sm text-slate-600">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Worsened */}
            {result.comparison.worsened && result.comparison.worsened.length > 0 && (
              <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                <h4 className="font-bold text-rose-700 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  {t(language, 'needsAttentionLabel')} ({result.comparison.worsened.length})
                </h4>
                <div className="space-y-3">
                  {result.comparison.worsened.map((item: ComparisonItem, idx: number) => (
                    <div key={idx} className="bg-white/70 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">↓ Changed</span>
                      </div>
                      <div className="text-sm text-slate-500 mb-1">
                        <span className="text-slate-600">{item.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span className="text-rose-600 font-medium">{item.newValue}</span>
                      </div>
                      <p className="text-sm text-slate-600">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stable */}
            {result.comparison.stable && result.comparison.stable.length > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Minus className="w-5 h-5" />
                  {t(language, 'stable')} ({result.comparison.stable.length})
                </h4>
                <div className="space-y-2">
                  {result.comparison.stable.map((item: ComparisonItem, idx: number) => (
                    <div key={idx} className="bg-white/70 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-sm text-slate-500">{item.newValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Findings */}
            {result.comparison.newFindings && result.comparison.newFindings.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                <h4 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t(language, 'newInReport')} ({result.comparison.newFindings.length})
                </h4>
                <div className="space-y-3">
                  {result.comparison.newFindings.map((item: ComparisonItem, idx: number) => (
                    <div key={idx} className="bg-white/70 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">New</span>
                      </div>
                      <div className="text-sm text-amber-600 font-medium mb-1">{item.newValue}</div>
                      <p className="text-sm text-slate-600">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Test Breakdown */}
      <section className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-mint-500" />
          <h3 className="text-slate-800 font-bold text-lg sm:text-xl">{t(language, 'testBreakdown')}</h3>
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
                <span className="text-slate-500">{t(language, 'normal')}:</span>
                <span className="font-semibold text-slate-600">{test.range}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-Panic Section: What This Does NOT Mean */}
      {result.doesNotMean && result.doesNotMean.length > 0 && (
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
            <h3 className="text-slate-800 font-bold text-lg sm:text-xl">{t(language, 'whatDoesNotMean')}</h3>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem]">
            <ul className="space-y-3">
              {result.doesNotMean.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-500 text-sm font-bold">✗</span>
                  <span className="text-slate-700 font-body text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Anti-Panic Section: What You Should Do Next */}
      {result.nextSteps && result.nextSteps.length > 0 && (
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-mint-500" />
            <h3 className="text-slate-800 font-bold text-lg sm:text-xl">{t(language, 'whatToDoNext')}</h3>
          </div>
          <div className="bg-gradient-to-br from-mint-50 to-emerald-50 border border-mint-100 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem]">
            <ul className="space-y-3">
              {result.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-mint-500 text-white flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                  <span className="text-slate-700 font-body text-sm sm:text-base">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Anti-Panic Section: Questions to Ask Your Doctor */}
      {result.doctorQuestions && result.doctorQuestions.length > 0 && (
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 ml-1 sm:ml-2">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-lavender-500" />
            <h3 className="text-slate-800 font-bold text-lg sm:text-xl">{t(language, 'questionsForDoctor')}</h3>
          </div>
          <div className="bg-gradient-to-br from-lavender-50 to-purple-50 border border-lavender-100 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem]">
            <ul className="space-y-3">
              {result.doctorQuestions.map((question, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-lavender-500 text-white flex items-center justify-center text-sm font-bold">?</span>
                  <span className="text-slate-700 font-body text-sm sm:text-base">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="relative bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-6 sm:mb-10 flex items-start gap-3 sm:gap-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-slate-100/50 rounded-full blur-2xl"></div>
        <div className="p-1.5 sm:p-2 bg-slate-200 rounded-lg flex-shrink-0">
          <AlertCircle className="text-slate-500 w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="relative z-10">
          <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-1">{t(language, 'importantNote')}</p>
          <p className="text-xs sm:text-sm text-slate-600 font-body">
            {result.disclaimer || "Doclyst does not provide medical advice. This explanation is for informational purposes only. Always consult with a healthcare professional."}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
        <button 
          onClick={speakResults}
          disabled={isLoading}
          className={`group flex items-center justify-center gap-2 sm:gap-3 font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base ${
            isLoading
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-amber-200 cursor-wait'
              : isSpeaking 
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-rose-200' 
                : 'bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white shadow-mint-200'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
              {t(language, 'loading')}
            </>
          ) : isSpeaking ? (
            <>
              <VolumeX size={18} className="sm:w-5 sm:h-5" />
              {t(language, 'stopReading')}
            </>
          ) : (
            <>
              <Volume2 size={18} className="sm:w-5 sm:h-5" />
              {t(language, 'readAloud')}
            </>
          )}
        </button>
        <button 
          onClick={() => generatePDF(result)}
          className="group flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full shadow-xl shadow-slate-300 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          <Download size={18} className="sm:w-5 sm:h-5 group-hover:animate-bounce" />
          {t(language, 'downloadSummary')}
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
