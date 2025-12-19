import React, { useState } from 'react';
import { X, FileImage, FileText, GitCompare, FileSearch } from 'lucide-react';
import Mascot from '../components/Mascot';
import { UploadMode, Language } from '../types';
import { t } from '../services/translations';

interface UploadPageProps {
  onFilesSelect: (files: File[]) => void;
  onComparisonSelect: (oldFiles: File[], newFiles: File[]) => void;
  uploadMode: UploadMode;
  onModeChange: (mode: UploadMode) => void;
  language: Language;
}

const UploadPage: React.FC<UploadPageProps> = ({ 
  onFilesSelect, 
  onComparisonSelect,
  uploadMode,
  onModeChange,
  language
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [oldReportFiles, setOldReportFiles] = useState<File[]>([]);
  const [newReportFiles, setNewReportFiles] = useState<File[]>([]);
  const [activeDropZone, setActiveDropZone] = useState<'old' | 'new' | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleComparisonDrop = (e: React.DragEvent, type: 'old' | 'new') => {
    e.preventDefault();
    setActiveDropZone(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (type === 'old') {
        setOldReportFiles(prev => [...prev, ...files]);
      } else {
        setNewReportFiles(prev => [...prev, ...files]);
      }
    }
  };

  const handleComparisonFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'old' | 'new') => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (type === 'old') {
        setOldReportFiles(prev => [...prev, ...files]);
      } else {
        setNewReportFiles(prev => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeComparisonFile = (index: number, type: 'old' | 'new') => {
    if (type === 'old') {
      setOldReportFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewReportFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAnalyze = () => {
    if (selectedFiles.length > 0) {
      onFilesSelect(selectedFiles);
    }
  };

  const handleCompare = () => {
    if (oldReportFiles.length > 0 && newReportFiles.length > 0) {
      onComparisonSelect(oldReportFiles, newReportFiles);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-mint-500" />;
    }
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleModeChange = (mode: UploadMode) => {
    onModeChange(mode);
    setSelectedFiles([]);
    setOldReportFiles([]);
    setNewReportFiles([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 sm:px-6 animate-slide-up max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">{t(language, 'uploadTitle')}</h2>
      <p className="text-slate-500 mb-4 sm:mb-6 text-sm sm:text-base text-center">
        {uploadMode === 'single' 
          ? t(language, 'uploadSubtitleSingle')
          : t(language, 'uploadSubtitleCompare')}
      </p>

      {/* Mode Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-full mb-6 sm:mb-8">
        <button
          onClick={() => handleModeChange('single')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all ${
            uploadMode === 'single'
              ? 'bg-white text-mint-600 shadow-md'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span className="hidden sm:inline">{t(language, 'singleAnalysis')}</span>
          <span className="sm:hidden">{t(language, 'analyze')}</span>
        </button>
        <button
          onClick={() => handleModeChange('comparison')}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all ${
            uploadMode === 'comparison'
              ? 'bg-white text-lavender-600 shadow-md'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span className="hidden sm:inline">{t(language, 'compareReports')}</span>
          <span className="sm:hidden">{t(language, 'compare')}</span>
        </button>
      </div>

      {/* Single Upload Mode */}
      {uploadMode === 'single' && (
        <>
          <div 
            className={`w-full aspect-[4/3] max-h-[250px] sm:max-h-[300px] border-2 border-dashed rounded-2xl sm:rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer bg-white relative overflow-hidden group
              ${isDragging ? 'border-mint-400 bg-mint-50 scale-[1.02]' : 'border-slate-800 hover:border-mint-400 hover:bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-mint-50/50 pointer-events-none" />
            <div className={`transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
              <Mascot state="idle" className="w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-3" />
            </div>
            <div className="text-center z-10 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm border border-white">
              <span className="text-mint-600 font-bold block mb-1 text-sm sm:text-base">{t(language, 'clickOrDrag')}</span>
              <span className="text-xs text-slate-400">{t(language, 'fileTypes')}</span>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="w-full mt-4 sm:mt-6 space-y-2">
              <p className="text-sm font-semibold text-slate-600 mb-2 sm:mb-3">
                {selectedFiles.length} {t(language, 'filesSelected')}
              </p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="overflow-hidden min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(index)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-2">
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <button 
              onClick={handleAnalyze}
              className="mt-4 sm:mt-6 bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white font-bold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-lg shadow-mint-200 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              {t(language, 'analyzeFiles')} {selectedFiles.length}
            </button>
          )}
        </>
      )}

      {/* Comparison Mode */}
      {uploadMode === 'comparison' && (
        <>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Old Report */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">1</span>
                {t(language, 'oldReport')}
              </p>
              <div 
                className={`flex-1 min-h-[150px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-white relative overflow-hidden
                  ${activeDropZone === 'old' ? 'border-amber-400 bg-amber-50' : 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/50'}`}
                onDragOver={(e) => { e.preventDefault(); setActiveDropZone('old'); }}
                onDragLeave={() => setActiveDropZone(null)}
                onDrop={(e) => handleComparisonDrop(e, 'old')}
              >
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => handleComparisonFileChange(e, 'old')}
                />
                <FileText className="w-8 h-8 text-amber-400 mb-2" />
                <span className="text-amber-600 font-medium text-sm">{t(language, 'previousReport')}</span>
                <span className="text-xs text-slate-400">{t(language, 'clickOrDrop')}</span>
              </div>
              {oldReportFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {oldReportFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-amber-50 p-2 rounded-lg text-xs">
                      <span className="truncate flex-1">{file.name}</span>
                      <button onClick={() => removeComparisonFile(index, 'old')} className="ml-2">
                        <X className="w-3 h-3 text-amber-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New Report */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-mint-600 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-mint-100 flex items-center justify-center text-xs">2</span>
                {t(language, 'newReport')}
              </p>
              <div 
                className={`flex-1 min-h-[150px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer bg-white relative overflow-hidden
                  ${activeDropZone === 'new' ? 'border-mint-400 bg-mint-50' : 'border-mint-200 hover:border-mint-400 hover:bg-mint-50/50'}`}
                onDragOver={(e) => { e.preventDefault(); setActiveDropZone('new'); }}
                onDragLeave={() => setActiveDropZone(null)}
                onDrop={(e) => handleComparisonDrop(e, 'new')}
              >
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => handleComparisonFileChange(e, 'new')}
                />
                <FileText className="w-8 h-8 text-mint-400 mb-2" />
                <span className="text-mint-600 font-medium text-sm">{t(language, 'latestReport')}</span>
                <span className="text-xs text-slate-400">{t(language, 'clickOrDrop')}</span>
              </div>
              {newReportFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {newReportFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-mint-50 p-2 rounded-lg text-xs">
                      <span className="truncate flex-1">{file.name}</span>
                      <button onClick={() => removeComparisonFile(index, 'new')} className="ml-2">
                        <X className="w-3 h-3 text-mint-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {oldReportFiles.length > 0 && newReportFiles.length > 0 && (
            <button 
              onClick={handleCompare}
              className="mt-6 bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white font-bold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-lg shadow-mint-200 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              {t(language, 'compareReports')}
            </button>
          )}

          {(oldReportFiles.length === 0 || newReportFiles.length === 0) && (
            <p className="mt-4 text-sm text-slate-400 text-center">
              {t(language, 'uploadBothReports')}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UploadPage;
