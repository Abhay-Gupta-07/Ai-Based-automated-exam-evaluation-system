import React, { useState } from 'react';
import { EvaluationResult } from '../../types';
import { generateStudentReportHTML, printOrSaveReportHTML } from '../../utils/exportUtils';
import { Award, Printer, CheckCircle2, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface Props {
  evaluations: EvaluationResult[];
}

export const StudentScorecards: React.FC<Props> = ({ evaluations = [] }) => {
  const [selectedId, setSelectedId] = useState<string>((evaluations || [])[0]?.id || '');
  const activeEval = (evaluations || []).find((e) => e.id === selectedId) || (evaluations || [])[0];

  if (!activeEval) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h3 className="font-bold text-slate-700 dark:text-slate-200">No Scorecards Released Yet</h3>
        <p className="text-xs text-slate-500 mt-1">Evaluations will appear here once published by faculty.</p>
      </div>
    );
  }

  const handleExportPDF = () => {
    const html = generateStudentReportHTML(activeEval);
    printOrSaveReportHTML(`Scorecard_${(activeEval.examCode || activeEval.examTitle).replace(/\s+/g, '_')}`, html);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Detailed AI Evaluation Scorecard</h2>
          <p className="text-xs text-slate-500">In-depth breakdown of semantic similarity, missing concepts, and AI feedback</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={activeEval.id}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/80 bg-white/80 text-xs font-bold text-slate-800"
          >
            {(evaluations || []).map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.examTitle} ({ev.totalObtainedMarks}/{ev.totalMarks})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Header Summary */}
      <div className="liquid-glass rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/80 pb-4">
          <div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono rounded">
              {activeEval.examCode || 'EXAM-NLP-2025-A'}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{activeEval.examTitle}</h3>
            <p className="text-xs text-slate-500">{activeEval.subjectName} • Evaluated by {activeEval.facultyName}</p>
          </div>
          <div className="text-right bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
            <span className="block text-xs font-semibold text-emerald-800">Total Score</span>
            <span className="text-3xl font-black text-emerald-600">{activeEval.totalObtainedMarks}</span>
            <span className="text-xs text-slate-400"> / {activeEval.totalMarks} ({activeEval.overallPercentage}%)</span>
          </div>
        </div>

        {/* Personalized AI Tutor Feedback */}
        <div className="p-4 bg-white/70 rounded-2xl border border-white/90 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-xs text-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>AI Automated Feedback & Study Guidance</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeEval.personalizedFeedback}
          </p>
        </div>
      </div>

      {/* Question Wise Cards */}
      <div className="space-y-4">
        {(activeEval.questionEvaluations || []).map((q) => (
          <div
            key={q.questionId}
            className="liquid-glass rounded-2xl p-5 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-white/80 pb-3">
              <span className="font-bold text-slate-900 text-sm">Question #{q.questionNumber} Analysis</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                Score: {q.scoreObtained} / {q.maxMarks} Marks
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-white/70 rounded-xl border border-white/90">
                <span className="block text-[10px] text-slate-400">Semantic Match</span>
                <span className="font-bold text-blue-600">{q.semanticSimilarityScore}%</span>
              </div>
              <div className="p-2.5 bg-white/70 rounded-xl border border-white/90">
                <span className="block text-[10px] text-slate-400">Keywords Matched</span>
                <span className="font-bold text-purple-600">{q.keywordMatchScore}%</span>
              </div>
              <div className="p-2.5 bg-white/70 rounded-xl border border-white/90">
                <span className="block text-[10px] text-slate-400">Concept Coverage</span>
                <span className="font-bold text-emerald-600">{q.conceptCoverageScore}%</span>
              </div>
              <div className="p-2.5 bg-white/70 rounded-xl border border-white/90">
                <span className="block text-[10px] text-slate-400">Grammar Coherence</span>
                <span className="font-bold text-indigo-600">{q.grammarScore}%</span>
              </div>
            </div>

            {/* Strengths & Missing Concepts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 block">✔ Highlighted Key Points</span>
                <ul className="list-disc pl-4 text-emerald-700 space-y-0.5">
                  {(q.strengths || []).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1">
                <span className="font-bold text-amber-800 block">⚠ Concept Gaps Identified</span>
                <ul className="list-disc pl-4 text-amber-700 space-y-0.5">
                  {(q.missingConcepts || []).length > 0 ? (
                    (q.missingConcepts || []).map((m, idx) => <li key={idx}>{m}</li>)
                  ) : (
                    <li>No concept gaps detected! Excellent answer.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-white/70 rounded-xl text-xs text-slate-600 italic border border-white/80">
              "{q.aiFeedbackText}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
