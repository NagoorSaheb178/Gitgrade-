import React, { useEffect, useState } from 'react';
import { Cpu, Binary, Database, ShieldCheck, Terminal, Code2 } from 'lucide-react';

interface LoadingScreenProps {
  stage: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 relative overflow-hidden rounded-3xl bg-surface/30 border border-white/5 animate-reveal">
      {/* Background Code Drifters */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-around">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="animate-code-drift text-[10px] font-mono text-primary/40 flex flex-col gap-4"
            style={{ animationDelay: `${i * 0.7}s`, animationDuration: `${3 + Math.random() * 2}s` }}
          >
            <span>{`function analyze_${i}() {`}</span>
            <span>{`  const data = getRepo();`}</span>
            <span>{`  return AI.process(data);`}</span>
            <span>{`}`}</span>
          </div>
        ))}
      </div>

      {/* Main Animation Core */}
      <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
        {/* Deep Pulse Layers */}
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
        <div className="absolute -inset-4 rounded-full border border-primary/20 animate-pulse-ring"></div>
        <div className="absolute -inset-8 rounded-full border border-accent/10 animate-pulse-ring [animation-delay:1.5s]"></div>
        
        {/* Glass Hexagon / Icon Container */}
        <div className="relative w-24 h-24 rounded-[2rem] bg-background border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center overflow-hidden z-10">
          <Cpu className="w-12 h-12 text-primary animate-pulse" />
          
          {/* Real-time Scanning Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan"></div>
          
          {/* Glitch Overlay Effect */}
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay opacity-30"></div>
        </div>
      </div>

      {/* Status Text Block */}
      <div className="text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <Terminal size={14} className="text-secondary" />
          <span className="text-sm font-mono text-gray-400">
            SYSTEM_STATUS: <span className="text-white uppercase">{stage}</span>
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse"></span>
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
          {stage.includes('Analyzing') ? (
            <Binary size={24} className="text-accent animate-spin [animation-duration:3s]" />
          ) : (
            <Database size={24} className="text-primary animate-bounce" />
          )}
          Deep Analysis in Progress{dots}
        </h3>
        
        <p className="text-gray-500 text-sm font-mono max-w-xs mx-auto leading-relaxed">
          {stage.includes('Fetching') 
            ? "Downloading repository structure and metadata..." 
            : "Running Puter AI neural evaluation on codebase structure and commit history..."}
        </p>
      </div>

      {/* Progress Trackers */}
      <div className="mt-16 grid grid-cols-3 gap-12 opacity-50 relative z-10">
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${stage.includes('Fetching') ? 'scale-110 opacity-100 text-primary' : ''}`}>
            <div className={`p-3 rounded-2xl bg-surface border ${stage.includes('Fetching') ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/5'}`}>
              <Database size={20}/>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">Harvest</span>
        </div>
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${stage.includes('Analyzing') ? 'scale-110 opacity-100 text-accent' : ''}`}>
            <div className={`p-3 rounded-2xl bg-surface border ${stage.includes('Analyzing') ? 'border-accent shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-white/5'}`}>
              <Binary size={20}/>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">Think</span>
        </div>
        <div className="flex flex-col items-center gap-2 opacity-30">
            <div className="p-3 rounded-2xl bg-surface border border-white/5">
              <ShieldCheck size={20}/>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase">Report</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;