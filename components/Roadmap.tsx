import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface RoadmapProps {
  steps: string[];
}

const Roadmap: React.FC<RoadmapProps> = ({ steps }) => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-white/5 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-secondary to-blue-500 rounded-full"></span>
        Personalized Roadmap
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="group relative flex gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/50">
                <CheckCircle2 size={14} />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-gray-200 font-medium">{step}</h4>
            </div>
            <div className="hidden group-hover:flex items-center text-gray-500">
               <ArrowRight size={18} /> 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;