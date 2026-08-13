import React from 'react';
import { AnalyticsSummary, AuditLog } from '../../types';
import { Users, GraduationCap, FileCheck, CheckCircle2, Clock, Award, ShieldAlert, TrendingUp } from 'lucide-react';
import { OverviewBarChart, PassRatePieChart, ScoreTrendLineChart } from '../Common/Charts';

interface Props {
  analytics: AnalyticsSummary;
  auditLogs: AuditLog[];
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ analytics, auditLogs, onNavigate }) => {
  const statCards = [
    { title: 'Total Students', value: analytics.totalStudents.toLocaleString(), icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900', trend: '+12% vs LY' },
    { title: 'Total Faculty', value: analytics.totalFaculty.toString(), icon: Users, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900', trend: '48 Active' },
    { title: 'Exams Created', value: analytics.totalExams.toString(), icon: FileCheck, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900', trend: '34 Completed' },
    { title: 'Evaluated Papers', value: analytics.evaluatedPapers.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900', trend: '96% AI Conf.' },
    { title: 'Pending Papers', value: analytics.pendingPapers.toString(), icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900', trend: 'In Queue' },
    { title: 'Average Score', value: `${analytics.averageScore}%`, icon: Award, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900', trend: 'High Performance' },
  ];

  const deptData = [
    { name: 'Computer Science', avgScore: 82.4, maxScore: 98, passRate: 94.2 },
    { name: 'Artificial Intelligence', avgScore: 85.1, maxScore: 99, passRate: 96.0 },
    { name: 'Electronics & Comm.', avgScore: 76.8, maxScore: 94, passRate: 88.5 },
    { name: 'Mechanical Engineering', avgScore: 71.2, maxScore: 91, passRate: 84.0 },
  ];

  const trendData = [
    { date: 'Jul 15', avgScore: 74, submissions: 120 },
    { date: 'Jul 18', avgScore: 78, submissions: 240 },
    { date: 'Jul 20', avgScore: 82, submissions: 480 },
    { date: 'Jul 22', avgScore: 79, submissions: 310 },
    { date: 'Jul 25', avgScore: 84, submissions: 520 },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="liquid-glass rounded-2xl p-6 text-slate-900 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100/80 text-indigo-800 border border-indigo-200 uppercase tracking-wider">
            System Executive Dashboard
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight text-slate-900">Evaluation Overview</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Real-time evaluation metrics, multi-modal OCR text pipeline status, and academic department analytics.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => onNavigate('admin_settings')}
            className="px-4 py-2 bg-white/80 hover:bg-white text-slate-800 rounded-xl text-xs font-bold border border-white transition shadow-2xs"
          >
            System Settings
          </button>
          <button
            onClick={() => onNavigate('admin_depts')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/20"
          >
            Manage Departments
          </button>
        </div>
      </div>

      {/* Metric Cards Grid - Bento Box Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="liquid-glass liquid-glass-hover rounded-2xl p-4 flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</span>
                <span className="text-emerald-700 text-[10px] font-bold bg-emerald-100/80 px-2 py-1 rounded-md tracking-tight border border-emerald-200/60">
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Model Status Hero Bento Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 bg-indigo-600/90 backdrop-blur-md rounded-2xl p-5 text-white shadow-md shadow-indigo-500/10 border border-indigo-400/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-90 uppercase tracking-wider">AI Evaluation Model Engine</span>
            <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-extrabold rounded-full backdrop-blur-sm border border-white/20">
              98.4% Avg Accuracy
            </span>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold">Gemini 3.6 Flash Active</h3>
              </div>
              <p className="text-xs text-indigo-100 mt-1">
                Multi-modal OCR vision extraction & rubric-guided semantic evaluation active across all departments.
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin_settings')}
              className="px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition shrink-0 shadow-2xs"
            >
              Configure Thresholds
            </button>
          </div>
        </div>

        <div className="md:col-span-4 liquid-glass rounded-2xl p-5 text-slate-900 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Confidence</span>
          <div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-slate-900">0.962</span>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 border border-emerald-200/80 px-2 py-0.5 rounded-full">Verified</span>
            </div>
            <div className="w-full h-2 bg-white/80 rounded-full mt-2 overflow-hidden border border-white/90">
              <div className="w-[96%] h-full bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview Bar Chart */}
        <div className="lg:col-span-2 liquid-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Department Performance</h3>
              <p className="text-xs text-slate-500">Average Score (%) vs Pass Rate across engineering branches</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50/90 px-2.5 py-1 rounded-lg border border-indigo-200/60">
              Live Data
            </span>
          </div>
          <OverviewBarChart data={deptData} />
        </div>

        {/* Pass Percentage Pie Chart */}
        <div className="liquid-glass rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Overall Pass Percentage</h3>
            <p className="text-xs text-slate-500">Evaluated papers exceeding pass threshold</p>
          </div>
          <PassRatePieChart passPct={analytics.passPercentage} />
          <div className="text-center pt-2 border-t border-white/60 text-xs text-slate-500">
            Pass Threshold: <span className="font-bold text-slate-800">40% Total Marks</span>
          </div>
        </div>
      </div>

      {/* Score Trend & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Line */}
        <div className="liquid-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Evaluation Volume & Score Trend</h3>
              <p className="text-xs text-slate-500">Submissions volume vs average AI score over time</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <ScoreTrendLineChart data={trendData} />
        </div>

        {/* Recent Audit Logs */}
        <div className="liquid-glass rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base">System Audit Trail</h3>
              <button
                onClick={() => onNavigate('admin_logs')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View All Logs →
              </button>
            </div>
            <div className="space-y-2.5">
              {auditLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-white/60 rounded-xl border border-white/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-indigo-600 font-mono text-[10px] font-bold">{log.action}</div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/60 text-xs text-slate-500 flex justify-between items-center">
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
              <span>Security Guard: Active</span>
            </span>
            <span>IP Logging Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
