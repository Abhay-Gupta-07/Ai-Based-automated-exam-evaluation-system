import React, { useState } from 'react';
import { Course, Subject } from '../../types';
import { BookOpen, Plus, Search, Layers, X } from 'lucide-react';

interface Props {
  courses: Course[];
  subjects: Subject[];
}

export const ManageCoursesSubjects: React.FC<Props> = ({ courses = [], subjects = [] }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects'>('courses');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = (courses || []).filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = (subjects || []).filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Courses & Subjects Directory</h2>
          <p className="text-xs text-slate-500">Degree programs, academic semesters, and subject syllabus mapping</p>
        </div>
        <div className="flex bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'courses' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'subjects' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Subjects ({subjects.length})
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Filter courses or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs text-slate-900 focus:outline-none"
        />
      </div>

      {activeTab === 'courses' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((c) => (
            <div key={c.id} className="liquid-glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-lg border border-blue-100">
                  {c.code}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{c.durationYears} Years Duration</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                <span>Total Credits: <strong>{c.credits}</strong></span>
                <span>Department ID: <strong>{c.departmentId}</strong></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/90 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Subject Code</th>
                <th className="p-3.5">Subject Name</th>
                <th className="p-3.5">Semester</th>
                <th className="p-3.5">Assigned Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-slate-700 font-medium">
              {filteredSubjects.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{s.code}</td>
                  <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                  <td className="p-3.5">Semester {s.semester}</td>
                  <td className="p-3.5 text-slate-600">{s.facultyName || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
