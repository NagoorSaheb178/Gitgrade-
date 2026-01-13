import React from 'react';
import { Cpu, Database, Binary, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  stage: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-reveal">
      <div className="relative w-32 h-32 mb-12">
        {/* Pulse Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse-ring"></div>
        <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-pulse-ring [animation-delay:0.8s]"></div>
        
        {/* Central Icon Container */}
        <div className="absolute inset-4 rounded-3xl bg-surface border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
          <Cpu className="w-10 h-10 text-primary animate-pulse" />
          {/* Scanning Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-sm px-4">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          {stage.includes('Analyzing') ? <Binary size={20} className="text-accent"/> : <Database size={20} className="text-primary"/>}
          {stage}
        </h3>
        
        <div className="flex justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.1s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]"></div>
        </div>

        <p className="text-gray-500 text-sm italic font-mono">
          {stage.includes('Fetching') ? "Parsing repository structure..." : "Evaluating code patterns & documentation..."}
        </p>
      </div>

      {/* Mini Roadmap Preview during loading */}
      <div className="mt-12 flex items-center gap-8 opacity-40">
        <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-lg bg-surface border border-white/5"><Database size={16}/></div>
            <span className="text-[10px] font-mono">DATA</span>
        </div>
        <div className="w-12 h-px bg-white/10"></div>
        <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-lg bg-surface border border-white/5"><Binary size={16}/></div>
            <span className="text-[10px] font-mono">LOGIC</span>
        </div>
        <div className="w-12 h-px bg-white/10"></div>
        <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-lg bg-surface border border-white/5"><ShieldCheck size={16}/></div>
            <span className="text-[10px] font-mono">SCORE</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;