import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Download, Heart } from 'lucide-react';
import { AppState, AppStep, ReportStatus, AnalysisResult } from './types';
import { analyzeMedicalReport } from './services/geminiService';
import Mascot from './components/Mascot';

// --- COMPONENTS ---

// 1. Landing Page
const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in max-w-2xl mx-auto">
    <Mascot state="happy" className="w-48 h-48 mb-6" />
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-sans tracking-tight">
      Understand your medical report. <span className="text-mint-500">Calmly.</span>
    </h1>
    <p className="text-lg text-slate-500 mb-10 max-w-lg font-body leading-relaxed">
      Upload your medical report and get a simple, clear explanation — no scary jargon, just clarity.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
      {[
        { icon: Upload, text: "Upload report" },
        { icon: Heart, text: "Simple English" },
        { icon: CheckCircle, text: "Peace of mind" }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white shadow-sm">
          <div className="p-3 bg-mint-100 text-mint-600 rounded-full mb-3">
            <item.icon size={24} />
          </div>
          <span className="text-slate-600 font-semibold font-body">{item.text}</span>
        </div>
      ))}
    </div>

    <button 
      onClick={onStart}
      className="group relative bg-slate-800 hover:bg-slate-700 text-white text-lg font-bold py-4 px-10 rounded-full shadow-xl shadow-slate-200 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
    >
      Upload Medical Report
      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
    </button>
    
    <p className="mt-8 text-xs text-slate-400 font-body bg-slate-100/50 px-4 py-2 rounded-full">
      🔒 Secure & Private • Not medical advice
    </p>
  </div>
);

// 2. Upload Page
const UploadPage: React.FC<{ onFileSelect: (f: File) => void }> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-slide-up max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Let's see what we have</h2>
      <p className="text-slate-500 mb-8">We accept PDF, JPG, and PNG files.</p>
      
      <div 
        className={`w-full aspect-[4/3] max-h-[400px] border-3 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer bg-white relative overflow-hidden group
          ${isDragging ? 'border-mint-400 bg-mint-50 scale-[1.02]' : 'border-slate-200 hover:border-mint-300 hover:bg-slate-50'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          accept="image/*,.pdf"
          onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-mint-50/50 pointer-events-none" />
        
        <div className={`transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
          <Mascot state="idle" className="w-32 h-32 mb-4" />
        </div>
        
        <div className="text-center z-10 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-white">
          <span className="text-mint-600 font-bold block mb-1">Click or Drag & Drop</span>
          <span className="text-xs text-slate-400">Your file is processed securely</span>
        </div>
      </div>
      
      <button className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors">
        Why do we need this?
      </button>
    </div>
  );
};

// 3. Processing Page
const ProcessingPage: React.FC = () => {
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
        {messages[msgIdx]}
      </h3>
      <p className="text-slate-400 font-body">This usually takes less than 30 seconds.</p>
      
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

// 4. Results Page
const ResultsPage: React.FC<{ result: AnalysisResult; onReset: () => void }> = ({ result, onReset }) => {
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.NORMAL: return 'bg-mint-100 text-mint-700 border-mint-200';
      case ReportStatus.ATTENTION: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ReportStatus.URGENT: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.NORMAL: return <CheckCircle className="w-6 h-6 mr-2" />;
      case ReportStatus.ATTENTION: return <AlertCircle className="w-6 h-6 mr-2" />;
      case ReportStatus.URGENT: return <AlertCircle className="w-6 h-6 mr-2" />;
    }
  };

  const getStatusText = (status: ReportStatus) => {
     switch (status) {
      case ReportStatus.NORMAL: return 'Everything looks good';
      case ReportStatus.ATTENTION: return 'Needs a little attention';
      case ReportStatus.URGENT: return 'Please see a doctor soon';
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-20 animate-slide-up">
      {/* Header Status */}
      <div className={`rounded-3xl p-6 mb-8 border-2 flex items-center justify-between ${getStatusColor(result.overallStatus)} shadow-sm`}>
        <div className="flex items-center">
          {getStatusIcon(result.overallStatus)}
          <span className="text-xl font-bold">{getStatusText(result.overallStatus)}</span>
        </div>
        <Mascot state={result.overallStatus === ReportStatus.NORMAL ? 'happy' : 'idle'} className="w-16 h-16 hidden md:block" />
      </div>

      {/* Summary */}
      <section className="mb-10">
        <h3 className="text-slate-800 font-bold text-xl mb-4 ml-2">Simple Summary</h3>
        <div className="glass-card p-6 rounded-[2rem] shadow-sm text-lg text-slate-600 leading-relaxed font-body">
          {result.summary}
        </div>
      </section>

      {/* Breakdown */}
      <section className="mb-10">
        <h3 className="text-slate-800 font-bold text-xl mb-4 ml-2">Test Breakdown</h3>
        <div className="grid gap-4">
          {result.tests.map((test, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{test.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${test.status === 'normal' ? 'bg-mint-50 text-mint-600' : 
                    test.status === 'warning' ? 'bg-amber-50 text-amber-600' : 
                    'bg-rose-50 text-rose-600'}`}>
                  {test.value}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-2 font-body">{test.explanation}</p>
              <div className="text-xs text-slate-400 font-mono bg-slate-50 inline-block px-2 py-1 rounded">
                Normal range: {test.range}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-lavender-50 border border-lavender-200 p-4 rounded-xl mb-8 flex items-start gap-3">
        <AlertCircle className="text-lavender-400 min-w-[20px]" size={20} />
        <p className="text-sm text-slate-600 font-body">
          {result.disclaimer || "Doclyst does not provide medical advice. This is for informational purposes only."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-slate-700 transition-transform hover:scale-105 active:scale-95">
          <Download size={18} /> Download Summary
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-white text-slate-600 font-bold py-3 px-8 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={18} /> Check Another Report
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

function App() {
  const [state, setState] = useState<AppState>({
    step: AppStep.LANDING,
    file: null,
    filePreview: null,
    analysis: null,
    error: null
  });

  const transitionTo = (step: AppStep) => {
    setState(prev => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileSelect = async (file: File) => {
    setState(prev => ({ 
      ...prev, 
      file, 
      filePreview: URL.createObjectURL(file),
      step: AppStep.PROCESSING 
    }));

    try {
      const result = await analyzeMedicalReport(file);
      setState(prev => ({
        ...prev,
        analysis: result,
        step: AppStep.RESULTS
      }));
    } catch (error) {
      console.error(error);
      alert("Something went wrong analyzing the file. Please try again.");
      setState(prev => ({ ...prev, step: AppStep.UPLOAD, file: null }));
    }
  };

  const resetApp = () => {
    setState({
      step: AppStep.LANDING,
      file: null,
      filePreview: null,
      analysis: null,
      error: null
    });
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-slate-800 selection:bg-mint-200 selection:text-mint-900">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetApp}>
          <div className="bg-mint-400 w-8 h-8 rounded-lg rotate-3 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            D
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-700">Doclyst</span>
        </div>
        {state.step !== AppStep.LANDING && (
          <button onClick={resetApp} className="text-sm font-semibold text-slate-400 hover:text-slate-600">
            Start Over
          </button>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto pt-4 md:pt-10">
        {state.step === AppStep.LANDING && <LandingPage onStart={() => transitionTo(AppStep.UPLOAD)} />}
        {state.step === AppStep.UPLOAD && <UploadPage onFileSelect={handleFileSelect} />}
        {state.step === AppStep.PROCESSING && <ProcessingPage />}
        {state.step === AppStep.RESULTS && state.analysis && <ResultsPage result={state.analysis} onReset={resetApp} />}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-300 text-sm mt-auto">
        <p>© {new Date().getFullYear()} Doclyst • Made with calm</p>
      </footer>
    </div>
  );
}

export default App;
