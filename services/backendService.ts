import { AnalysisResult, ReportStatus, Language } from "../types";

// @ts-ignore - Vite env
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'https://doclyst-backend.onrender.com';

export const analyzeWithBackend = async (files: File[], language: Language = 'en'): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    
    // Append all files - backend will process them together
    files.forEach((file) => {
      formData.append('file', file);
    });
    
    // Add language preference
    formData.append('language', language);
    
    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Analysis failed');
    }
    
    const result = await response.json();
    
    // Map backend response to frontend types
    return {
      overallStatus: result.overallStatus as ReportStatus,
      summary: result.summary,
      tests: result.tests.map((test: any) => ({
        name: test.name,
        value: test.value,
        range: test.range,
        explanation: test.explanation,
        status: test.status as 'normal' | 'warning' | 'alert'
      })),
      disclaimer: result.disclaimer,
      // Anti-panic content
      doesNotMean: result.doesNotMean || [],
      nextSteps: result.nextSteps || [],
      doctorQuestions: result.doctorQuestions || []
    };
    
  } catch (error) {
    console.error("Backend analysis failed:", error);
    throw new Error("We couldn't analyze your report. Please try again.");
  }
};

export const compareReports = async (oldFiles: File[], newFiles: File[], language: Language = 'en'): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    
    oldFiles.forEach((file) => {
      formData.append('old_file', file);
    });
    
    newFiles.forEach((file) => {
      formData.append('new_file', file);
    });
    
    // Add language preference
    formData.append('language', language);
    
    const response = await fetch(`${BACKEND_URL}/compare`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Comparison failed');
    }
    
    const result = await response.json();
    
    return {
      overallStatus: result.overallStatus as ReportStatus,
      summary: result.summary,
      tests: result.tests?.map((test: any) => ({
        name: test.name,
        value: test.value,
        range: test.range,
        explanation: test.explanation,
        status: test.status as 'normal' | 'warning' | 'alert'
      })) || [],
      disclaimer: result.disclaimer,
      doesNotMean: result.doesNotMean || [],
      nextSteps: result.nextSteps || [],
      doctorQuestions: result.doctorQuestions || [],
      isComparison: true,
      comparison: result.comparison || undefined
    };
    
  } catch (error) {
    console.error("Backend comparison failed:", error);
    throw new Error("We couldn't compare your reports. Please try again.");
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
