import React, { useState } from 'react';
import { AppState, AppStep, UploadMode, Language } from './types';
import { analyzeWithBackend, compareReports } from './services/backendService';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';

function App() {
  const [state, setState] = useState<AppState>({
    step: AppStep.LANDING,
    file: null,
    filePreview: null,
    analysis: null,
    error: null,
    uploadMode: 'single',
    language: 'en'
  });

  const transitionTo = (step: AppStep) => {
    setState(prev => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setUploadMode = (mode: UploadMode) => {
    setState(prev => ({ ...prev, uploadMode: mode }));
  };

  const setLanguage = (language: Language) => {
    setState(prev => ({ ...prev, language }));
  };

  const handleFilesSelect = async (files: File[]) => {
    setState(prev => ({ 
      ...prev, 
      file: files[0],
      filePreview: URL.createObjectURL(files[0]),
      step: AppStep.PROCESSING 
    }));

    try {
      const result = await analyzeWithBackend(files, state.language);
      setState(prev => ({
        ...prev,
        analysis: result,
        step: AppStep.RESULTS
      }));
    } catch (error) {
      console.error(error);
      alert("Something went wrong analyzing the files. Please try again.");
      setState(prev => ({ ...prev, step: AppStep.UPLOAD, file: null }));
    }
  };

  const handleComparisonSelect = async (oldFiles: File[], newFiles: File[]) => {
    setState(prev => ({ 
      ...prev, 
      step: AppStep.PROCESSING 
    }));

    try {
      const result = await compareReports(oldFiles, newFiles, state.language);
      setState(prev => ({
        ...prev,
        analysis: result,
        step: AppStep.RESULTS
      }));
    } catch (error) {
      console.error(error);
      alert("Something went wrong comparing the reports. Please try again.");
      setState(prev => ({ ...prev, step: AppStep.UPLOAD, file: null }));
    }
  };

  const resetApp = () => {
    setState(prev => ({
      step: AppStep.LANDING,
      file: null,
      filePreview: null,
      analysis: null,
      error: null,
      uploadMode: 'single',
      language: prev.language // Keep language preference
    }));
  };

  return (
    <div className="min-h-screen bg-cream font-sans text-slate-800 selection:bg-mint-200 selection:text-mint-900">
      <Navbar 
        onLogoClick={resetApp} 
        showBackButton={state.step === AppStep.UPLOAD || state.step === AppStep.RESULTS}
        onBack={resetApp}
        language={state.language}
        onLanguageChange={setLanguage}
      />

      <main className="container mx-auto pt-4 md:pt-10">
        {state.step === AppStep.LANDING && <LandingPage onStart={() => transitionTo(AppStep.UPLOAD)} language={state.language} />}
        {state.step === AppStep.UPLOAD && (
          <UploadPage 
            onFilesSelect={handleFilesSelect}
            onComparisonSelect={handleComparisonSelect}
            uploadMode={state.uploadMode}
            onModeChange={setUploadMode}
            language={state.language}
          />
        )}
        {state.step === AppStep.PROCESSING && <ProcessingPage language={state.language} />}
        {state.step === AppStep.RESULTS && state.analysis && <ResultsPage result={state.analysis} language={state.language} />}
        {state.step === AppStep.ABOUT && <AboutPage language={state.language} onBack={resetApp} />}
      </main>

      <Footer language={state.language} onAboutClick={() => transitionTo(AppStep.ABOUT)} />
    </div>
  );
}

export default App;
