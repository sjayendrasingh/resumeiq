import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-400 rounded-xl text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-brand-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
                ResumeIQ
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                
                <div className="flex items-center space-x-3 pl-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hi, <span className="text-brand-600 dark:text-brand-400 font-semibold">{user?.name}</span>
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
                <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Pricing</a>
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 transition-colors">Sign In</Link>
                <Link
                  to="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 ml-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 dark:border-slate-800/80 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1.5 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-medium ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2 px-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.name}</span></p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a href="#features" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300">Features</a>
                <a href="#pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300">Pricing</a>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300">Sign In</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base font-medium bg-brand-600 text-white text-center font-semibold">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
