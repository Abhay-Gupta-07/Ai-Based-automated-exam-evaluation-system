import React from 'react';
import { UserRole } from '../types';
import { AppLogo } from './Common/AppLogo';
import { ParticlesBackground } from './Common/ParticlesBackground';
import {
  Shield,
  UserCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3,
  BookOpen,
  FileCheck,
  Zap,
  Globe,
  Layers,
  Award,
  ChevronRight,
  LogIn,
  GraduationCap,
} from 'lucide-react';

interface Props {
  onOpenPortalLogin: (role?: UserRole) => void;
  onOpenDocs: () => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenPortalLogin, onOpenDocs }) => {
  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* 3D WebGL Particle Background */}
      <ParticlesBackground />

      {/* Subtle Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/80 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top Left Logo & Brand */}
          <AppLogo size="md" theme="light" showTagline={true} />

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-700">
            <a href="#features" className="hover:text-indigo-600 transition">Platform Features</a>
            <a href="#ai-engine" className="hover:text-indigo-600 transition">AI Gemini Engine</a>
            <a href="#portals" className="hover:text-indigo-600 transition">Academic Portals</a>
            <button onClick={onOpenDocs} className="hover:text-indigo-600 transition flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Docs & Specs</span>
            </button>
          </nav>

          {/* Right Action CTA: Primary Sign In Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onOpenPortalLogin('Admin')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center space-x-2 border border-white/40 group hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center z-10 flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full liquid-glass-pill text-indigo-700 text-xs font-extrabold mb-6 shadow-sm border border-indigo-200/60">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Powered by Gemini AI Evaluation Model & Automated Rubrics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl">
          Automated Examination & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">AI Evaluation Platform</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
          Transform university answer sheet grading with instant AI rubric scoring, anti-plagiarism verification, transparent feedback, and complete multi-portal governance.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => onOpenPortalLogin('Admin')}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/25 transition flex items-center justify-center space-x-3 border border-indigo-400/30 hover:scale-[1.02]"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In to Academic Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#portals"
            className="w-full sm:w-auto px-6 py-4 liquid-glass hover:bg-white/90 text-slate-800 font-bold text-sm rounded-2xl transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>Explore Academic Roles</span>
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          </a>
        </div>

        {/* Live Interactive Evaluation Preview Card in Liquid Glass */}
        <div className="mt-14 w-full max-w-4xl liquid-glass rounded-3xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                Live AI Evaluation Engine Demo
              </span>
            </div>
            <span className="px-3 py-1 bg-indigo-100/80 text-indigo-800 border border-indigo-200 rounded-lg text-[11px] font-mono font-extrabold">
              Gemini AI • Confidence: 98.4%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Answer Input */}
            <div className="space-y-3 bg-white/80 p-4 rounded-2xl border border-white/90 shadow-sm">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Student Answer Sheet (CS2023-042)</span>
                <span className="text-indigo-600 font-extrabold">Question #3 (Max 10 Marks)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-mono bg-slate-50/90 p-3 rounded-xl border border-slate-200">
                "Supervised learning trains models on labeled datasets containing input-output pairs, whereas unsupervised learning finds hidden patterns or clusters in unlabeled data..."
              </p>
            </div>

            {/* AI Rubric Feedback */}
            <div className="space-y-3 bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex justify-between text-xs font-bold text-indigo-900">
                <span>AI Rubric Evaluation</span>
                <span className="text-emerald-600 font-black text-sm">Score: 9.5 / 10</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accurate distinction between labeled and unlabeled training datasets.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Included relevant examples (Classification vs Clustering).</span>
                </div>
                <div className="p-2.5 bg-amber-50/90 rounded-lg text-[11px] text-amber-900 border border-amber-200/80 font-medium">
                  ⚡ Feedback: Minor formatting omission on mathematical loss functions (-0.5).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Academic Portals Gateway Section */}
      <section id="portals" className="py-20 px-4 sm:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Select Your Academic Portal
            </h2>
            <p className="text-sm font-medium text-slate-600">
              Dedicated interfaces tailored specifically for University Administrators, Faculty Evaluators, and Students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Portal Card */}
            <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-fuchsia-400/60 transition group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 border border-fuchsia-400/40 flex items-center justify-center font-bold shadow-sm neon-glow-purple">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:neon-text-purple transition">
                    Administrator Portal
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    Full academic control. Manage departments, issue faculty credentials, approve student registration requests, and inspect audit logs.
                  </p>
                </div>

                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-500 shrink-0" />
                    <span>Student Registration Approval System</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-500 shrink-0" />
                    <span>Faculty Credentials Management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-500 shrink-0" />
                    <span>System Audit & Compliance Logs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPortalLogin('Admin')}
                className="w-full py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-fuchsia-500/30 hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition flex items-center justify-center space-x-2 border border-fuchsia-300/50 hover:scale-[1.02]"
              >
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Faculty Evaluator Portal Card */}
            <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-cyan-400/60 transition group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 border border-cyan-400/40 flex items-center justify-center font-bold shadow-sm neon-glow-blue">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:neon-text-blue transition">
                    Faculty Evaluator Portal
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    Create exam question papers, set evaluation rubrics, upload student answer sheets, and review Gemini AI automated grading.
                  </p>
                </div>

                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Automated AI Script Grading</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Plagiarism & Similarity Checks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>Manual Override & Grade Approval</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPortalLogin('Faculty')}
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-400/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition flex items-center justify-center space-x-2 border border-cyan-200 hover:scale-[1.02]"
              >
                <span>Sign In to Faculty Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Student Exam Portal Card */}
            <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-400/60 transition group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-400/40 flex items-center justify-center font-bold shadow-sm neon-glow-green">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:neon-text-green transition">
                    Student Exam Portal
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    Submit exam answers online, request account creation, view detailed AI scorecards, and review question-by-question feedback.
                  </p>
                </div>

                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Interactive Online Examination</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Transparent AI Scorecards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Student Registration & Status</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenPortalLogin('Student')}
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-400/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition flex items-center justify-center space-x-2 border border-emerald-200 hover:scale-[1.02]"
              >
                <span>Sign In to Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features & Technology Highlights */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Built for Academic Precision & Speed
          </h2>
          <p className="text-sm font-medium text-slate-600">
            Advanced features designed to streamline university grading workflows while maintaining institutional integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 liquid-glass liquid-glass-hover rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Gemini Rubric Scoring</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Leverages AI to grade complex subjective answer scripts line-by-line according to custom faculty rubrics with strict accuracy.
            </p>
          </div>

          <div className="p-6 liquid-glass liquid-glass-hover rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Anti-Plagiarism Engine</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Detects peer-to-peer similarities and web copy-paste flags with detailed percentage breakdowns and matched sources.
            </p>
          </div>

          <div className="p-6 liquid-glass liquid-glass-hover rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Analytical Grade Reports</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Generates class performance heatmaps, mean/median score distribution graphs, and pass rate analytics instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Key Statistics Banner */}
      <section className="py-12 liquid-glass border-y border-white/80 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">99.4%</div>
            <div className="text-xs text-slate-600 mt-1 font-bold uppercase tracking-wider">Evaluation Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 font-mono">&lt; 3.2s</div>
            <div className="text-xs text-slate-600 mt-1 font-bold uppercase tracking-wider">Avg Script Evaluation</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-600 font-mono">100%</div>
            <div className="text-xs text-slate-600 mt-1 font-bold uppercase tracking-wider">Audit Governance</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">3-Tier</div>
            <div className="text-xs text-slate-600 mt-1 font-bold uppercase tracking-wider">Multi-Portal Security</div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-8 bg-white/60 backdrop-blur-md border-t border-white/80 px-4 sm:px-8 text-xs text-slate-600 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <AppLogo size="sm" theme="light" />
            <span>•</span>
            <span>Automated Exam Evaluation Engine</span>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => onOpenPortalLogin('Admin')} className="hover:text-indigo-600 font-bold transition">
              Sign In to Portal
            </button>
            <button onClick={onOpenDocs} className="hover:text-indigo-600 font-bold transition">
              Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

