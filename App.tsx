import React, { useState, useEffect } from 'react';
import { Github, Search, Loader2, AlertCircle, Sparkles, LogIn } from 'lucide-react';
import { parseRepoUrl, fetchRepoData } from './services/githubService';
import { analyzeRepo } from './services/aiService';
import { AnalysisResult } from './types';
import ScoreCard from './components/ScoreCard';
import RadarAnalysis from './components/RadarAnalysis';
import Roadmap from './components/Roadmap';
import MetricsGrid from './components/MetricsGrid';
import LoadingScreen from './components/LoadingScreen';

declare const puter: any;

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isPuterAuth, setIsPuterAuth] = useState(true);

  useEffect(() => {
    // Check Puter Auth on mount to warn user early if needed
    if (typeof puter !== 'undefined') {
      const signedIn = puter.auth.isSignedIn();
      setIsPuterAuth(!!signedIn);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      await puter.auth.signIn();
      setIsPuterAuth(true);
      setError(null);
    } catch (e) {
      console.error("Sign in failed", e);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;

    setError(null);
    setResult(null);

    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) {
      setError("Invalid GitHub URL. Please use format: https://github.com/username/repo");
      return;
    }

    setLoading(true);

    try {
      setStage('Fetching data');
      const context = await fetchRepoData(repoInfo.owner, repoInfo.repo);

      setStage('Analyzing AI');
      const analysis = await analyzeRepo(context);

      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check the URL and try again.");
      // Check if it might be an auth issue
      if (err.message?.includes('logged in') || err.message?.includes('401')) {
        setIsPuterAuth(false);
      }
    } finally {
      setLoading(false);
      setStage('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 selection:bg-primary/30 font-sans pb-24">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Github className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">GitGrade</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
             {!isPuterAuth && (
               <button 
                onClick={handleSignIn}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-all text-xs font-bold"
               >
                 <LogIn size={12}/> Sign in to Puter
               </button>
             )}
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
               <Sparkles size={14} className="text-accent"/> 
               AI v2.0
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-6">
            <Sparkles size={12} />
            <span>Developer Profile Analyzer</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6 tracking-tight">
            How good is your code?
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Get an instant AI evaluation of your GitHub repository. 
            Deployed seamlessly on Vercel with Puter Intelligence.
          </p>

          <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
              <Github className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/project-name"
              disabled={loading}
              className="w-full bg-surface border border-white/10 rounded-2xl py-5 pl-12 pr-36 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-2xl disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-gray-200 active:scale-95 font-bold px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>Analyze <Search className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex flex-col items-center gap-3 max-w-xl mx-auto animate-reveal">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
              {!isPuterAuth && (
                <button 
                  onClick={handleSignIn}
                  className="mt-2 text-xs font-bold uppercase tracking-widest bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Connect Puter Account
                </button>
              )}
            </div>
          )}
        </div>

        {loading && <LoadingScreen stage={stage} />}

        {result && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 animate-reveal stagger-1">
                <ScoreCard score={result.score} grade={result.grade} summary={result.summary} />
              </div>
              <div className="lg:col-span-1 animate-reveal stagger-2">
                <RadarAnalysis breakdown={result.breakdown} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="animate-reveal stagger-3">
                  <MetricsGrid strengths={result.strengths} weaknesses={result.weaknesses} />
                </div>
                <div className="animate-reveal stagger-4">
                  <Roadmap steps={result.roadmap} />
                </div>
              </div>
              
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-surface rounded-2xl p-6 border border-white/5 shadow-xl animate-reveal stagger-5">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-black mb-6">Telemetry</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-gray-400 text-sm font-medium">Quality</span>
                          <span className="font-mono text-primary font-bold">{result.breakdown.codeQuality}%</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                          <span className="text-gray-400 text-sm font-medium">Structure</span>
                          <span className="font-mono text-primary font-bold">{result.breakdown.structure}%</span>
                      </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-2xl p-6 border border-primary/20 shadow-xl animate-reveal stagger-6 relative overflow-hidden group">
                    <p className="text-xs text-primary font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sparkles size={12}/> AI Mentor
                    </p>
                    <p className="text-[15px] text-gray-200 leading-relaxed italic font-serif">
                      "{result.roadmap[0]}"
                    </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
