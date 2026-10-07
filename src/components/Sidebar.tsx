import React from 'react';
import { UserRole } from '../types';
import { ExamBrainLogo } from './Common/AppLogo';
import {
  LayoutDashboard,
  Building2,
  BookOpenCheck,
  Users,
  FileCheck2,
  UploadCloud,
  Award,
  BarChart3,
  Sliders,
  History,
  GraduationCap,
  ChevronRight,
  Shield,
  UserCheck,
} from 'lucide-react';

interface Props {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<Props> = ({ role, activeTab, onTabChange }) => {
  const adminMenuItems = [
    { id: 'admin_dash', label: 'Executive Analytics', icon: LayoutDashboard },
    { id: 'admin_depts', label: 'Manage Departments', icon: Building2 },
    { id: 'admin_courses', label: 'Courses & Subjects', icon: BookOpenCheck },
    { id: 'admin_users', label: 'Faculty & Students', icon: Users },
    { id: 'admin_logs', label: 'Audit Logs', icon: History },
    { id: 'admin_settings', label: 'System Settings', icon: Sliders },
  ];

  const facultyMenuItems = [
    { id: 'fac_dash', label: 'Faculty Workspace', icon: LayoutDashboard },
    { id: 'fac_exams', label: 'Exam & Answer Keys', icon: FileCheck2 },
    { id: 'fac_upload', label: 'Upload & OCR Papers', icon: UploadCloud },
    { id: 'fac_review', label: 'Review & Grade Override', icon: Award },
    { id: 'fac_analytics', label: 'Class Performance', icon: BarChart3 },
    { id: 'fac_users', label: 'Student Directory', icon: Users },
  ];

  const studentMenuItems = [
    { id: 'stu_dash', label: 'Student Dashboard', icon: GraduationCap },
    { id: 'stu_exams', label: 'Available Exams', icon: FileCheck2 },
    { id: 'stu_reports', label: 'My Exam Scorecards', icon: Award },
    { id: 'stu_history', label: 'Performance Trends', icon: BarChart3 },
  ];

  const items = role === 'Admin' ? adminMenuItems : role === 'Faculty' ? facultyMenuItems : studentMenuItems;

  return (
    <aside className="w-64 liquid-glass rounded-2xl flex flex-col justify-between p-5 shrink-0 hidden md:flex transition-all">
      <div>
        {/* Role Badge Header */}
        <div className="p-2.5 mb-6 rounded-xl bg-white/80 border border-white flex items-center space-x-3 shadow-2xs">
          <ExamBrainLogo size={34} className="drop-shadow-xs" />
          <div>
            <span className="text-xs font-bold text-slate-900 block tracking-tight">{role} Navigation</span>
            <span className="text-[10px] text-slate-500 block">Evaluation System Active</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 rounded-xl bg-white/70 text-slate-800 space-y-2 border border-white/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-indigo-700">Evaluation Engine v2.4</span>
          <span className="text-[9px] bg-indigo-100/80 text-indigo-700 px-2 py-0.5 rounded-full font-mono font-bold">ONLINE</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Semantic matching, OCR extraction & confidence scoring active.
        </p>
      </div>
    </aside>
  );
};
