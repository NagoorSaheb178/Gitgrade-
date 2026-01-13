import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Trophy, Award, Medal, Star } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  grade: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  summary: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, grade, summary }) => {
  const data = [{ name: 'Score', value: score, fill: '#8b5cf6' }];

  const getGradeIcon = () => {
    switch (grade) {
      case 'Platinum': return <Trophy className="w-8 h-8 text-cyan-400" />;
      case 'Gold': return <Medal className="w-8 h-8 text-yellow-400" />;
      case 'Silver': return <Award className="w-8 h-8 text-gray-300" />;
      default: return <Star className="w-8 h-8 text-orange-400" />;
    }
  };

  const getGradeColor = () => {
    switch (grade) {
      case 'Platinum': return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10';
      case 'Gold': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'Silver': return 'text-gray-300 border-gray-300/20 bg-gray-300/10';
      default: return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-white/5 shadow-xl relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            {getGradeIcon()}
        </div>
      <div className="flex flex-col md:flex-row items-center gap-8 h-full">
        {/* Radial Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
                innerRadius="80%" 
                outerRadius="100%" 
                barSize={10} 
                data={data} 
                startAngle={90} 
                endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar 
                background 
                clockWise 
                dataKey="value" 
                cornerRadius={10}
                animationDuration={1500}
                animationBegin={400}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white tabular-nums">{score}</span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border mb-4 ${getGradeColor()}`}>
            {getGradeIcon()}
            <span>{grade} Badge</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Analysis Summary</h2>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;