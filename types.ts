export enum AppStep {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  ABOUT = 'ABOUT',
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
  // Anti-panic content
  doesNotMean: string[];
  nextSteps: string[];
  doctorQuestions: string[];
  // Comparison mode
  isComparison?: boolean;
  comparison?: ComparisonResult;
}

export interface ComparisonItem {
  name: string;
  oldValue: string;
  newValue: string;
  change: 'improved' | 'worsened' | 'stable' | 'new';
  explanation: string;
}

export interface ComparisonResult {
  improved: ComparisonItem[];
  worsened: ComparisonItem[];
  stable: ComparisonItem[];
  newFindings: ComparisonItem[];
  comparisonSummary: string;
}

export type UploadMode = 'single' | 'comparison';

export type Language = 'en' | 'bn' | 'zh' | 'hi' | 'es';

export const LANGUAGES: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export interface AppState {
  step: AppStep;
  file: File | null;
  filePreview: string | null;
  analysis: AnalysisResult | null;
  error: string | null;
  uploadMode: UploadMode;
  language: Language;
}
