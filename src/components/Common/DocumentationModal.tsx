import React, { useState } from 'react';
import { BookOpen, Code, Database, FileText, Cpu, Download, X, Layers, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'arch' | 'flow' | 'db' | 'api' | 'guide'>('readme');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">System Documentation & Technical Specs</h2>
              <p className="text-xs text-slate-400">AI-Based Automated Exam Evaluation System • Full Stack Manual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 border-b border-slate-200 px-6 space-x-2 overflow-x-auto">
          {[
            { id: 'readme', label: 'README', icon: FileText },
            { id: 'arch', label: 'Architecture', icon: Cpu },
            { id: 'flow', label: 'Evaluation Flowchart', icon: Layers },
            { id: 'db', label: 'Database & ER Diagram', icon: Database },
            { id: 'api', label: 'API Specifications', icon: Code },
            { id: 'guide', label: 'Deployment & User Manual', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-700 font-sans text-sm leading-relaxed">
          {activeTab === 'readme' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Project Overview & Objectives</h3>
              <p>
                The <strong>Automated Exam Evaluation System</strong> is an enterprise-grade academic platform built to eliminate manual grading fatigue, standardized evaluation bias, and human error in university exams. Powered by multi-modal OCR and semantic keyphrase extraction, it processes student handwritten or digital submissions in seconds.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-1">🎯 Reduce Faculty Effort</h4>
                  <p className="text-xs text-blue-800">Automates grading for thousands of papers with automated OCR and model answer matching.</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-emerald-900 mb-1">⚡ Instant Feedback</h4>
                  <p className="text-xs text-emerald-800">Students receive immediate granular score breakdowns, strengths, missing concepts, and study links.</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <h4 className="font-bold text-purple-900 mb-1">🔍 Anti-Plagiarism & Audit</h4>
                  <p className="text-xs text-purple-800">Cross-student submission similarity detection, confidence scoring, and manual mark override capability.</p>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-base mt-4">Technology Stack Overview</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Frontend:</strong> React 19, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons</li>
                <li><strong>Backend:</strong> Node.js + Express, TypeScript, Vite Middleware</li>
                <li><strong>Evaluation Engine:</strong> Semantic Matching, Keyphrase Extraction & Rubric Reasoning Engine</li>
                <li><strong>OCR Pipeline:</strong> Vision OCR + Regex Noise Cleaning Engine</li>
                <li><strong>Security & RBAC:</strong> JWT Token Authentication, Audit Logging, Role Guards</li>
              </ul>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2">System Architecture</h3>
              <p>
                The application strictly isolates client browser execution from sensitive backend API credentials using a full-stack Node.js/Express server proxy pattern.
              </p>

              <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-xs overflow-x-auto shadow-inner leading-normal border border-slate-800">
                <pre>{`
 [ STUDENT / FACULTY / ADMIN CLIENT ]
                │
                ├── (React 19 SPA + Recharts UI)
                │
                ▼ REST APIs over HTTP/JSON
 ┌──────────────────────────────────────────────────────────────┐
 │                     EXPRESS BACKEND                          │
 │  - JWT Auth Guard & RBAC Middleware                          │
 │  - Answer Sheet File Handler & Image Pre-processor          │
 │  - Evaluation Engine Orchestrator                           │
 └──────────────┬──────────────────────────────┬────────────────┘
                │                              │
                ▼                              ▼
   ┌───────────────────────────┐  ┌───────────────────────────┐
   │ EVALUATION ENGINE SERVICE │  │   LOCAL / CLOUD STORAGE   │
   │  - Vision OCR Extraction  │  │ - Users & Roles           │
   │  - Semantic Embedding Match│  │ - Exams & Answer Keys     │
   │  - Concept Gap Detection  │  │ - Submissions & Evaluatns │
   │  - Plagiarism Analyzer    │  │ - Audit Logs              │
   └───────────────────────────┘  └───────────────────────────┘
                `}</pre>
              </div>

              <h4 className="font-bold text-slate-900 text-base mt-4">Core Principles</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Zero Credential Exposure:</strong> All execution tasks run strictly inside <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">server.ts</code> securely on the backend server.</li>
                <li><strong>High Availability Fallback:</strong> If network timeouts occur, the evaluation engine gracefully defaults to local heuristic vector token matching so grading never freezes.</li>
              </ol>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2">8-Step Evaluation Pipeline Flowchart</h3>
              
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
                  <div><strong>Student Upload:</strong> PDF / Image / Text answer sheet submitted via web portal.</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
                  <div><strong>OCR Extraction:</strong> Vision OCR transcribes handwritten & printed text into raw transcript.</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</span>
                  <div><strong>Text Cleaning & Tokenization:</strong> Removes OCR noise, normalizes spelling variations and stems words.</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</span>
                  <div><strong>Semantic Embedding Comparison:</strong> Evaluates conceptual alignment with Model Answer (0-100%).</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">5</span>
                  <div><strong>Keyword & Rubric Weighting:</strong> Verifies presence of mandatory technical terms.</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">6</span>
                  <div><strong>Concept Gap & Grammar Check:</strong> Flags missing required concepts and irrelevant fluff.</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">7</span>
                  <div><strong>Weighted Score & Confidence Computation:</strong> Applies 40% Semantic + 30% Keyword + 20% Concept + 10% Grammar weights.</div>
                </div>
                <div className="text-center text-slate-400 font-bold">↓</div>
                <div className="flex items-center space-x-3 bg-emerald-600 text-white p-3 rounded-lg shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold">8</span>
                  <div><strong>Report Generation & Faculty Override:</strong> Generates strengths, weaknesses, study links, and alerts faculty for review.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Database Schema & Relational Tables</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
                  <h4 className="text-blue-400 font-bold mb-2 text-sm">Users Table</h4>
                  <pre>{`
- id: VARCHAR (PK)
- name: VARCHAR
- email: VARCHAR (UNIQUE)
- role: ENUM('Admin','Faculty','Student')
- departmentId: FK -> Departments.id
- createdAt: TIMESTAMP
                  `}</pre>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
                  <h4 className="text-blue-400 font-bold mb-2 text-sm">Exams Table</h4>
                  <pre>{`
- id: VARCHAR (PK)
- title: VARCHAR
- examCode: VARCHAR
- subjectId: FK -> Subjects.id
- date: DATE
- durationMinutes: INT
- totalMarks: INT
- status: ENUM('Draft','Active','Completed')
                  `}</pre>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
                  <h4 className="text-blue-400 font-bold mb-2 text-sm">Questions Table</h4>
                  <pre>{`
- id: VARCHAR (PK)
- examId: FK -> Exams.id
- questionNumber: INT
- questionText: TEXT
- maxMarks: INT
- modelAnswer: TEXT
- keyConcepts: JSON_ARRAY
- markingCriteria: JSON_ARRAY
                  `}</pre>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
                  <h4 className="text-blue-400 font-bold mb-2 text-sm">Evaluations Table</h4>
                  <pre>{`
- id: VARCHAR (PK)
- submissionId: FK -> Submissions.id
- totalObtainedMarks: FLOAT
- overallPercentage: FLOAT
- confidenceScore: INT
- questionEvaluations: JSON_OBJECT
- facultyNotes: TEXT
                  `}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2">REST API Endpoints</h3>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-bold">
                  <tr>
                    <th className="p-2 border">Method</th>
                    <th className="p-2 border">Endpoint</th>
                    <th className="p-2 border">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr><td className="p-2 border text-green-700 font-bold">POST</td><td className="p-2 border">/api/auth/login</td><td className="p-2 border font-sans">Authenticate user & issue JWT token</td></tr>
                  <tr><td className="p-2 border text-blue-700 font-bold">GET</td><td className="p-2 border">/api/exams</td><td className="p-2 border font-sans">Fetch list of available exams</td></tr>
                  <tr><td className="p-2 border text-green-700 font-bold">POST</td><td className="p-2 border">/api/exams</td><td className="p-2 border font-sans">Create exam with question rubrics</td></tr>
                  <tr><td className="p-2 border text-green-700 font-bold">POST</td><td className="p-2 border">/api/ocr/extract</td><td className="p-2 border font-sans">Extract handwritten text from image using Vision OCR</td></tr>
                  <tr><td className="p-2 border text-green-700 font-bold">POST</td><td className="p-2 border">/api/evaluation/evaluate</td><td className="p-2 border font-sans">Execute 8-step evaluation pipeline on submission</td></tr>
                  <tr><td className="p-2 border text-amber-700 font-bold">POST</td><td className="p-2 border">/api/evaluation/override</td><td className="p-2 border font-sans">Faculty manual score override & notes</td></tr>
                  <tr><td className="p-2 border text-blue-700 font-bold">GET</td><td className="p-2 border">/api/analytics/summary</td><td className="p-2 border font-sans">Get global university evaluation analytics</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Deployment & User Manual</h3>
              
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">1. Production Build & Start</h4>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs">
                  <div>npm run build</div>
                  <div>npm start</div>
                </div>

                <h4 className="font-bold text-slate-900 mt-4">2. Role Usage Guide</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border rounded-lg">
                    <strong>Admin Role:</strong> Configure system thresholds, manage departments & faculty, inspect audit logs.
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-lg">
                    <strong>Faculty Role:</strong> Create question papers with model answers, upload student answer sheets, run automated evaluation, review and override marks.
                  </div>
                  <div className="p-3 bg-slate-50 border rounded-lg">
                    <strong>Student Role:</strong> View upcoming exams, submit answer papers, inspect detailed scorecard, view strengths & study topics.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 flex justify-between items-center border-t border-slate-200">
          <span className="text-xs text-slate-500">Version 2.4.0 • Multi-Modal Evaluation Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
