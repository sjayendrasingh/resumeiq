import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function UploadZone({ onAnalyze, isAnalyzing }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showJd, setShowJd] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Handle drag states
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Validate and set file
  const handleFileValidation = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported. Please upload a standard PDF resume.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Max file size is 5MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  // Trigger file browser click
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    onAnalyze(file, jobDescription);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Upload Container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={file ? null : onButtonClick}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 shadow-lg shadow-brand-500/10'
              : file
              ? 'border-emerald-500/60 bg-emerald-50/10 dark:bg-emerald-950/5'
              : 'border-slate-300 dark:border-slate-700/80 hover:border-brand-400 dark:hover:border-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleChange}
            disabled={isAnalyzing}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            
            {/* File Icon Status */}
            {file ? (
              <div className="p-4 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl animate-fade-in relative">
                <FileText className="h-10 w-10" />
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="absolute -top-1 -right-1 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full p-1 hover:scale-110 transition-transform shadow"
                  disabled={isAnalyzing}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-brand-50 dark:bg-brand-950/40 text-brand-500 dark:text-brand-400 rounded-2xl">
                <UploadCloud className="h-10 w-10 animate-pulse-slow" />
              </div>
            )}

            {/* Typography */}
            {file ? (
              <div className="space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-lg">
                  Drag and drop your PDF resume
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  or <span className="text-brand-600 dark:text-brand-400 hover:underline">browse your files</span>
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Only PDF formats supported (Max. 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-2xl animate-fade-in text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Collapsible Job Description Input (Optional SaaS feature) */}
        <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white/50 dark:bg-darkCard/30 transition-all duration-200">
          <button
            type="button"
            onClick={() => setShowJd(!showJd)}
            className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center space-x-2 text-sm sm:text-base">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span>Paste Job Description to check matching score (Optional)</span>
            </div>
            {showJd ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showJd && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 animate-fade-in">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or requirement terms here. ResumeIQ will compute a direct compatibility percentage match!"
                rows={5}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-darkBg p-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors duration-200"
                disabled={isAnalyzing}
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!file || isAnalyzing}
          className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 transition-all duration-200 ${
            !file || isAnalyzing
              ? 'bg-slate-200 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              : 'bg-brand-600 hover:bg-brand-700 text-white hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing PDF & Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Analyze Resume Now</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
