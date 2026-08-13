import React, { useState } from 'react';
import { EvaluationResult } from '../../types';
import { printOrSaveReportHTML, generateStudentReportHTML } from '../../utils/exportUtils';
import { Award, CheckCircle2, ShieldAlert, Edit3, Save, Printer, ArrowLeft, ChevronRight, Eye } from 'lucide-react';

interface Props {
  evaluations: EvaluationResult[];
  onOverrideMarks: (data: { evaluationId: string; questionId: string; overrideScore: number; facultyNotes?: string }) => void;
}

export const EvaluationReviewer: React.FC<Props> = ({ evaluations = [], onOverrideMarks }) => {
  const [selectedEvalId, setSelectedEvalId] = useState<string>((evaluations || [])[0]?.id || '');
  const [overrideScores, setOverrideScores] = useState<Record<string, number>>({});
  const [facultyNotes, setFacultyNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeEval = (evaluations || []).find((e) => e.id === selectedEvalId) || (evaluations || [])[0];

  if (!activeEval) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h3 className="font-bold text-slate-700 dark:text-slate-200">No Evaluated Submissions Yet</h3>
        <p className="text-xs text-slate-500 mt-1">Upload answer sheets to trigger automated AI evaluation.</p>
      </div>
    );
  }

  const handleSaveOverride = (questionId: string) => {
    const newScore = overrideScores[questionId];
    if (newScore === undefined) return;
    onOverrideMarks({
      evaluationId: activeEval.id,
      questionId,
      overrideScore: newScore,
      facultyNotes,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportPDF = () => {
    const html = generateStudentReportHTML(activeEval);
    printOrSaveReportHTML(`Scorecard_${activeEval.studentRollNumber}`, html);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Paper Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Evaluation Score Reviewer</h2>
          <p className="text-xs text-slate-500">Inspect side-by-side OCR transcripts vs model answers, override marks, and verify plagiarism</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={activeEval.id}
            onChange={(e) => setSelectedEvalId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/80 bg-white/70 text-xs font-bold text-slate-800 flex-1 md:w-64"
          >
            {(evaluations || []).map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.studentName} ({ev.studentRollNumber}) - {ev.totalObtainedMarks}/{ev.totalMarks}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Export Scorecard</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100/90 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Faculty mark override saved successfully! Score updated.</span>
        </div>
      )}

      {/* Main Side-by-Side Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Student Answer Paper & Transcribed OCR Text (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="liquid-glass rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/80">
              <div>
                <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase">{activeEval.studentRollNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">{activeEval.studentName}</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg">
                {activeEval.overallPercentage}% Score
              </span>
            </div>

            {/* Answer Sheet Image Preview */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase">Uploaded Answer Sheet Image</span>
              <div className="rounded-xl overflow-hidden border border-white/90 bg-slate-100 max-h-56 relative group">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
                  alt="Student Answer Sheet"
                  className="w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs">
                  View Full Resolution OCR Scan
                </div>
              </div>
            </div>

            {/* Transcribed Text */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase">Extracted OCR Text</span>
              <div className="p-3 bg-white/70 rounded-xl text-xs font-sans text-slate-700 leading-relaxed max-h-48 overflow-y-auto border border-white/90">
                {activeEval.questionEvaluations[0]?.aiFeedbackText || 'OCR transcript available.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: AI Score Breakdown & Faculty Override Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Metrics Summary Bar */}
          <div className="grid grid-cols-3 gap-3 liquid-glass p-4 rounded-2xl">
            <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-center">
              <span className="block text-[10px] text-slate-500 font-semibold">Total Obtained</span>
              <span className="text-xl font-extrabold text-indigo-700">
                {activeEval.totalObtainedMarks} <span className="text-xs text-slate-400">/ {activeEval.totalMarks}</span>
              </span>
            </div>
            <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl text-center">
              <span className="block text-[10px] text-slate-500 font-semibold">AI Confidence</span>
              <span className="text-xl font-extrabold text-emerald-700">
                {activeEval.overallConfidenceScore}%
              </span>
            </div>
            <div className="p-3 bg-purple-50/80 border border-purple-100 rounded-xl text-center">
              <span className="block text-[10px] text-slate-500 font-semibold">Plagiarism Index</span>
              <span className="text-xl font-extrabold text-purple-700">
                {activeEval.overallPlagiarismScore}% Match
              </span>
            </div>
          </div>

          {/* Question-wise Evaluation Breakdown */}
          <div className="space-y-4">
            {(activeEval.questionEvaluations || []).map((q) => {
              const currentScore = overrideScores[q.questionId] !== undefined ? overrideScores[q.questionId] : q.scoreObtained;

              return (
                <div
                  key={q.questionId}
                  className="liquid-glass rounded-2xl p-5 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/80 pb-3">
                    <span className="font-bold text-slate-900 text-sm">Question #{q.questionNumber} Evaluation</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-semibold">Score:</span>
                      <input
                        type="number"
                        step="0.5"
                        max={q.maxMarks}
                        min="0"
                        value={currentScore}
                        onChange={(e) =>
                          setOverrideScores({
                            ...overrideScores,
                            [q.questionId]: Number(e.target.value),
                          })
                        }
                        className="w-16 px-2 py-1 border border-white/90 rounded-lg text-xs font-bold text-center bg-white/80 text-slate-900"
                      />
                      <span className="text-xs text-slate-500">/ {q.maxMarks}</span>
                      <button
                        onClick={() => handleSaveOverride(q.questionId)}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        title="Save score override"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-Score Metrics Progress Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-white/70 rounded-xl border border-white/90">
                      <span className="block text-[10px] text-slate-500">Semantic Match</span>
                      <span className="font-bold text-indigo-600">{q.semanticSimilarityScore}%</span>
                    </div>
                    <div className="p-2 bg-white/70 rounded-xl border border-white/90">
                      <span className="block text-[10px] text-slate-500">Keywords Score</span>
                      <span className="font-bold text-purple-600">{q.keywordMatchScore}%</span>
                    </div>
                    <div className="p-2 bg-white/70 rounded-xl border border-white/90">
                      <span className="block text-[10px] text-slate-500">Concept Coverage</span>
                      <span className="font-bold text-emerald-600">{q.conceptCoverageScore}%</span>
                    </div>
                    <div className="p-2 bg-white/70 rounded-xl border border-white/90">
                      <span className="block text-[10px] text-slate-500">Grammar Score</span>
                      <span className="font-bold text-indigo-600">{q.grammarScore}%</span>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1">
                      <span className="font-bold text-emerald-800 block">✔ Highlighted Strengths</span>
                      <ul className="list-disc pl-4 text-emerald-700 space-y-0.5">
                        {(q.strengths || []).map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl space-y-1">
                      <span className="font-bold text-rose-800 block">✖ Missing Concepts</span>
                      <ul className="list-disc pl-4 text-rose-700 space-y-0.5">
                        {(q.missingConcepts || []).length > 0 ? (
                          (q.missingConcepts || []).map((m, idx) => <li key={idx}>{m}</li>)
                        ) : (
                          <li>None missing</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-white/70 rounded-xl text-xs text-slate-600 italic border border-white/80">
                    "{q.aiFeedbackText}"
                  </div>
                </div>
              );
            })}
          </div>

          {/* Faculty Review Notes */}
          <div className="liquid-glass rounded-2xl p-5 space-y-3">
            <label className="block font-bold text-slate-900 text-xs">
              Append Official Faculty Reviewer Notes
            </label>
            <textarea
              rows={2}
              value={facultyNotes}
              onChange={(e) => setFacultyNotes(e.target.value)}
              placeholder="Add final examiner notes or remarks for the student..."
              className="w-full p-3 rounded-xl border border-white/90 bg-white/70 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
