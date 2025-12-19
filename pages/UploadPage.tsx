import React, { useState } from 'react';
import { X, FileImage, FileText } from 'lucide-react';
import Mascot from '../components/Mascot';

interface UploadPageProps {
  onFilesSelect: (files: File[]) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    if (selectedFiles.length > 0) {
      onFilesSelect(selectedFiles);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 sm:px-6 animate-slide-up max-w-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">Let's see what we have</h2>
      <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base text-center">Upload all pages of your report for a complete analysis.</p>
      
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
          <span className="text-mint-600 font-bold block mb-1 text-sm sm:text-base">Click or Drag & Drop</span>
          <span className="text-xs text-slate-400">PDF, JPG, PNG • Multiple files</span>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="w-full mt-4 sm:mt-6 space-y-2">
          <p className="text-sm font-semibold text-slate-600 mb-2 sm:mb-3">
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </p>
          {selectedFiles.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-1 min-w-0">
                {getFileIcon(file)}
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFile(index)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analyze Button */}
      {selectedFiles.length > 0 && (
        <button 
          onClick={handleAnalyze}
          className="mt-4 sm:mt-6 bg-gradient-to-r from-mint-500 to-mint-400 hover:from-mint-600 hover:to-mint-500 text-white font-bold py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-lg shadow-mint-200 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          Analyze {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
};

export default UploadPage;
