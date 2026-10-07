import React, { useState } from 'react';
import { UserRole, User, FacultyMember, StudentMember } from '../../types';
import { api } from '../../services/api';
import { AppLogo } from '../Common/AppLogo';
import { ParticlesBackground } from '../Common/ParticlesBackground';
import {
  Shield,
  UserCheck,
  GraduationCap,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Key,
  Clock,
  Building2,
} from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User, role: UserRole, extra?: { faculty?: FacultyMember; student?: StudentMember }) => void;
  onBackToLanding?: () => void;
  initialPortal?: UserRole;
}

export const PortalLogin: React.FC<Props> = ({ onLoginSuccess, onBackToLanding, initialPortal = 'Admin' }) => {
  const [activePortal, setActivePortal] = useState<UserRole>(initialPortal);

  // Form inputs
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  // Student Register inputs
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');
  const [regFullName, setRegFullName] = useState('');
  const [regRollNumber, setRegRollNumber] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCourseName, setRegCourseName] = useState('B.Tech Computer Science & Engineering');
  const [regPassword, setRegPassword] = useState('student123');

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePortalSwitch = (portal: UserRole) => {
    setActivePortal(portal);
    setErrorMsg('');
    setSuccessMsg('');

    if (portal === 'Admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (portal === 'Faculty') {
      setUsername('EMP-9021');
      setPassword('faculty123');
    } else if (portal === 'Student') {
      setUsername('CS2023-042');
      setPassword('student123');
      setStudentMode('login');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.portalLogin({
        portalRole: activePortal,
        username,
        password,
      });

      if (res.success && res.user) {
        onLoginSuccess(res.user, activePortal, { faculty: res.faculty, student: res.student });
      } else {
        setErrorMsg('Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!regFullName.trim() || !regRollNumber.trim()) {
      setErrorMsg('Full Name and Roll Number are required to request an account.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.registerStudent({
        fullName: regFullName,
        rollNumber: regRollNumber,
        email: regEmail,
        courseName: regCourseName,
        password: regPassword,
      });

      setSuccessMsg(
        `Account request for ${res.student.name} (Roll No: ${res.student.rollNumber}) submitted successfully! Your account is now PENDING Admin approval. Once approved by Admin, you can log in with your Roll Number.`
      );
      setStudentMode('login');
      setUsername(res.student.rollNumber);
      setPassword(regPassword || 'student123');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit student registration request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* 3D WebGL Particle Background */}
      <ParticlesBackground />

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Brand Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/80 bg-white/60 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="p-2.5 rounded-xl liquid-glass text-slate-800 hover:text-indigo-600 hover:bg-white transition text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home Page</span>
            </button>
          )}

          <AppLogo size="md" theme="light" showTagline={true} />
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs font-bold text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Automated AI Evaluation Engine Active</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 flex flex-col items-center justify-center z-10">
        {/* Title */}
        <div className="text-center space-y-3 mb-8 max-w-xl">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Select Your Academic Portal
          </h2>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Separate, secure portals for University Administrators, Faculty Evaluators, and Students with automated AI paper grading.
          </p>
        </div>

        {/* Portal Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 liquid-glass rounded-2xl w-full max-w-2xl mb-8 shadow-lg">
          <button
            onClick={() => handlePortalSwitch('Admin')}
            className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 border ${
              activePortal === 'Admin'
                ? 'bg-fuchsia-500 text-white border-fuchsia-300 shadow-lg shadow-fuchsia-500/35 scale-[1.02] neon-glow-purple'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>

          <button
            onClick={() => handlePortalSwitch('Faculty')}
            className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 border ${
              activePortal === 'Faculty'
                ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-lg shadow-cyan-400/35 scale-[1.02] neon-glow-blue'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Faculty Evaluator</span>
          </button>

          <button
            onClick={() => handlePortalSwitch('Student')}
            className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 border ${
              activePortal === 'Student'
                ? 'bg-emerald-400 text-slate-950 border-emerald-200 shadow-lg shadow-emerald-400/35 scale-[1.02] neon-glow-green'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>
        </div>

        {/* Active Portal Form Card */}
        <div className="w-full max-w-xl liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          {/* Notification Banners */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start space-x-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. ADMIN PORTAL FORM */}
          {activePortal === 'Admin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-fuchsia-500/15 text-fuchsia-600 border border-fuchsia-300 shadow-sm neon-glow-purple">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Administrator Access Login</h3>
                  <p className="text-xs text-slate-600 font-medium">Manage departments, faculty credentials, and student approvals</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Username</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-fuchsia-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-400 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-fuchsia-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="admin123"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-400 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Demo Helper Box */}
              <div className="p-3 rounded-xl bg-fuchsia-50/90 border border-fuchsia-200 text-[11px] text-fuchsia-950 flex items-center justify-between font-medium">
                <span>Default Credentials: <strong className="font-mono text-fuchsia-950">admin</strong> / <strong className="font-mono text-fuchsia-950">admin123</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin123');
                  }}
                  className="px-2.5 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-lg transition text-[10px] shadow-sm shadow-fuchsia-500/30"
                >
                  Auto-Fill
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-fuchsia-500/30 hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition flex items-center justify-center space-x-2 border border-fuchsia-300/40"
              >
                {loading ? <span>Authenticating Admin...</span> : (
                  <>
                    <span>Enter Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. FACULTY EVALUATOR PORTAL FORM */}
          {activePortal === 'Faculty' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-300 shadow-sm neon-glow-blue">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Faculty Evaluator Login</h3>
                  <p className="text-xs text-slate-600 font-medium">Access created exams, upload answer sheets, review AI evaluations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Faculty Employee ID / Username</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-cyan-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. EMP-9021"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Faculty Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-cyan-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Demo Helper Box */}
              <div className="p-3 rounded-xl bg-cyan-50/90 border border-cyan-200 text-[11px] text-cyan-950 space-y-2 font-medium">
                <span className="font-semibold block">Faculty accounts are created by Admin in the Admin Portal. Sample Credentials:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('EMP-9021');
                      setPassword('faculty123');
                    }}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-[10px] rounded-lg transition shadow-sm shadow-cyan-500/30"
                  >
                    Prof. Alan Turing (EMP-9021 / faculty123)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('EMP-9088');
                      setPassword('faculty123');
                    }}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-[10px] rounded-lg transition shadow-sm shadow-cyan-500/30"
                  >
                    Dr. Grace Hopper (EMP-9088 / faculty123)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-400/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition flex items-center justify-center space-x-2 border border-cyan-200"
              >
                {loading ? <span>Authenticating Faculty...</span> : (
                  <>
                    <span>Enter Faculty Evaluator Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. STUDENT PORTAL FORM (LOGIN OR REGISTER) */}
          {activePortal === 'Student' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-300 shadow-sm neon-glow-green">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Student Examination Portal</h3>
                    <p className="text-xs text-slate-600 font-medium">Take online exams, view AI scorecards, and check performance</p>
                  </div>
                </div>
              </div>

              {/* Sub-mode Switcher: Login vs Register */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('login');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg transition ${
                    studentMode === 'login'
                      ? 'bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-400/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('register');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg transition ${
                    studentMode === 'register'
                      ? 'bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-400/30 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register Account (New)
                </button>
              </div>

              {studentMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Student Roll Number</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. CS2023-042"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none uppercase font-mono shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Demo Helper Box */}
                  <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-[11px] text-emerald-950 space-y-2 font-medium">
                    <span className="font-semibold block">Approved Demo Student Accounts:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('CS2023-042');
                          setPassword('student123');
                        }}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] rounded-lg transition shadow-sm shadow-emerald-500/30"
                      >
                        Alex Rivera (CS2023-042 / student123)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('CS2023-018');
                          setPassword('student123');
                        }}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] rounded-lg transition shadow-sm shadow-emerald-500/30"
                      >
                        Sophia Patel (CS2023-018 / student123)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-400/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition flex items-center justify-center space-x-2 border border-emerald-200"
                  >
                    {loading ? <span>Verifying Student Account...</span> : (
                      <>
                        <span>Enter Student Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Student Self-Registration Request Form */
                <form onSubmit={handleStudentRegisterSubmit} className="space-y-4">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2 font-medium">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Submit your Roll Number & Full Name to request account creation. Admin will review and approve your request in the Admin Portal before you can log in.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      className="w-full px-3.5 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Roll Number</label>
                    <input
                      type="text"
                      required
                      value={regRollNumber}
                      onChange={(e) => setRegRollNumber(e.target.value)}
                      placeholder="e.g. CS2023-099"
                      className="w-full px-3.5 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none font-mono uppercase shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. jordan.lee@student.edu"
                      className="w-full px-3.5 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Course / Department</label>
                    <input
                      type="text"
                      value={regCourseName}
                      onChange={(e) => setRegCourseName(e.target.value)}
                      placeholder="B.Tech Computer Science & Engineering"
                      className="w-full px-3.5 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Desired Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="student123"
                      className="w-full px-3.5 py-2.5 bg-white/90 border border-slate-300/80 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-emerald-400/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition flex items-center justify-center space-x-2 border border-emerald-200"
                  >
                    {loading ? <span>Submitting Request...</span> : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Submit Registration Request to Admin</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-600 font-medium border-t border-white/80 bg-white/60 backdrop-blur-md">
        AutoEval Pro University Portal System • Automated Examination Evaluation Engine
      </footer>
    </div>
  );
};
