import React, { useState } from 'react';
import { FacultyMember, StudentMember } from '../../types';
import { api } from '../../services/api';
import {
  Users,
  GraduationCap,
  Search,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  Sparkles,
  Download,
  Edit3,
  Trash2,
  Filter,
  Building2,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

interface Props {
  faculty: FacultyMember[];
  students: StudentMember[];
  onRefresh?: () => void;
}

export const ManageUsers: React.FC<Props> = ({ faculty = [], students = [], onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'faculty' | 'students'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Password visibility map
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Modals state
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    type: 'faculty' | 'student';
    name: string;
    email: string;
    departmentName: string;
    idOrRoll: string;
    extra: string; // designation for fac, course for stu
    password: string;
    status?: string;
  } | null>(null);

  // Form states for Add Faculty
  const [facName, setFacName] = useState('');
  const [facEmployeeId, setFacEmployeeId] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facDesignation, setFacDesignation] = useState('Associate Professor');
  const [facPassword, setFacPassword] = useState('faculty123');
  const [facDepartment, setFacDepartment] = useState('Computer Science & Engineering');

  // Form states for Add Student
  const [stuName, setStuName] = useState('');
  const [stuRoll, setStuRoll] = useState('');
  const [stuEmail, setStuEmail] = useState('');
  const [stuCourse, setStuCourse] = useState('B.Tech Computer Science');
  const [stuDepartment, setStuDepartment] = useState('Computer Science & Engineering');
  const [stuPassword, setStuPassword] = useState('student123');

  // Approving student request modal state
  const [approvingStudent, setApprovingStudent] = useState<StudentMember | null>(null);
  const [assignedPassword, setAssignedPassword] = useState('student123');

  const [loadingAction, setLoadingAction] = useState(false);

  // Categorize students
  const pendingRequests = (students || []).filter((s) => s.approvalStatus === 'Pending');
  const approvedStudents = (students || []).filter((s) => s.approvalStatus !== 'Pending');

  // Extract unique departments list
  const allDepartments = Array.from(
    new Set([
      ...(faculty || []).map((f) => f.departmentName).filter(Boolean),
      ...(students || []).map((s) => s.departmentName).filter(Boolean),
    ])
  );

  // Filtering helper
  const filterByDept = (deptName?: string) => {
    if (departmentFilter === 'ALL') return true;
    return deptName === departmentFilter;
  };

  const filteredFaculty = (faculty || []).filter(
    (f) =>
      filterByDept(f.departmentName) &&
      (f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.departmentName && f.departmentName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredApprovedStudents = approvedStudents.filter(
    (s) =>
      filterByDept(s.departmentName) &&
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.courseName && s.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.departmentName && s.departmentName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredPendingRequests = pendingRequests.filter(
    (s) =>
      filterByDept(s.departmentName) &&
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Combined Unified Directory List
  const unifiedList = [
    ...filteredFaculty.map((f) => ({
      id: f.id,
      userId: f.userId,
      name: f.name,
      email: f.email,
      role: 'Faculty' as const,
      identifier: f.employeeId,
      department: f.departmentName,
      subDetail: f.designation,
      status: 'Active',
      password: f.password || 'faculty123',
      original: f,
    })),
    ...filteredApprovedStudents.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.name,
      email: s.email,
      role: 'Student' as const,
      identifier: s.rollNumber,
      department: s.departmentName,
      subDetail: s.courseName,
      status: s.approvalStatus || 'Approved',
      password: s.password || 'student123',
      original: s,
    })),
    ...filteredPendingRequests.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.name,
      email: s.email,
      role: 'Pending Student' as const,
      identifier: s.rollNumber,
      department: s.departmentName,
      subDetail: s.courseName,
      status: 'Pending Approval',
      password: s.password || 'student123',
      original: s,
    })),
  ].filter((item) => {
    if (roleFilter === 'ALL') return true;
    if (roleFilter === 'Faculty') return item.role === 'Faculty';
    if (roleFilter === 'Student') return item.role === 'Student';
    if (roleFilter === 'Pending') return item.role === 'Pending Student';
    return true;
  });

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Export Roster to CSV
  const handleExportCSV = () => {
    const headers = ['ID/Roll Number', 'Full Name', 'Role', 'Email', 'Department', 'Course/Designation', 'Status'];
    const rows = unifiedList.map((u) => [
      `"${u.identifier}"`,
      `"${u.name}"`,
      `"${u.role}"`,
      `"${u.email}"`,
      `"${u.department || 'N/A'}"`,
      `"${u.subDetail || 'N/A'}"`,
      `"${u.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `University_User_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions
  const handleApproveStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingStudent) return;

    setLoadingAction(true);
    try {
      await api.approveStudent(approvingStudent.id, assignedPassword);
      setApprovingStudent(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to approve student request');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRejectStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to reject the registration request for ${studentName}?`)) return;

    setLoadingAction(true);
    try {
      await api.rejectStudent(studentId);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to reject student request');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCreateFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facEmployeeId.trim()) {
      alert('Faculty Name and Employee ID are required.');
      return;
    }

    setLoadingAction(true);
    try {
      await api.createFaculty({
        name: facName,
        employeeId: facEmployeeId,
        email: facEmail,
        designation: facDesignation,
        departmentName: facDepartment,
        password: facPassword || 'faculty123',
      });

      setShowAddFacultyModal(false);
      setFacName('');
      setFacEmployeeId('');
      setFacEmail('');
      setFacPassword('faculty123');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create faculty account');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCreateStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuName.trim() || !stuRoll.trim()) {
      alert('Student Name and Roll Number are required.');
      return;
    }

    setLoadingAction(true);
    try {
      await api.createStudentDirect({
        name: stuName,
        rollNumber: stuRoll,
        email: stuEmail,
        courseName: stuCourse,
        departmentName: stuDepartment,
        password: stuPassword || 'student123',
      });

      setShowAddStudentModal(false);
      setStuName('');
      setStuRoll('');
      setStuEmail('');
      setStuPassword('student123');
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to create student account');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoadingAction(true);
    try {
      if (editingUser.type === 'faculty') {
        await api.updateUser(editingUser.id, {
          name: editingUser.name,
          email: editingUser.email,
          departmentName: editingUser.departmentName,
          employeeId: editingUser.idOrRoll,
          designation: editingUser.extra,
          password: editingUser.password,
        });
      } else {
        await api.updateUser(editingUser.id, {
          name: editingUser.name,
          email: editingUser.email,
          departmentName: editingUser.departmentName,
          rollNumber: editingUser.idOrRoll,
          courseName: editingUser.extra,
          password: editingUser.password,
          status: editingUser.status,
        });
      }

      setEditingUser(null);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update user details');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string, role: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${role} account for "${userName}"?`)) return;

    setLoadingAction(true);
    try {
      await api.deleteUser(userId);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user account');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Faculty
            </span>
            <span className="text-2xl font-black text-slate-900">{faculty.length}</span>
            <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Active Instructors</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Approved Students
            </span>
            <span className="text-2xl font-black text-slate-900">{approvedStudents.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Verified Accounts</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Pending Approvals
            </span>
            <span className="text-2xl font-black text-amber-600">{pendingRequests.length}</span>
            <span className="text-[10px] text-amber-600 font-bold block mt-0.5">Awaiting Admin Action</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Academic Departments
            </span>
            <span className="text-2xl font-black text-indigo-600">{allDepartments.length}</span>
            <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">Active Faculties</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 liquid-glass p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Student & Faculty User Directory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Centralized portal to create, search, manage credentials, and audit student & faculty access.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap bg-slate-100/90 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Users ({unifiedList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'faculty'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty ({faculty.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'students'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Students ({approvedStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Requests ({pendingRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID/Roll No, email, dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {allDepartments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Role Filter (when on 'all' tab) */}
          {activeTab === 'all' && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All User Roles</option>
              <option value="Faculty">Faculty Only</option>
              <option value="Student">Approved Students</option>
              <option value="Pending">Pending Approvals</option>
            </select>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition border border-slate-200/80 flex items-center justify-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddFacultyModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>+ Add Faculty</span>
          </button>

          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Student</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ALL UNIFIED USERS DIRECTORY */}
      {activeTab === 'all' && (
        <div className="liquid-glass rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/90 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">ID / Roll No</th>
                <th className="p-3.5">User Name</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Department & Details</th>
                <th className="p-3.5">Password</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {unifiedList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No student or faculty users match the selected search & filter criteria.
                  </td>
                </tr>
              ) : (
                unifiedList.map((u) => (
                  <tr key={`${u.role}-${u.id}`} className="hover:bg-white/80 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{u.identifier}</td>
                    <td className="p-3.5">
                      <strong className="font-bold text-slate-900 block">{u.name}</strong>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          u.role === 'Faculty'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : u.role === 'Student'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{u.email}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{u.department}</span>
                      <span className="text-[10px] text-slate-400 block">{u.subDetail}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span>{showPasswords[u.id] ? u.password : '••••••••'}</span>
                        <button
                          onClick={() => toggleShowPassword(u.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords[u.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() =>
                            setEditingUser({
                              id: u.id,
                              type: u.role === 'Faculty' ? 'faculty' : 'student',
                              name: u.name,
                              email: u.email,
                              departmentName: u.department || '',
                              idOrRoll: u.identifier,
                              extra: u.subDetail || '',
                              password: u.password,
                              status: u.status,
                            })
                          }
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name, u.role)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: FACULTY MEMBERS */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFaculty.length === 0 ? (
            <div className="col-span-2 liquid-glass p-12 text-center text-slate-400 rounded-2xl">
              No faculty members found matching your search query.
            </div>
          ) : (
            filteredFaculty.map((f) => (
              <div key={f.id} className="liquid-glass rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {f.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{f.name}</h3>
                      <p className="text-xs text-slate-500">{f.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() =>
                        setEditingUser({
                          id: f.id,
                          type: 'faculty',
                          name: f.name,
                          email: f.email,
                          departmentName: f.departmentName,
                          idOrRoll: f.employeeId,
                          extra: f.designation,
                          password: f.password || 'faculty123',
                        })
                      }
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(f.id, f.name, 'Faculty')}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50/90 text-slate-900 rounded-xl space-y-2 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
                      <Key className="w-3.5 h-3.5" />
                      <span>Admin Issued Credentials</span>
                    </span>
                    <button
                      onClick={() => toggleShowPassword(f.id)}
                      className="text-[10px] text-slate-500 hover:text-slate-900 transition flex items-center space-x-1"
                    >
                      {showPasswords[f.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPasswords[f.id] ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-sans">Employee ID:</span>
                      <strong className="text-slate-900 font-bold">{f.employeeId}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-sans">Password:</span>
                      <strong className="text-amber-600 font-bold">
                        {showPasswords[f.id] ? f.password || 'faculty123' : '••••••••'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex justify-between items-center pt-2 border-t border-slate-200/80">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{f.email}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                    {f.departmentName}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: APPROVED STUDENTS */}
      {activeTab === 'students' && (
        <div className="liquid-glass rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Roll Number</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Course & Department</th>
                <th className="p-3.5">Password</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredApprovedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No approved student records found.
                  </td>
                </tr>
              ) : (
                filteredApprovedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/80 transition">
                    <td className="p-3.5 font-mono font-bold text-emerald-600">{s.rollNumber}</td>
                    <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                    <td className="p-3.5 text-slate-500">{s.email}</td>
                    <td className="p-3.5">
                      <span className="font-semibold block">{s.courseName}</span>
                      <span className="text-[10px] text-slate-400 block">{s.departmentName}</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      <div className="flex items-center space-x-2">
                        <span>{showPasswords[s.id] ? s.password || 'student123' : '••••••••'}</span>
                        <button
                          onClick={() => toggleShowPassword(s.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords[s.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-300">
                        ✔ Approved
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() =>
                            setEditingUser({
                              id: s.id,
                              type: 'student',
                              name: s.name,
                              email: s.email,
                              departmentName: s.departmentName,
                              idOrRoll: s.rollNumber,
                              extra: s.courseName,
                              password: s.password || 'student123',
                              status: s.approvalStatus,
                            })
                          }
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(s.id, s.name, 'Student')}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: PENDING STUDENT REGISTRATION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {filteredPendingRequests.length === 0 ? (
            <div className="liquid-glass p-12 text-center rounded-2xl space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No Pending Registration Requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All student account registration requests have been reviewed and processed by Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="liquid-glass border-2 border-amber-300 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          ⏳ Pending Admin Approval
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base mt-2">{req.name}</h3>
                        <p className="text-xs text-slate-500">{req.courseName}</p>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 text-slate-800 font-mono font-black text-xs rounded-xl border border-slate-200">
                        {req.rollNumber}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50/90 rounded-xl space-y-1.5 text-xs text-slate-700 border border-slate-200/80">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-bold text-slate-900">{req.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Department:</span>
                        <span className="font-bold text-slate-900">{req.departmentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Requested Password:</span>
                        <span className="font-mono font-bold text-amber-600">
                          {req.password || 'student123'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setApprovingStudent(req);
                        setAssignedPassword(req.password || 'student123');
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Request</span>
                    </button>

                    <button
                      onClick={() => handleRejectStudent(req.id, req.name)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition border border-rose-200 flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Create New Faculty Account */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="liquid-glass rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Create Faculty Account</h3>
                <p className="text-xs text-slate-500">Issue new Faculty Employee ID & password</p>
              </div>
            </div>

            <form onSubmit={handleCreateFacultySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Faculty Full Name *</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="e.g. Dr. John von Neumann"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Employee ID / Username *</label>
                <input
                  type="text"
                  required
                  value={facEmployeeId}
                  onChange={(e) => setFacEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-9100"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Password</label>
                <input
                  type="text"
                  required
                  value={facPassword}
                  onChange={(e) => setFacPassword(e.target.value)}
                  placeholder="faculty123"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={facEmail}
                  onChange={(e) => setFacEmail(e.target.value)}
                  placeholder="e.g. neumann@university.edu"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={facDepartment}
                  onChange={(e) => setFacDepartment(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddFacultyModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold shadow-md shadow-blue-500/20 transition"
                >
                  Create Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Approved Student directly */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="liquid-glass rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Add Student Account</h3>
                <p className="text-xs text-slate-500">Directly create verified student record & password</p>
              </div>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={stuName}
                  onChange={(e) => setStuName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Roll Number / Registration ID *</label>
                <input
                  type="text"
                  required
                  value={stuRoll}
                  onChange={(e) => setStuRoll(e.target.value)}
                  placeholder="e.g. CS2024-099"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Name</label>
                <input
                  type="text"
                  value={stuCourse}
                  onChange={(e) => setStuCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={stuDepartment}
                  onChange={(e) => setStuDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Password</label>
                <input
                  type="text"
                  required
                  value={stuPassword}
                  onChange={(e) => setStuPassword(e.target.value)}
                  placeholder="student123"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold shadow-md shadow-emerald-500/20 transition"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Existing User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="liquid-glass rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Edit {editingUser.type === 'faculty' ? 'Faculty' : 'Student'} Details
                </h3>
                <p className="text-xs text-slate-500">Update account credentials, department, and password</p>
              </div>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {editingUser.type === 'faculty' ? 'Employee ID' : 'Roll Number'}
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.idOrRoll}
                  onChange={(e) => setEditingUser({ ...editingUser, idOrRoll: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={editingUser.departmentName}
                  onChange={(e) => setEditingUser({ ...editingUser, departmentName: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {editingUser.type === 'faculty' ? 'Designation' : 'Course Name'}
                </label>
                <input
                  type="text"
                  value={editingUser.extra}
                  onChange={(e) => setEditingUser({ ...editingUser, extra: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reset Password</label>
                <input
                  type="text"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold shadow-md shadow-indigo-500/20 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Approve Student Request */}
      {approvingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="liquid-glass rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Approve Student Account</h3>
                <p className="text-xs text-slate-500">Confirm student details and set login password</p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
              <div>Name: <strong className="text-slate-900">{approvingStudent.name}</strong></div>
              <div>Roll Number: <strong className="font-mono text-emerald-600">{approvingStudent.rollNumber}</strong></div>
              <div>Course: <strong className="text-slate-700">{approvingStudent.courseName}</strong></div>
            </div>

            <form onSubmit={handleApproveStudentSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assigned Login Password for Student
                </label>
                <input
                  type="text"
                  required
                  value={assignedPassword}
                  onChange={(e) => setAssignedPassword(e.target.value)}
                  placeholder="student123"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingStudent(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-500/20 transition"
                >
                  Confirm & Grant Student Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
