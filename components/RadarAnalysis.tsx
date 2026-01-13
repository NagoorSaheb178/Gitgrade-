import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Breakdown {
  codeQuality: number;
  documentation: number;
  testing: number;
  structure: number;
  realWorldUtility: number;
}

interface RadarAnalysisProps {
  breakdown: Breakdown;
}

const RadarAnalysis: React.FC<RadarAnalysisProps> = ({ breakdown }) => {
  const data = [
    { subject: 'Code', A: breakdown.codeQuality, fullMark: 100 },
    { subject: 'Docs', A: breakdown.documentation, fullMark: 100 },
    { subject: 'Testing', A: breakdown.testing, fullMark: 100 },
    { subject: 'Structure', A: breakdown.structure, fullMark: 100 },
    { subject: 'Utility', A: breakdown.realWorldUtility, fullMark: 100 },
  ];

  return (
    <div className="bg-surface rounded-xl p-6 border border-white/5 shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">Performance Dimensions</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#404040" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 11 }} />
            <Radar
              name="Repo"
              dataKey="A"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="#3b82f6"
              fillOpacity={0.3}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={600}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarAnalysis;