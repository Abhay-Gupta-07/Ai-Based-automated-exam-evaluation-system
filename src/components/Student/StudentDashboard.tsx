import React from 'react';
import { Exam, EvaluationResult } from '../../types';
import { generateStudentReportHTML, printOrSaveReportHTML } from '../../utils/exportUtils';
import { GraduationCap, Award, FileCheck2, Printer, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  exams: Exam[];
  evaluations: EvaluationResult[];
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<Props> = ({ exams = [], evaluations = [], onNavigate }) => {
  const studentEvals = (evaluations || []).filter((e) => e.studentId === 'stu_1' || e.studentRollNumber === '2023-CS-018');
  const latestEval = studentEvals[0] || (evaluations || [])[0];

  const handleDownloadPDF = (evalData: EvaluationResult) => {
    const html = generateStudentReportHTML(evalData);
    printOrSaveReportHTML(`Scorecard_${evalData.examTitle.replace(/\s+/g, '_')}`, html);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="liquid-glass rounded-2xl p-6 text-slate-900 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
            Student Academic Portal
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight text-slate-900">Welcome back, Alex Vance</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Roll Number: <span className="font-mono font-bold text-slate-800">2023-CS-018</span> • B.Tech Computer Science (Sem 6)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => onNavigate('stu_reports')}
            className="px-4 py-2 bg-white/80 hover:bg-white text-slate-800 rounded-xl text-xs font-bold border border-white transition shadow-2xs"
          >
            My AI Scorecards
          </button>
          <button
            onClick={() => onNavigate('stu_exams')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/20"
          >
            View Available Exams
          </button>
        </div>
      </div>

      {/* Metrics Row - Bento Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative GPA</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">3.88 / 4.0</span>
            <span className="text-emerald-800 text-xs font-bold bg-emerald-100/80 px-2 py-1 rounded-md border border-emerald-200/60">
              Rank #2
            </span>
          </div>
        </div>

        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluated Sheets</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">{studentEvals.length}</span>
            <span className="text-indigo-700 text-xs font-bold bg-indigo-100/80 px-2 py-1 rounded-md border border-indigo-200/60">
              Term Total
            </span>
          </div>
        </div>

        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Exam Score</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">
              {latestEval ? `${latestEval.overallPercentage}%` : '88%'}
            </span>
            <span className="text-indigo-700 text-xs font-bold bg-indigo-100/80 px-2 py-1 rounded-md border border-indigo-200/60">
              Semantic Match
            </span>
          </div>
        </div>

        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Confidence</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">96% Conf.</span>
            <span className="text-emerald-800 text-xs font-bold bg-emerald-100/80 px-2 py-1 rounded-md border border-emerald-200/60">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Latest Evaluation Spotlight Card */}
      {latestEval && (
        <div className="liquid-glass rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-white/80">
            <div>
              <span className="px-2.5 py-1 bg-indigo-100/80 text-indigo-800 font-mono text-[10px] font-bold rounded-md border border-indigo-200/60">
                LATEST AI SCORECARD
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{latestEval.examTitle}</h3>
              <p className="text-xs text-slate-500">Subject: {latestEval.subjectName}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600">{latestEval.totalObtainedMarks}</span>
                <span className="text-xs text-slate-500"> / {latestEval.totalMarks} Marks</span>
              </div>
              <button
                onClick={() => handleDownloadPDF(latestEval)}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-indigo-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>PDF Report</span>
              </button>
            </div>
          </div>

          {/* AI Feedback Box */}
          <div className="p-4 bg-white/70 text-slate-800 rounded-2xl space-y-2 border border-white/90">
            <span className="text-xs font-bold text-indigo-700 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Personalized AI Tutor Insights</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {latestEval.personalizedFeedback}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onNavigate('stu_reports')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
            >
              <span>View Full Breakdown Scorecard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
