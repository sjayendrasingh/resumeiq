import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { 
  RadialBarChart, RadialBar, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, Key, FileText, 
  Sparkles, Loader2, Calendar, Target, ExternalLink 
} from 'lucide-react';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setError('');
        const res = await axiosInstance.get(`/resume/${id}`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching resume analysis:', err);
        setError('Failed to fetch resume analysis results. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-darkBg flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <Loader2 className="h-10 w-10 text-brand-600 dark:text-brand-400 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold tracking-wide animate-pulse">
            Loading visual audit results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-darkBg flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 rounded-3xl max-w-md text-center space-y-5">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Analysis Not Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{error || 'This analysis record does not exist.'}</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const { fileName, createdAt, analysis, jobDescription, jdMatchScore } = data;
  const { overallScore, atsScore, strengths, improvements, missingKeywords } = analysis;

  // Format Recharts data structures
  const buildGaugeData = (score, color) => [
    { name: 'Track', value: 100, fill: 'rgba(156, 163, 175, 0.1)' },
    { name: 'Score', value: score, fill: color }
  ];

  // Colors for scores
  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'; // Tailwind emerald-500
    if (score >= 50) return '#f59e0b'; // Tailwind amber-500
    return '#ef4444'; // Tailwind red-500
  };

  const hasJd = jobDescription && jobDescription.trim().length > 0;

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-darkBg py-10 px-4 sm:px-6 lg:px-8">
      <div className="glow-backdrop" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-slide-up">
        
        {/* Header Back Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-650 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Audited on {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Title Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-brand-600 dark:border-l-brand-500">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Audit Report: {fileName}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Semantic analysis report compiled using Google Gemini Flash model</p>
          </div>
          {hasJd && (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/30 rounded-xl text-xs font-semibold">
              <Target className="h-4 w-4" />
              <span>Job Description Matched</span>
            </div>
          )}
        </div>

        {/* Gauges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Gauge 1: Overall Score */}
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[260px]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Impact</span>
            
            <div className="relative h-36 w-36 my-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="80%"
                  outerRadius="100%"
                  barSize={10}
                  data={buildGaugeData(overallScore, getScoreColor(overallScore))}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar clockWise dataKey="value" cornerRadius={99} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-950 dark:text-white">{overallScore}%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Score</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-450 px-2 leading-relaxed">
              Based on document grammar, clarity, visual layout spacing, and fresher impact.
            </p>
          </div>

          {/* Gauge 2: ATS Score */}
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[260px]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ATS Readability</span>

            <div className="relative h-36 w-36 my-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="80%"
                  outerRadius="100%"
                  barSize={10}
                  data={buildGaugeData(atsScore, getScoreColor(atsScore))}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar clockWise dataKey="value" cornerRadius={99} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-950 dark:text-white">{atsScore}%</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Readability</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-455 px-2 leading-relaxed">
              Standard parser compatibility rating checking for bullet points and structural labels.
            </p>
          </div>

          {/* Gauge 3: JD Match (OR Empty placeholder if not targeted) */}
          <div className="glass-card p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[260px]">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Matching</span>

            {hasJd ? (
              <div className="relative h-36 w-36 my-4 flex items-center justify-center animate-fade-in">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    barSize={10}
                    data={buildGaugeData(jdMatchScore, getScoreColor(jdMatchScore))}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar clockWise dataKey="value" cornerRadius={99} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-950 dark:text-white">{jdMatchScore}%</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Matching</span>
                </div>
              </div>
            ) : (
              <div className="my-auto py-4 flex flex-col items-center space-y-2.5 text-slate-400 dark:text-slate-600">
                <Target className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">No JD Match Data</p>
                  <p className="text-[11px] leading-relaxed max-w-[180px] mx-auto text-slate-400 dark:text-slate-500">
                    Paste a job description on the next upload to audit matching score!
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-450 px-2 leading-relaxed">
              Calculates how well your resume matches the job description criteria.
            </p>
          </div>

        </div>

        {/* Strengths & Improvements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Strengths Card Panel */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Core Strengths</h3>
            </div>
            
            <ul className="space-y-4">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-darkBg/30 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements Card Panel */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center space-x-2 text-amber-500 border-b border-slate-100 dark:border-slate-800 pb-4">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Areas to Improve</h3>
            </div>

            <ul className="space-y-4">
              {improvements.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-darkBg/30 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/20">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Missing Keywords Panel */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Key className="h-5 w-5" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Missing Keywords</h3>
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-3xl">
            ATS parsers count the occurrences of specific industry terms to determine relevance. Consider integrating the following skills or tool names naturally into your project descriptions:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {missingKeywords.map((keyword, idx) => (
              <span 
                key={idx}
                className="px-3.5 py-1.5 text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-650 dark:bg-brand-950/30 dark:hover:bg-brand-900/40 dark:text-brand-350 border border-brand-100 dark:border-brand-900/30 rounded-xl cursor-default transition-colors"
              >
                + {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Job Description (If matched) */}
        {hasJd && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Cross-referenced Job Description</h3>
            <div className="bg-slate-50 dark:bg-darkBg/50 p-4 rounded-2xl border border-slate-250/20 max-h-40 overflow-y-auto text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
              {jobDescription}
            </div>
          </div>
        )}

        {/* Raw Text Inspector Panel */}
        <div className="border border-slate-200 dark:border-slate-800/80 rounded-3xl overflow-hidden bg-white/50 dark:bg-darkCard/10 transition-all duration-200">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center space-x-2 text-sm sm:text-base">
              <FileText className="h-4.5 w-4.5 text-slate-500" />
              <span>Inspect Extracted Resume Text (Debug View)</span>
            </div>
            <span className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              {showRawText ? 'Hide text' : 'Show text'}
            </span>
          </button>

          {showRawText && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800/80 animate-fade-in bg-slate-50/50 dark:bg-darkBg/25">
              <div className="bg-white dark:bg-darkBg p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 max-h-96 overflow-y-auto text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono whitespace-pre-wrap shadow-inner">
                {extractedText || data.extractedText}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
