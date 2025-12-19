export enum AppStep {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
}

export enum ReportStatus {
  NORMAL = 'NORMAL',
  ATTENTION = 'ATTENTION',
  URGENT = 'URGENT',
}

export interface TestItem {
  name: string;
  value: string;
  range: string;
  explanation: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface AnalysisResult {
  overallStatus: ReportStatus;
  summary: string;
  tests: TestItem[];
  disclaimer: string;
}

export interface AppState {
  step: AppStep;
  file: File | null;
  filePreview: string | null;
  analysis: AnalysisResult | null;
  error: string | null;
}
