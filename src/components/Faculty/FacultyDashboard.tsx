import React from 'react';
import { Exam, StudentSubmission, EvaluationResult } from '../../types';
import { FileCheck, UploadCloud, Award, BarChart3, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  exams: Exam[];
  submissions: StudentSubmission[];
  evaluations: EvaluationResult[];
  onNavigate: (tab: string) => void;
}

export const FacultyDashboard: React.FC<Props> = ({ exams = [], submissions = [], evaluations = [], onNavigate }) => {
  const pendingSubmissions = (submissions || []).filter((s) => s.status === 'Pending');
  const evaluatedCount = (evaluations || []).length;

  const avgScore = (evaluations || []).length
    ? Math.round(((evaluations || []).reduce((acc, curr) => acc + curr.overallPercentage, 0) / (evaluations || []).length) * 10) / 10
    : 85.0;

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="liquid-glass rounded-2xl p-6 text-slate-900 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100/80 text-indigo-800 border border-indigo-200 uppercase tracking-wider">
            Faculty Evaluation Workspace
          </span>
          <h2 className="text-2xl font-black mt-2 tracking-tight text-slate-900">Automated Exam Examiner</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Create question papers, upload student answer sheets, run semantic evaluations, and review confidence scores.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => onNavigate('fac_exams')}
            className="px-4 py-2 bg-white/80 hover:bg-white text-slate-800 rounded-xl text-xs font-bold border border-white transition shadow-2xs"
          >
            + Create New Exam
          </button>
          <button
            onClick={() => onNavigate('fac_upload')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-500/20"
          >
            Upload Answer Sheets
          </button>
        </div>
      </div>

      {/* Metrics Row - Bento Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Exams</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">{exams.length}</span>
            <span className="text-indigo-700 text-xs font-bold bg-indigo-100/80 px-2 py-1 rounded-md border border-indigo-200/60">
              {exams.length} Total
            </span>
          </div>
        </div>

        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Papers</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">{pendingSubmissions.length}</span>
            <span className="text-amber-800 text-xs font-bold bg-amber-100/80 px-2 py-1 rounded-md border border-amber-200/60">
              Requires Evaluation
            </span>
          </div>
        </div>

        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluated Sheets</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">{evaluatedCount}</span>
            <span className="text-emerald-800 text-xs font-bold bg-emerald-100/80 px-2 py-1 rounded-md border border-emerald-200/60">
              96% Confidence
            </span>
          </div>
        </div>

        <div className="liquid-glass liquid-glass-hover rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Avg Score</span>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-3xl font-black text-slate-900">{avgScore}%</span>
            <span className="text-indigo-700 text-xs font-bold bg-indigo-100/80 px-2 py-1 rounded-md border border-indigo-200/60">
              Mean Performance
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('fac_exams')}
          className="liquid-glass liquid-glass-hover p-5 rounded-2xl cursor-pointer transition group"
        >
          <div className="p-3 bg-indigo-100/80 text-indigo-700 rounded-xl w-fit mb-3 border border-indigo-200/80">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
            <span>1. Exam & Rubric Builder</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Define questions, max marks, model answers, and key concept keywords for semantic matching.
          </p>
        </div>

        <div
          onClick={() => onNavigate('fac_upload')}
          className="liquid-glass liquid-glass-hover p-5 rounded-2xl cursor-pointer transition group"
        >
          <div className="p-3 bg-indigo-100/80 text-indigo-700 rounded-xl w-fit mb-3 border border-indigo-200/80">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
            <span>2. Upload & OCR Processing</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Batch upload student answer sheets (Image/PDF). Extract handwritten text using Vision OCR.
          </p>
        </div>

        <div
          onClick={() => onNavigate('fac_review')}
          className="liquid-glass liquid-glass-hover p-5 rounded-2xl cursor-pointer transition group"
        >
          <div className="p-3 bg-emerald-100/80 text-emerald-800 rounded-xl w-fit mb-3 border border-emerald-200/80">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
            <span>3. Review & Manual Override</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Inspect AI evaluation scores side-by-side, check plagiarism indices, and override marks if needed.
          </p>
        </div>
      </div>

      {/* Recent Evaluations Table Bento Card */}
      <div className="liquid-glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Evaluated Student Papers</h3>
            <p className="text-xs text-slate-500">Recent automated AI scorecards ready for review</p>
          </div>
          <button onClick={() => onNavigate('fac_review')} className="text-xs font-bold text-indigo-600 hover:underline">
            View All in Reviewer →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/60 text-slate-700 font-bold uppercase tracking-wider border-b border-white/80">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Exam Title</th>
                <th className="p-3">Score Obtained</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Faculty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {(evaluations || []).map((e) => (
                <tr key={e.id} className="hover:bg-white/60 transition">
                  <td className="p-3 font-bold text-slate-900">{e.studentName}</td>
                  <td className="p-3 font-mono text-indigo-600 font-bold">{e.studentRollNumber}</td>
                  <td className="p-3">{e.examTitle}</td>
                  <td className="p-3 font-bold text-slate-800">
                    {e.totalObtainedMarks} / {e.totalMarks} ({e.overallPercentage}%)
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      {e.overallConfidenceScore}% AI Conf.
                    </span>
                  </td>
                  <td className="p-3">
                    {e.reviewedByFaculty ? (
                      <span className="text-emerald-700 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reviewed</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold">Pending Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
