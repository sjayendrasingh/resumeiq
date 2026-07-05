import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, Cpu, Zap, ArrowRight, Check, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Cpu className="h-6 w-6 text-brand-600 dark:text-brand-400" />,
      title: "Google Gemini Flash Engine",
      description: "Powered by Gemini 1.5 Flash for blazing fast analysis and precise, structured evaluation of resume content."
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "ATS Optimization Metrics",
      description: "Direct simulation of Applicant Tracking Systems algorithms to highlight how parser-friendly your document is."
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Missing Keywords Discovery",
      description: "Automatically cross-references your skills with industry-standard requirements to find critical missing keyword gaps."
    }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "$0",
      period: "forever",
      description: "For new graduates and freshers entering the job market.",
      features: [
        "3 Resume uploads per day",
        "Overall & ATS scores",
        "Key strengths & improvements",
        "Gemini-1.5-Flash processing"
      ],
      popular: false,
      cta: "Start Free",
      link: "/register"
    },
    {
      name: "Premium Pro",
      price: "$19",
      period: "month",
      description: "For active job seekers applying to competitive tech roles.",
      features: [
        "Unlimited resume uploads",
        "Job description matching analysis",
        "Prioritized missing keyword suggestions",
        "Export reports as PDF (nice-to-have)",
        "Extended AI detail descriptions"
      ],
      popular: true,
      cta: "Upgrade to Pro",
      link: "/register"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For bootcamps and placement agencies scaling applications.",
      features: [
        "Bulk resume uploads",
        "Custom ATS matching rules",
        "API integration endpoints",
        "Dedicated analytics dashboard"
      ],
      popular: false,
      cta: "Contact Sales",
      link: "/register"
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-darkBg transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="glow-backdrop" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 dark:bg-brand-950/30 dark:border-brand-900/40 text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-wide uppercase animate-fade-in shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Resume Analysis</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] animate-slide-up">
            Optimize Your Resume For{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-indigo-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
              ATS Shortlisting
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Upload your PDF resume to receive instantly mapped structural ratings, clear bullet-point strengths, actionable improvements, and missing keywords in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/10 hover:shadow-brand-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <span>Optimize for Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white dark:bg-darkCard hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800/60 rounded-2xl font-bold transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/50 dark:border-slate-800/50 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Engineered to boost screening success
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            No tricks or gimmicks. Just objective semantic parser review against real recruitment criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card hover:border-brand-500/30 p-8 rounded-3xl transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="p-3 bg-brand-50 dark:bg-brand-950/40 w-fit rounded-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Mock Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/50 dark:border-slate-800/50 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Transparent pricing models
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Free forever tier to assist software engineering freshers in landing their first dev gig.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative glass-card p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                tier.popular
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/5 dark:bg-indigo-950/5'
                  : 'hover:border-slate-400/30'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{tier.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 min-h-8">{tier.description}</p>

                <div className="flex items-baseline space-x-1.5 my-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">/{tier.period}</span>
                  )}
                </div>

                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2.5 text-sm text-slate-600 dark:text-slate-350">
                      <Check className={`h-4 w-4 flex-shrink-0 ${tier.popular ? 'text-brand-500' : 'text-slate-400'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={tier.link}
                className={`w-full py-3.5 rounded-2xl font-bold text-center block text-sm transition-all duration-200 ${
                  tier.popular
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/20'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-10 relative z-10 text-center">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} ResumeIQ. Developed as a professional portfolio project.
        </p>
      </footer>
    </div>
  );
}
