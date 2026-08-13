import React from 'react';
import { ScoreTrendLineChart } from '../Common/Charts';
import { Award, TrendingUp, Calendar, BookOpen } from 'lucide-react';

export const StudentHistory: React.FC = () => {
  const historyData = [
    { date: 'Sem 1', avgScore: 78, submissions: 5 },
    { date: 'Sem 2', avgScore: 81, submissions: 6 },
    { date: 'Sem 3', avgScore: 84, submissions: 6 },
    { date: 'Sem 4', avgScore: 86, submissions: 6 },
    { date: 'Sem 5', avgScore: 89, submissions: 5 },
    { date: 'Sem 6 (Current)', avgScore: 92, submissions: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="liquid-glass p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900">Academic Performance History</h2>
        <p className="text-xs text-slate-500">Historical score progression and semester-wise evaluation trajectory</p>
      </div>

      <div className="liquid-glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Semester Score Growth Trajectory</h3>
            <p className="text-xs text-slate-500">Consistent score improvement across engineering terms</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        <ScoreTrendLineChart data={historyData} />
      </div>
    </div>
  );
};
