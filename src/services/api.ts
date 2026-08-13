import {
  User,
  Department,
  Course,
  Subject,
  FacultyMember,
  StudentMember,
  Exam,
  StudentSubmission,
  EvaluationResult,
  AuditLog,
  SystemSettings,
  AnalyticsSummary,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth & Portal Login
  portalLogin: async (data: {
    portalRole: 'Admin' | 'Faculty' | 'Student';
    username: string;
    password?: string;
  }): Promise<{ success: boolean; token: string; user: User; faculty?: FacultyMember; student?: StudentMember }> => {
    const res = await fetch(`${API_BASE}/auth/portal-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Portal authentication failed');
    }
    return res.json();
  },

  registerStudent: async (data: {
    fullName: string;
    rollNumber: string;
    email?: string;
    courseName?: string;
    departmentName?: string;
    password?: string;
  }): Promise<{ success: boolean; message: string; student: StudentMember }> => {
    const res = await fetch(`${API_BASE}/students/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Registration failed');
    }
    return res.json();
  },

  getPendingStudentRequests: async (): Promise<StudentMember[]> => {
    try {
      const res = await fetch(`${API_BASE}/admin/student-requests`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  approveStudent: async (studentId: string, assignedPassword?: string): Promise<{ success: boolean; student: StudentMember }> => {
    const res = await fetch(`${API_BASE}/admin/approve-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, assignedPassword }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Approval failed');
    }
    return res.json();
  },

  rejectStudent: async (studentId: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/admin/reject-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Rejection failed');
    }
    return res.json();
  },

  createFaculty: async (data: {
    name: string;
    email?: string;
    employeeId: string;
    designation?: string;
    departmentId?: string;
    departmentName?: string;
    subjectsHandled?: string[];
    password?: string;
  }): Promise<{ success: boolean; faculty: FacultyMember }> => {
    const res = await fetch(`${API_BASE}/admin/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed creating faculty account');
    }
    return res.json();
  },

  createStudentDirect: async (data: {
    name: string;
    rollNumber: string;
    email?: string;
    courseName?: string;
    departmentName?: string;
    batch?: string;
    password?: string;
  }): Promise<{ success: boolean; student: StudentMember }> => {
    const res = await fetch(`${API_BASE}/admin/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed creating student account');
    }
    return res.json();
  },

  updateUser: async (
    userId: string,
    data: {
      name?: string;
      email?: string;
      departmentName?: string;
      rollNumber?: string;
      employeeId?: string;
      designation?: string;
      courseName?: string;
      password?: string;
      status?: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed updating user account');
    }
    return res.json();
  },

  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed deleting user account');
    }
    return res.json();
  },

  getAdminCredentials: async (): Promise<{ username: string; email: string; name: string; password?: string }> => {
    const res = await fetch(`${API_BASE}/admin/credentials`);
    if (!res.ok) {
      throw new Error('Failed to fetch admin credentials');
    }
    return res.json();
  },

  updateAdminCredentials: async (data: {
    username?: string;
    email?: string;
    name?: string;
    password?: string;
    currentPassword?: string;
  }): Promise<{ success: boolean; message: string; credentials: any }> => {
    const res = await fetch(`${API_BASE}/admin/credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update admin credentials');
    }
    return res.json();
  },

  updateFacultyCredentials: async (
    facultyId: string,
    credentials: { employeeId?: string; password?: string }
  ): Promise<{ success: boolean; faculty: FacultyMember }> => {
    const res = await fetch(`${API_BASE}/admin/faculty/${facultyId}/credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Failed updating faculty credentials');
    return res.json();
  },

  // Legacy Auth
  login: async (email: string, role?: string): Promise<{ token: string; user: User }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    } catch (e) {
      console.warn('API fallback for login:', e);
      return {
        token: 'mock_token',
        user: {
          id: role === 'Admin' ? 'usr_admin' : role === 'Faculty' ? 'usr_fac1' : 'usr_stu1',
          name: role === 'Admin' ? 'Dr. Sarah Jenkins' : role === 'Faculty' ? 'Prof. Alan Turing' : 'Alex Rivera',
          email: email || 'user@university.edu',
          role: (role as any) || 'Admin',
          createdAt: new Date().toISOString(),
        },
      };
    }
  },

  // Admin APIs
  getDepartments: async (): Promise<Department[]> => {
    try {
      const res = await fetch(`${API_BASE}/admin/departments`);
      return res.json();
    } catch {
      return [];
    }
  },

  createDepartment: async (dept: { name: string; code: string; headOfDept?: string }): Promise<Department> => {
    const res = await fetch(`${API_BASE}/admin/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept),
    });
    return res.json();
  },

  getCourses: async (): Promise<Course[]> => {
    const res = await fetch(`${API_BASE}/admin/courses`);
    return res.json();
  },

  getSubjects: async (): Promise<Subject[]> => {
    const res = await fetch(`${API_BASE}/admin/subjects`);
    return res.json();
  },

  getFaculty: async (): Promise<FacultyMember[]> => {
    const res = await fetch(`${API_BASE}/admin/faculty`);
    return res.json();
  },

  getStudents: async (): Promise<StudentMember[]> => {
    const res = await fetch(`${API_BASE}/admin/students`);
    return res.json();
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetch(`${API_BASE}/admin/logs`);
    return res.json();
  },

  getSettings: async (): Promise<SystemSettings> => {
    const res = await fetch(`${API_BASE}/admin/settings`);
    return res.json();
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Exam APIs
  getExams: async (): Promise<Exam[]> => {
    const res = await fetch(`${API_BASE}/exams`);
    return res.json();
  },

  getExamById: async (id: string): Promise<Exam & { questions: any[] }> => {
    const res = await fetch(`${API_BASE}/exams/${id}`);
    return res.json();
  },

  createExam: async (examData: any): Promise<Exam> => {
    const res = await fetch(`${API_BASE}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examData),
    });
    return res.json();
  },

  // Submissions
  getSubmissions: async (params?: { examId?: string; studentId?: string }): Promise<StudentSubmission[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/submissions${query ? `?${query}` : ''}`);
    return res.json();
  },

  submitAnswerSheet: async (data: any): Promise<StudentSubmission> => {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // OCR Extraction
  extractOCR: async (data: { imageBase64?: string; samplePreset?: string }): Promise<{ success: boolean; ocrText: string; confidence: number; engine: string }> => {
    const res = await fetch(`${API_BASE}/ocr/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // AI Evaluation Engine
  triggerEvaluation: async (submissionId: string): Promise<EvaluationResult> => {
    const res = await fetch(`${API_BASE}/evaluation/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId }),
    });
    return res.json();
  },

  overrideEvaluation: async (data: { evaluationId: string; questionId: string; overrideScore: number; facultyNotes?: string }): Promise<EvaluationResult> => {
    const res = await fetch(`${API_BASE}/evaluation/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getEvaluations: async (params?: { examId?: string; studentId?: string }): Promise<EvaluationResult[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/evaluations${query ? `?${query}` : ''}`);
    return res.json();
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    return res.json();
  },

  getAnalytics: async (): Promise<AnalyticsSummary> => {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    return res.json();
  },

  getUsers: async (): Promise<{ faculty: FacultyMember[]; students: StudentMember[] }> => {
    const [faculty, students] = await Promise.all([
      fetch(`${API_BASE}/admin/faculty`).then((r) => r.json()),
      fetch(`${API_BASE}/admin/students`).then((r) => r.json()),
    ]);
    return { faculty, students };
  },

  overrideMarks: async (data: { evaluationId: string; questionId: string; overrideScore: number; facultyNotes?: string }): Promise<EvaluationResult> => {
    const res = await fetch(`${API_BASE}/evaluation/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getSystemDocs: async () => {
    const res = await fetch(`${API_BASE}/docs/all`);
    return res.json();
  },
};
