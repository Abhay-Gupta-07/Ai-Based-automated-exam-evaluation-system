export type UserRole = 'Admin' | 'Faculty' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string;
  departmentName?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDept: string;
  facultyCount: number;
  studentCount: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  credits: number;
  durationYears: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semester: number;
  facultyId?: string;
  facultyName?: string;
}

export interface FacultyMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  subjectsHandled: string[];
  username?: string;
  password?: string;
}

export interface StudentMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  batch: string;
  courseId: string;
  courseName: string;
  departmentId: string;
  departmentName: string;
  cgpa: number;
  password?: string;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
  requestedAt?: string;
}

export interface MarkingCriterion {
  keyword: string;
  weight: number;
  required: boolean;
}

export interface Question {
  id: string;
  examId: string;
  questionNumber: number;
  questionText: string;
  maxMarks: number;
  modelAnswer: string;
  keyConcepts: string[];
  markingCriteria: MarkingCriterion[];
  penaltyForGrammar: number;
  penaltyForFluff: number;
}

export type ExamStatus = 'Draft' | 'Active' | 'Evaluating' | 'Completed';

export interface Exam {
  id: string;
  title: string;
  examCode: string;
  subjectId: string;
  subjectName: string;
  courseId: string;
  courseName: string;
  departmentId: string;
  date: string;
  durationMinutes: number;
  totalMarks: number;
  createdByFacultyId: string;
  createdByFacultyName: string;
  status: ExamStatus;
  questionsCount: number;
  evaluatedSubmissionsCount: number;
  totalSubmissionsCount: number;
}

export interface AnswerKey {
  examId: string;
  questions: Question[];
}

export interface QuestionAnswerSubmission {
  questionId: string;
  questionNumber: number;
  studentAnswerText: string;
  rawOcrText?: string;
  uploadedFileUrl?: string;
}

export interface StudentSubmission {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  submittedAt: string;
  status: 'Pending' | 'Evaluating' | 'Evaluated';
  fileUrl?: string;
  fileType?: 'image' | 'pdf' | 'text';
  answers: QuestionAnswerSubmission[];
}

export interface QuestionEvaluation {
  questionId: string;
  questionNumber: number;
  maxMarks: number;
  scoreObtained: number;
  semanticSimilarityScore: number; // 0 - 100%
  keywordMatchScore: number; // 0 - 100%
  grammarScore: number; // 0 - 100%
  conceptCoverageScore: number; // 0 - 100%
  plagiarismScore: number; // 0 - 100%
  confidenceScore: number; // 0 - 100%
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  irrelevantContent: string[];
  aiFeedbackText: string;
  manualOverrideScore?: number;
  isOverridden?: boolean;
}

export interface EvaluationResult {
  id: string;
  submissionId: string;
  examId: string;
  examTitle: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  evaluatedAt: string;
  evaluatedByAI: boolean;
  totalMarks: number;
  totalObtainedMarks: number;
  overallPercentage: number;
  overallConfidenceScore: number;
  overallPlagiarismScore: number;
  questionEvaluations: QuestionEvaluation[];
  generalStrengths: string[];
  generalWeaknesses: string[];
  studyRecommendations: string[];
  facultyNotes?: string;
  reviewedByFaculty: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface SystemSettings {
  aiModelName: string;
  minConfidenceThreshold: number;
  semanticWeight: number;
  keywordWeight: number;
  conceptWeight: number;
  grammarWeight: number;
  enableOCR: boolean;
  enablePlagiarismCheck: boolean;
  autoApproveHighConfidence: boolean;
  storageProvider: 'Local' | 'AWS_S3';
}

export interface AnalyticsSummary {
  totalStudents: number;
  totalFaculty: number;
  totalExams: number;
  evaluatedPapers: number;
  pendingPapers: number;
  averageScore: number;
  passPercentage: number;
  highestScore: number;
  lowestScore: number;
}
