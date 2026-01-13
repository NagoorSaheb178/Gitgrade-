import React, { useState } from 'react';
import { Github, Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { parseRepoUrl, fetchRepoData } from './services/githubService';
import { analyzeRepo } from './services/aiService';
import { AnalysisResult } from './types';
import ScoreCard from './components/ScoreCard';
import RadarAnalysis from './components/RadarAnalysis';
import Roadmap from './components/Roadmap';
import MetricsGrid from './components/MetricsGrid';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) {
      setError("Invalid GitHub URL. Please use format: https://github.com/username/repo");
      return;
    }

    setLoading(true);

    try {
      setStage('Fetching repository data...');
      const context = await fetchRepoData(repoInfo.owner, repoInfo.repo);

      setStage('Analyzing with Puter AI...');
      const analysis = await analyzeRepo(context);

      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check the URL and try again.");
    } finally {
      setLoading(false);
      setStage('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 selection:bg-primary/30 font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Github className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">GitGrade</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
             <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-accent"/> Puter.js AI</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-6">
            <Sparkles size={12} />
            <span>Puter-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6 tracking-tight">
            How good is your code, really?
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Get an instant AI evaluation of your GitHub repository. 
            Receive a score, actionable roadmap, and professional summary.
          </p>

          <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/project-name"
              className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-gray-200 font-semibold px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>Analyze <Search className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2 max-w-xl mx-auto text-left animate-reveal">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingScreen stage={stage} />}

        {/* Results Section */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Top Row: Score and Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 animate-reveal stagger-1">
                <ScoreCard 
                  score={result.score} 
                  grade={result.grade} 
                  summary={result.summary} 
                />
              </div>
              <div className="lg:col-span-1 animate-reveal stagger-2">
                <RadarAnalysis breakdown={result.breakdown} />
              </div>
            </div>

            {/* Middle Row: Strengths/Weaknesses and Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="animate-reveal stagger-3">
                  <MetricsGrid strengths={result.strengths} weaknesses={result.weaknesses} />
                </div>
                <div className="animate-reveal stagger-4">
                  <Roadmap steps={result.roadmap} />
                </div>
              </div>
              
              {/* Sidebar Info */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-surface rounded-xl p-6 border border-white/5 animate-reveal stagger-5">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Project Stats</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Code Quality</span>
                          <span className="font-mono text-white">{result.breakdown.codeQuality}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Structure</span>
                          <span className="font-mono text-white">{result.breakdown.structure}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Documentation</span>
                          <span className="font-mono text-white">{result.breakdown.documentation}%</span>
                      </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20 animate-reveal stagger-6">
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Sparkles size={12}/> AI Mentor Tip
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed italic">
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