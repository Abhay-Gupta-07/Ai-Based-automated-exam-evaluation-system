import React, { useState, useEffect } from 'react';
import { User, UserRole, AnalyticsSummary, Department, Course, Subject, FacultyMember, StudentMember, Exam, StudentSubmission, EvaluationResult, SystemSettings as SettingsType, AuditLog } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PortalLogin } from './components/Auth/PortalLogin';
import { LandingPage } from './components/LandingPage';
import { DocumentationModal } from './components/Common/DocumentationModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ManageDepartments } from './components/Admin/ManageDepartments';
import { ManageCoursesSubjects } from './components/Admin/ManageCoursesSubjects';
import { ManageUsers } from './components/Admin/ManageUsers';
import { SystemSettings } from './components/Admin/SystemSettings';
import { AuditLogsView } from './components/Admin/AuditLogsView';
import { FacultyDashboard } from './components/Faculty/FacultyDashboard';
import { ExamManager } from './components/Faculty/ExamManager';
import { UploadAnswerSheets } from './components/Faculty/UploadAnswerSheets';
import { EvaluationReviewer } from './components/Faculty/EvaluationReviewer';
import { FacultyAnalytics } from './components/Faculty/FacultyAnalytics';
import { StudentDashboard } from './components/Student/StudentDashboard';
import { StudentExamsView } from './components/Student/StudentExamsView';
import { StudentScorecards } from './components/Student/StudentScorecards';
import { StudentHistory } from './components/Student/StudentHistory';
import { motion, AnimatePresence } from 'motion/react';

import { ParticlesBackground } from './components/Common/ParticlesBackground';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [unauthView, setUnauthView] = useState<'landing' | 'portal_login'>('landing');
  const [selectedInitialPortal, setSelectedInitialPortal] = useState<UserRole>('Admin');

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_admin',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@university.edu',
    role: 'Admin',
    department: 'Executive Office',
  });

  const [activeTab, setActiveTab] = useState<string>('admin_dash');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);

  // System State loaded from API
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [students, setStudents] = useState<StudentMember[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAllData = async () => {
    try {
      const [
        analyticsRes,
        deptsRes,
        coursesRes,
        subjectsRes,
        usersRes,
        examsRes,
        subsRes,
        evalsRes,
        settingsRes,
        logsRes,
      ] = await Promise.all([
        api.getAnalytics(),
        api.getDepartments(),
        api.getCourses(),
        api.getSubjects(),
        api.getUsers(),
        api.getExams(),
        api.getSubmissions(),
        api.getEvaluations(),
        api.getSettings(),
        api.getAuditLogs(),
      ]);

      setAnalytics(analyticsRes);
      setDepartments(deptsRes);
      setCourses(coursesRes);
      setSubjects(subjectsRes);
      setFaculty(usersRes.faculty);
      setStudents(usersRes.students);
      setExams(examsRes);
      setSubmissions(subsRes);
      setEvaluations(evalsRes);
      setSettings(settingsRes);
      setAuditLogs(logsRes);
    } catch (err) {
      console.error('Failed loading system state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const handleLoginSuccess = (
    user: User,
    role: UserRole,
    extra?: { faculty?: FacultyMember; student?: StudentMember }
  ) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (role === 'Admin') {
      setActiveTab('admin_dash');
    } else if (role === 'Faculty') {
      setActiveTab('fac_dash');
    } else if (role === 'Student') {
      setActiveTab('stu_dash');
    }
    loadAllData();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUnauthView('landing');
  };

  const handleOpenPortalLogin = (role?: UserRole) => {
    if (role) setSelectedInitialPortal(role);
    setUnauthView('portal_login');
  };

  const handleBackToLanding = () => {
    setUnauthView('landing');
  };

  const handleAddDepartment = async (deptData: { name: string; code: string; headOfDept: string }) => {
    await api.createDepartment(deptData);
    loadAllData();
  };

  const handleCreateExam = async (examData: any) => {
    await api.createExam(examData);
    loadAllData();
  };

  const handleSaveSettings = async (updated: Partial<SettingsType>) => {
    await api.updateSettings(updated);
    loadAllData();
  };

  const handleOverrideMarks = async (data: { evaluationId: string; questionId: string; overrideScore: number; facultyNotes?: string }) => {
    await api.overrideMarks(data);
    loadAllData();
  };

  // If not authenticated, switch between Landing Page and Academic Portal Login
  if (!isAuthenticated) {
    if (unauthView === 'landing') {
      return (
        <>
          <LandingPage
            onOpenPortalLogin={handleOpenPortalLogin}
            onOpenDocs={() => setShowDocsModal(true)}
          />
          {showDocsModal && <DocumentationModal onClose={() => setShowDocsModal(false)} />}
        </>
      );
    }

    return (
      <>
        <PortalLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={handleBackToLanding}
          initialPortal={selectedInitialPortal}
        />
        {showDocsModal && <DocumentationModal onClose={() => setShowDocsModal(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans transition-colors duration-200 relative selection:bg-indigo-500 selection:text-white">
      {/* 3D Light Particle Background */}
      <ParticlesBackground />

      {/* Navbar Header */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenDocs={() => setShowDocsModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar role={currentUser.role} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentUser.role}-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {/* Admin Views */}
              {currentUser.role === 'Admin' && (
                <>
                  {activeTab === 'admin_dash' && analytics && (
                    <AdminDashboard analytics={analytics} auditLogs={auditLogs} onNavigate={setActiveTab} />
                  )}
                  {activeTab === 'admin_depts' && (
                    <ManageDepartments departments={departments} onAddDepartment={handleAddDepartment} />
                  )}
                  {activeTab === 'admin_courses' && (
                    <ManageCoursesSubjects courses={courses} subjects={subjects} />
                  )}
                  {activeTab === 'admin_users' && (
                    <ManageUsers faculty={faculty} students={students} onRefresh={loadAllData} />
                  )}
                  {activeTab === 'admin_settings' && settings && (
                    <SystemSettings settings={settings} onSave={handleSaveSettings} />
                  )}
                  {activeTab === 'admin_logs' && <AuditLogsView logs={auditLogs} />}
                </>
              )}

              {/* Faculty Views */}
              {currentUser.role === 'Faculty' && (
                <>
                  {activeTab === 'fac_dash' && (
                    <FacultyDashboard
                      exams={exams}
                      submissions={submissions}
                      evaluations={evaluations}
                      onNavigate={setActiveTab}
                    />
                  )}
                  {activeTab === 'fac_exams' && (
                    <ExamManager exams={exams} subjects={subjects} onCreateExam={handleCreateExam} />
                  )}
                  {activeTab === 'fac_upload' && (
                    <UploadAnswerSheets
                      exams={exams}
                      students={students}
                      onEvaluationCreated={() => {
                        loadAllData();
                        setActiveTab('fac_review');
                      }}
                    />
                  )}
                  {activeTab === 'fac_review' && (
                    <EvaluationReviewer evaluations={evaluations} onOverrideMarks={handleOverrideMarks} />
                  )}
                  {activeTab === 'fac_analytics' && <FacultyAnalytics evaluations={evaluations} />}
                  {activeTab === 'fac_users' && (
                    <ManageUsers faculty={faculty} students={students} onRefresh={loadAllData} />
                  )}
                </>
              )}

              {/* Student Views */}
              {currentUser.role === 'Student' && (
                <>
                  {activeTab === 'stu_dash' && (
                    <StudentDashboard exams={exams} evaluations={evaluations} onNavigate={setActiveTab} />
                  )}
                  {activeTab === 'stu_exams' && (
                    <StudentExamsView
                      exams={exams}
                      evaluations={evaluations}
                      currentUser={currentUser}
                      onEvaluationComplete={loadAllData}
                      onNavigate={setActiveTab}
                    />
                  )}
                  {activeTab === 'stu_reports' && <StudentScorecards evaluations={evaluations} />}
                  {activeTab === 'stu_history' && <StudentHistory />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* System Documentation Modal */}
      {showDocsModal && <DocumentationModal onClose={() => setShowDocsModal(false)} />}
    </div>
  );
}
