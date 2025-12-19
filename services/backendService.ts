import { AnalysisResult, ReportStatus } from "../types";

// @ts-ignore - Vite env
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

export const analyzeWithBackend = async (files: File[]): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    
    // Append all files - backend will process them together
    files.forEach((file) => {
      formData.append('file', file);
    });
    
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
      disclaimer: result.disclaimer
    };
    
  } catch (error) {
    console.error("Backend analysis failed:", error);
    throw new Error("We couldn't analyze your report. Please try again.");
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
