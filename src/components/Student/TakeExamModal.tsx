import React, { useState, useEffect } from 'react';
import { Exam, Question, QuestionAnswerSubmission, EvaluationResult } from '../../types';
import { api } from '../../services/api';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  FileText,
  X,
  HelpCircle,
  Award,
  BookOpen,
  Zap,
} from 'lucide-react';

interface Props {
  exam: Exam;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  onClose: () => void;
  onComplete: (result: EvaluationResult) => void;
}

export const TakeExamModal: React.FC<Props> = ({
  exam,
  studentId,
  studentName,
  studentRollNumber,
  onClose,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Student answers state: { [questionId]: string }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Countdown Timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    (exam.durationMinutes || 60) * 60
  );

  // Submission & AI Evaluation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationStage, setEvaluationStage] = useState<string>('');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  // Load Exam Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fullExam = await api.getExamById(exam.id);
        if (fullExam && fullExam.questions && fullExam.questions.length > 0) {
          setQuestions(fullExam.questions);
        } else if (exam.questions && exam.questions.length > 0) {
          setQuestions(exam.questions);
        } else {
          // Fallback sample question if server returns empty array
          setQuestions([
            {
              id: 'q_fallback_1',
              examId: exam.id,
              questionNumber: 1,
              questionText: 'Explain the core principles and architecture relevant to this exam.',
              maxMarks: exam.totalMarks || 20,
              modelAnswer: 'Comprehensive architectural description with key component details.',
              keyConcepts: ['Architecture', 'Implementation', 'Optimization'],
              markingCriteria: [],
              penaltyForGrammar: 0.5,
              penaltyForFluff: 0.5,
            },
          ]);
        }
      } catch (err) {
        console.warn('Error fetching exam details:', err);
        setQuestions(exam.questions || []);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [exam]);

  // Timer Countdown Effect
  useEffect(() => {
    if (evalResult || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [evalResult, isSubmitting]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[activeQuestionIdx];

  const handleAnswerChange = (val: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleQuickFillSample = () => {
    if (!currentQ) return;
    const sampleText = currentQ.modelAnswer
      ? currentQ.modelAnswer
      : `Detailed answer for Q${currentQ.questionNumber}: Covers ${currentQ.keyConcepts.join(', ')} with clear structure, explanation of mechanisms, and appropriate technical terminology.`;

    handleAnswerChange(sampleText);
  };

  const answeredCount = Object.values(answers).filter((a: string) => a && a.trim().length > 0).length;

  const handleSubmitExam = async () => {
    if (answeredCount === 0) {
      if (!confirm('You have not answered any questions yet. Are you sure you want to submit?')) {
        return;
      }
    }

    setIsSubmitting(true);
    setEvaluationStage('Submitting student answer paper to examination database...');

    try {
      // 1. Prepare QuestionAnswerSubmission array
      const qaSubmissions: QuestionAnswerSubmission[] = questions.map((q) => ({
        questionId: q.id,
        questionNumber: q.questionNumber,
        studentAnswerText: answers[q.id] || 'No answer provided.',
      }));

      // 2. Submit Answer Sheet
      const sub = await api.submitAnswerSheet({
        examId: exam.id,
        studentId: studentId || 'stu_1',
        answers: qaSubmissions,
        fileType: 'text',
      });

      // 3. Trigger AI Evaluation Pipeline
      setEvaluationStage('Running Gemini AI multi-modal vision and semantic evaluation pipeline...');
      await new Promise((r) => setTimeout(r, 800));

      setEvaluationStage('Analyzing semantic similarity, keyword matching, and concept gaps...');
      await new Promise((r) => setTimeout(r, 900));

      setEvaluationStage('Calculating marks and generating AI feedback scorecard...');
      const result = await api.triggerEvaluation(sub.id);

      setEvalResult(result);
      onComplete(result);
    } catch (err) {
      console.error('Failed submitting exam:', err);
      alert('An error occurred during AI evaluation submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 overflow-y-auto">
      <div className="liquid-glass rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                {exam.examCode}
              </span>
              <span className="text-xs text-slate-300 font-medium">• {exam.subjectName}</span>
            </div>
            <h2 className="text-lg font-black mt-1 text-white">{exam.title}</h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer Badge */}
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeLeftSeconds < 300
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-amber-300 border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Time Left: {formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Exit Exam"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Evaluation Stage Overlay / Live Result View */}
        {isSubmitting ? (
          <div className="p-12 text-center space-y-6 my-auto">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <Sparkles className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900">
                Automated AI Examination Engine
              </h3>
              <p className="text-xs text-indigo-600 font-semibold animate-pulse">{evaluationStage}</p>
              <p className="text-[11px] text-slate-500">
                Evaluating responses using Gemini AI semantic matching, key concept verification, and automated rubric scoring.
              </p>
            </div>
          </div>
        ) : evalResult ? (
          /* Post-Exam Immediate Scorecard View */
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                AI Evaluation Complete
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Score: {evalResult.totalObtainedMarks} / {evalResult.totalMarks} Marks ({evalResult.overallPercentage}%)
              </h3>
              <div className="flex justify-center items-center space-x-3 text-xs font-semibold text-slate-600">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  {evalResult.overallConfidenceScore}% AI Confidence Score
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-300">
                  {evalResult.overallPlagiarismScore}% Originality Index
                </span>
              </div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Question Wise AI Feedback</h4>
              {evalResult.questionEvaluations.map((q) => (
                <div
                  key={q.questionId}
                  className="bg-white/80 border border-white/90 p-4 rounded-2xl space-y-3"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 text-xs">
                      Question #{q.questionNumber}
                    </span>
                    <span className="font-black text-indigo-600 text-xs">
                      {q.scoreObtained} / {q.maxMarks} Marks
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{q.aiFeedbackText}"</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 border border-emerald-200">
                      <span className="font-bold block mb-1">✔ Highlighted Strengths:</span>
                      <ul className="list-disc pl-3 space-y-0.5">
                        {q.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800 border border-amber-200">
                      <span className="font-bold block mb-1">⚠ Concept Gaps:</span>
                      <ul className="list-disc pl-3 space-y-0.5">
                        {q.missingConcepts.length > 0 ? (
                          q.missingConcepts.map((m, idx) => <li key={idx}>{m}</li>)
                        ) : (
                          <li>None missing - Excellent response!</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-500/20"
              >
                Close & View All Scorecards
              </button>
            </div>
          </div>
        ) : loadingQuestions ? (
          <div className="p-12 text-center text-slate-500 text-xs my-auto">
            Loading examination questions and rubric data...
          </div>
        ) : (
          /* Main Exam Answering Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Sidebar: Question Navigation Pills */}
            <div className="w-full md:w-64 bg-slate-50/80 border-r border-slate-200/80 p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions</span>
                  <span className="text-[11px] font-bold text-indigo-600">
                    {answeredCount} / {questions.length} Answered
                  </span>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] && answers[q.id].trim().length > 0;
                    const isActive = idx === activeQuestionIdx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                          isActive
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : isAnswered
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span>Q{q.questionNumber}</span>
                        {isAnswered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Identity Card */}
              <div className="mt-6 p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Examinee Details</span>
                <span className="font-bold text-slate-900 block">{studentName}</span>
                <span className="font-mono text-indigo-600 font-semibold block">{studentRollNumber}</span>
              </div>
            </div>

            {/* Right Main Area: Current Question & Answer Input Box */}
            {currentQ && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                        Question #{currentQ.questionNumber} of {questions.length}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                        {currentQ.questionText}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 whitespace-nowrap ml-3">
                      Max Marks: {currentQ.maxMarks}
                    </span>
                  </div>

                  {/* Required Concepts Hint Box */}
                  {currentQ.keyConcepts && currentQ.keyConcepts.length > 0 && (
                    <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Core Key Concepts to Include:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {currentQ.keyConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-[11px] font-medium border border-indigo-100"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Input Box */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Type your detailed answer response below:</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleQuickFillSample}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center space-x-1"
                        title="Auto-fill sample model response for testing"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Auto-Fill Sample Answer</span>
                      </button>
                    </div>

                    <textarea
                      rows={8}
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Write your explanation clearly here. Ensure you mention key terms, principles, and structured points for full AI rubric credit..."
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-900 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    />

                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                      <span>
                        Words: {(answers[currentQ.id] || '').trim().split(/\s+/).filter(Boolean).length} | Characters:{' '}
                        {(answers[currentQ.id] || '').length}
                      </span>
                      <span>Graded against semantic match & concept coverage</span>
                    </div>
                  </div>
                </div>

                {/* Question Footer Controls */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    disabled={activeQuestionIdx === 0}
                    onClick={() => setActiveQuestionIdx((prev) => prev - 1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Q</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    {activeQuestionIdx < questions.length - 1 ? (
                      <button
                        onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-indigo-500/20"
                      >
                        <span>Next Q</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitExam}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shadow-md shadow-emerald-500/20"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Exam Paper</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
