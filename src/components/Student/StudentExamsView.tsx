import React, { useState } from 'react';
import { Exam, EvaluationResult, User } from '../../types';
import { FileCheck2, Clock, Award, BookOpen, ChevronRight, PenTool, CheckCircle2 } from 'lucide-react';
import { TakeExamModal } from './TakeExamModal';

interface Props {
  exams: Exam[];
  evaluations?: EvaluationResult[];
  currentUser?: User;
  onEvaluationComplete?: () => void;
  onNavigate?: (tab: string) => void;
}

export const StudentExamsView: React.FC<Props> = ({
  exams = [],
  evaluations = [],
  currentUser,
  onEvaluationComplete,
  onNavigate,
}) => {
  const [selectedExamForTaking, setSelectedExamForTaking] = useState<Exam | null>(null);

  const studentName = currentUser?.name || 'Alex Vance';
  const studentRollNumber = '2023-CS-018';
  const studentId = currentUser?.id || 'usr_student_1';

  return (
    <div className="space-y-6">
      <div className="liquid-glass p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Active & Upcoming Examinations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Exams assigned for your course and semester. Click "Take Exam" to complete typed answer sheets for real-time automated evaluation.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1.5 whitespace-nowrap">
          <PenTool className="w-3.5 h-3.5" />
          <span>Active Exams Ready: {(exams || []).filter((e) => e.status === 'Active').length}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(exams || []).map((exam) => {
          // Check if student has already evaluated this exam
          const existingEval = (evaluations || []).find(
            (ev) =>
              ev.examId === exam.id &&
              (ev.studentId === studentId || ev.studentRollNumber === studentRollNumber || ev.studentName === studentName)
          );

          return (
            <div
              key={exam.id}
              className="liquid-glass rounded-2xl p-5 space-y-4 hover:border-emerald-500 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded-lg border border-indigo-100">
                      {exam.examCode}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-2">{exam.title}</h3>
                    <p className="text-xs text-slate-500">{exam.subjectName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                      existingEval
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : exam.status === 'Active'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {existingEval ? '✔ Completed' : exam.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/90 rounded-xl text-xs border border-slate-200/80">
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold">Total Marks</span>
                    <span className="font-bold text-slate-900">{exam.totalMarks} Marks</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold">Duration</span>
                    <span className="font-bold text-slate-900">{exam.durationMinutes} Mins</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-semibold">Questions</span>
                    <span className="font-bold text-slate-900">{exam.questions?.length || exam.questionsCount || 0} Items</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block">Question Paper Syllabus Prompts:</span>
                  <ul className="space-y-1 text-slate-500">
                    {(exam.questions || []).map((q, idx) => (
                      <li key={idx} className="line-clamp-1">
                        • Q{q.questionNumber}: {q.questionText} ({q.maxMarks}M)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button Section */}
              <div className="pt-3 border-t border-slate-200">
                {existingEval ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Score: {existingEval.totalObtainedMarks}/{existingEval.totalMarks} ({existingEval.overallPercentage}%)</span>
                    </div>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('stu_reports')}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                      >
                        <span>View Scorecard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedExamForTaking(exam)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Take Active Examination Now</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Take Exam Modal */}
      {selectedExamForTaking && (
        <TakeExamModal
          exam={selectedExamForTaking}
          studentId={studentId}
          studentName={studentName}
          studentRollNumber={studentRollNumber}
          onClose={() => setSelectedExamForTaking(null)}
          onComplete={(evalResult) => {
            if (onEvaluationComplete) {
              onEvaluationComplete();
            }
          }}
        />
      )}
    </div>
  );
};
