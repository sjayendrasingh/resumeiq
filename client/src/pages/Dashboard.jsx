import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import UploadZone from '../components/UploadZone';
import { 
  FileText, Calendar, Trash2, Eye, BarChart2, Award, 
  History, RefreshCw, AlertCircle 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Fetch upload history
  const fetchHistory = async () => {
    try {
      setError('');
      const res = await axiosInstance.get('/resume/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Could not retrieve analysis history. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle new resume analysis
  const handleAnalyze = async (file, jobDescription) => {
    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const res = await axiosInstance.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Redirect straight to results page for the newly analyzed resume
      navigate(`/results/${res.data._id}`);
    } catch (err) {
      console.error('Analysis API error:', err);
      const msg = err.response?.data?.message || 'AI resume analysis failed. Please try again.';
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Delete resume record
  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await axiosInstance.delete(`/resume/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Could not delete the record. Please try again.');
    } finally {
      setDeleteId(null);
    }
  };

  // Compute overall stats
  const totalAnalyzed = history.length;
  const avgOverallScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.analysis.overallScore, 0) / totalAnalyzed) 
    : 0;
  const avgAtsScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.analysis.atsScore, 0) / totalAnalyzed) 
    : 0;

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get score style classes
  const getScoreBadge = (score) => {
    if (score >= 75) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
    if (score >= 50) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-100 dark:border-red-900/30';
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-darkBg py-10 px-4 sm:px-6 lg:px-8">
      <div className="glow-backdrop" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Workspace</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload and optimize your resume for targeted job roles</p>
          </div>
          <button 
            onClick={fetchHistory}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkCard hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload data</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-2xl animate-fade-in">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Stats Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Resumes */}
          <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Resumes</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalAnalyzed}</h3>
            </div>
            <div className="p-4 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-2xl">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Average Overall Score */}
          <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Overall Score</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalAnalyzed > 0 ? `${avgOverallScore}/100` : '—'}
              </h3>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Award className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Average ATS Score */}
          <div className="glass-card p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg ATS Score</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalAnalyzed > 0 ? `${avgAtsScore}/100` : '—'}
              </h3>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Upload Zone Component */}
        <div className="bg-white/40 dark:bg-darkCard/10 p-6 sm:p-10 rounded-[32px] border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-md">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Start New Resume Audit</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload a PDF to parse keywords and calculate ATS matching percentage.</p>
          </div>
          <UploadZone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis History</h2>
          </div>

          {loading ? (
            <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 border-4 border-brand-500/20 border-t-brand-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Retrieving database history records...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center space-y-3.5 border border-slate-200/40 dark:border-slate-800/40">
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-full w-fit mx-auto text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No resumes analyzed yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Upload your first PDF resume above to check optimization details.</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl overflow-hidden shadow border border-slate-200/50 dark:border-slate-800/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800/80">
                      <th className="py-4 px-6">File Name</th>
                      <th className="py-4 px-6">Date Analyzed</th>
                      <th className="py-4 px-6 text-center">Overall</th>
                      <th className="py-4 px-6 text-center">ATS Score</th>
                      <th className="py-4 px-6 text-center">JD Match</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/85">
                    {history.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200 text-sm truncate max-w-xs sm:max-w-sm">
                          {item.fileName}
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(item.createdAt)}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg ${getScoreBadge(item.analysis.overallScore)}`}>
                            {item.analysis.overallScore}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg ${getScoreBadge(item.analysis.atsScore)}`}>
                            {item.analysis.atsScore}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {item.jdMatchScore > 0 ? (
                            <span className="inline-flex items-center space-x-1 text-brand-600 dark:text-brand-400 font-bold">
                              <span>{item.jdMatchScore}%</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/results/${item._id}`)}
                              className="p-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 text-slate-600 dark:text-slate-400 rounded-xl transition-all"
                              title="View detailed results"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              disabled={deleteId === item._id}
                              className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 rounded-xl transition-all"
                              title="Delete record"
                            >
                              {deleteId === item._id ? (
                                <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
