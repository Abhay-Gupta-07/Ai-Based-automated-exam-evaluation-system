import React, { useState } from 'react';
import { Exam, Subject, Question } from '../../types';
import { FileCheck2, Plus, Trash2, Save, X, BookOpen, CheckCircle2 } from 'lucide-react';

interface Props {
  exams: Exam[];
  subjects: Subject[];
  onCreateExam: (examData: any) => void;
}

export const ExamManager: React.FC<Props> = ({ exams = [], subjects = [], onCreateExam }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [examCode, setExamCode] = useState('');
  const [subjectId, setSubjectId] = useState((subjects || [])[0]?.id || 'sub_nlp');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [totalMarks, setTotalMarks] = useState(20);

  const [questions, setQuestions] = useState<
    Array<{
      questionText: string;
      maxMarks: number;
      modelAnswer: string;
      keyConceptsStr: string;
      markingCriteriaStr: string;
    }>
  >([
    {
      questionText: 'Explain Self-Attention and Multi-Head Attention in Transformer architectures.',
      maxMarks: 10,
      modelAnswer: 'Self-Attention measures token relations regardless of positional distance. Multi-Head Attention projects input embeddings across multiple linear heads in parallel.',
      keyConceptsStr: 'Self-Attention, Multi-Head Attention, Positional Encoding',
      markingCriteriaStr: 'Self-Attention:2.5, Multi-Head:2.5, Positional:2.0',
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        maxMarks: 10,
        modelAnswer: '',
        keyConceptsStr: '',
        markingCriteriaStr: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const formattedQuestions = questions.map((q, idx) => ({
      questionNumber: idx + 1,
      questionText: q.questionText,
      maxMarks: Number(q.maxMarks) || 10,
      modelAnswer: q.modelAnswer,
      keyConcepts: q.keyConceptsStr.split(',').map((s) => s.trim()).filter(Boolean),
      markingCriteria: q.markingCriteriaStr
        .split(',')
        .map((item) => {
          const [kw, w] = item.split(':');
          return { keyword: kw?.trim() || 'Concept', weight: Number(w) || 2.0, required: true };
        })
        .filter((c) => c.keyword),
    }));

    onCreateExam({
      title,
      examCode: examCode || `EXAM-${Math.floor(Math.random() * 9000 + 1000)}`,
      subjectId,
      durationMinutes,
      totalMarks: formattedQuestions.reduce((acc, q) => acc + q.maxMarks, 0),
      questions: formattedQuestions,
    });

    setShowCreateModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Exam Papers & Model Answer Rubrics</h2>
          <p className="text-xs text-slate-500">Configure questions, marking criteria, and expected model answers for AI grading</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Exam Paper</span>
        </button>
      </div>

      {/* Exam Papers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(exams || []).map((exam) => (
          <div
            key={exam.id}
            className="liquid-glass rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-xs rounded-lg">
                  {exam.examCode}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-2">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{exam.subjectName}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  exam.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {exam.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/90 rounded-xl text-xs text-slate-700 border border-slate-200/80">
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Total Marks</span>
                <span className="font-bold text-slate-900">{exam.totalMarks} Marks</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Duration</span>
                <span className="font-bold text-slate-900">{exam.durationMinutes} Mins</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Evaluated</span>
                <span className="font-bold text-blue-600">{exam.evaluatedSubmissionsCount} Papers</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Create Exam & Model Answer Rubric</h3>
                <p className="text-xs text-slate-300">Define expected model responses & key concepts for rubric evaluation</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-300 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mid-Term Examination: Computer Networks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Code</label>
                  <input
                    type="text"
                    placeholder="e.g. EXAM-CN-2025"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {(subjects || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">Question Paper Rubric ({questions.length} Questions)</h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition"
                  >
                    + Add Question
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">Question #{idx + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-rose-500 hover:text-rose-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block font-semibold mb-1 text-slate-700">Question Prompt</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Explain TCP 3-way handshake mechanism."
                          value={q.questionText}
                          onChange={(e) => {
                            const newQ = [...questions];
                            newQ[idx].questionText = e.target.value;
                            setQuestions(newQ);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-slate-700">Max Marks</label>
                        <input
                          type="number"
                          value={q.maxMarks}
                          onChange={(e) => {
                            const newQ = [...questions];
                            newQ[idx].maxMarks = Number(e.target.value);
                            setQuestions(newQ);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Expected Model Answer (Gold Standard)</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Provide expected solution, key definitions, and steps..."
                        value={q.modelAnswer}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[idx].modelAnswer = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">
                        Key Concepts (Comma Separated)
                      </label>
                      <input
                        type="text"
                        placeholder="SYN, SYN-ACK, ACK, Sequence Numbers"
                        value={q.keyConceptsStr}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[idx].keyConceptsStr = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-md shadow-blue-500/20"
                >
                  Save Exam Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
