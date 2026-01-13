import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface MetricsGridProps {
  strengths: string[];
  weaknesses: string[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ strengths, weaknesses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-surface/50 rounded-xl p-6 border border-green-500/10">
        <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
          <ThumbsUp size={18} /> Key Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-surface/50 rounded-xl p-6 border border-red-500/10">
        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
          <ThumbsDown size={18} /> Areas for Improvement
        </h3>
        <ul className="space-y-2">
          {weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></span>
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MetricsGrid;