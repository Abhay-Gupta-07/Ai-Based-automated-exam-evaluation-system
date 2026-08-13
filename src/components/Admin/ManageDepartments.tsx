import React, { useState } from 'react';
import { Department } from '../../types';
import { Building2, Plus, Search, Users, GraduationCap, X } from 'lucide-react';

interface Props {
  departments: Department[];
  onAddDepartment: (dept: { name: string; code: string; headOfDept: string }) => void;
}

export const ManageDepartments: React.FC<Props> = ({ departments, onAddDepartment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headOfDept, setHeadOfDept] = useState('');

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    onAddDepartment({ name, code, headOfDept: headOfDept || 'TBD' });
    setName('');
    setCode('');
    setHeadOfDept('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Departments</h2>
          <p className="text-xs text-slate-500">Manage university faculties, branches, and heads of departments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by department name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((dept) => (
          <div
            key={dept.id}
            className="liquid-glass rounded-2xl p-5 space-y-4 hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg font-mono">
                {dept.code}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Head of Dept: <span className="font-semibold text-slate-700">{dept.headOfDept}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
              <div className="flex items-center space-x-2 text-slate-600">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>{dept.facultyCount} Faculty</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                <span>{dept.studentCount} Students</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add New Department</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical & Aerospace Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MECH"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Head of Department (HOD)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Richard Feynman"
                  value={headOfDept}
                  onChange={(e) => setHeadOfDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
