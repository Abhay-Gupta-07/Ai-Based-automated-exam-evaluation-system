import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { AppLogo } from './Common/AppLogo';
import { BookOpen, Shield, GraduationCap, UserCheck, Bell, Moon, Sun, LogOut } from 'lucide-react';

interface Props {
  currentUser: User;
  onLogout: () => void;
  onOpenDocs: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  onLogout,
  onOpenDocs,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'AI Evaluation Completed', desc: 'Exam EXAM-NLP-2025-A evaluated 3 papers with 96% avg confidence.', time: '2m ago' },
    { id: '2', title: 'Plagiarism Flag Alert', desc: 'Paper CS2023-018 showed 2% minor peer match.', time: '1h ago' },
    { id: '3', title: 'System Setting Updated', desc: 'Dr. Sarah Jenkins updated AI confidence threshold to 85%.', time: '3h ago' },
  ];

  const roleBadges: Record<UserRole, { label: string; icon: any; color: string }> = {
    Admin: { label: 'Admin Portal', icon: Shield, color: 'bg-fuchsia-500 text-white shadow-fuchsia-500/30 neon-glow-purple border border-fuchsia-300/50 font-extrabold' },
    Faculty: { label: 'Faculty Evaluator Portal', icon: UserCheck, color: 'bg-cyan-400 text-slate-950 shadow-cyan-400/30 neon-glow-blue border border-cyan-200 font-extrabold' },
    Student: { label: 'Student Exam Portal', icon: GraduationCap, color: 'bg-emerald-400 text-slate-950 shadow-emerald-400/30 neon-glow-green border border-emerald-200 font-extrabold' },
  };

  const activeBadge = roleBadges[currentUser.role] || roleBadges.Admin;
  const ActiveIcon = activeBadge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Portal Badge */}
        <div className="flex items-center space-x-3">
          <AppLogo size="sm" theme="light" />
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-xs ${activeBadge.color} flex items-center gap-1`}>
            <ActiveIcon className="w-3 h-3" />
            <span>{activeBadge.label}</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* System Docs */}
          <button
            onClick={onOpenDocs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition shadow-2xs"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Docs & Specs</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 p-3 z-50 shadow-xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-200">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Log Out */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-slate-200 shadow-2xs">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{currentUser.role}</div>
            </div>

            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-xl transition flex items-center space-x-1"
              title="Log Out & Return to Portal Gateway"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

