import React, { useState } from 'react';
import { AppState, AppStep } from './types';
import { analyzeWithBackend } from './services/backendService';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';

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

  const handleFilesSelect = async (files: File[]) => {
    setState(prev => ({ 
      ...prev, 
      file: files[0],
      filePreview: URL.createObjectURL(files[0]),
      step: AppStep.PROCESSING 
    }));

    try {
      const result = await analyzeWithBackend(files);
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
      <Navbar 
        onLogoClick={resetApp} 
        showBackButton={state.step === AppStep.UPLOAD || state.step === AppStep.RESULTS}
        onBack={resetApp}
      />

      <main className="container mx-auto pt-4 md:pt-10">
        {state.step === AppStep.LANDING && <LandingPage onStart={() => transitionTo(AppStep.UPLOAD)} />}
        {state.step === AppStep.UPLOAD && <UploadPage onFilesSelect={handleFilesSelect} />}
        {state.step === AppStep.PROCESSING && <ProcessingPage />}
        {state.step === AppStep.RESULTS && state.analysis && <ResultsPage result={state.analysis} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
