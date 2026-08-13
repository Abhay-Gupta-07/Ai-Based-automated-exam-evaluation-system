import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface PerformanceData {
  name: string;
  avgScore: number;
  maxScore: number;
  passRate: number;
}

export const OverviewBarChart: React.FC<{ data: PerformanceData[] }> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="avgScore" name="Avg Score (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="passRate" name="Pass Rate (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PassRatePieChart: React.FC<{ passPct: number }> = ({ passPct }) => {
  const data = [
    { name: 'Passed', value: passPct },
    { name: 'Failed / Needs Improvement', value: Math.max(0, 100 - passPct) },
  ];

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            <Cell fill="#10b981" />
            <Cell fill="#f43f5e" />
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-[-24px] mb-2">
        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{passPct}%</span>
        <span className="block text-xs text-slate-500">Pass Rate</span>
      </div>
    </div>
  );
};

export const QuestionWiseChart: React.FC<{
  data: Array<{ qNo: string; avgMarks: number; maxMarks: number; semanticMatch: number }>;
}> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="qNo" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
          <Legend />
          <Bar dataKey="avgMarks" name="Avg Marks Obtained" fill="#6366f1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="semanticMatch" name="Semantic Match %" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TopicMasteryRadar: React.FC<{
  data: Array<{ topic: string; mastery: number; fullMark: number }>;
}> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Student Mastery %" dataKey="mastery" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ScoreTrendLineChart: React.FC<{
  data: Array<{ date: string; avgScore: number; submissions: number }>;
}> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
          <Legend />
          <Line type="monotone" dataKey="avgScore" name="Avg Score (%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
          <Line type="monotone" dataKey="submissions" name="Submissions" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
