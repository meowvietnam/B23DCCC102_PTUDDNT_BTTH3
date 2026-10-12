export interface StudentProfile {
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  faculty: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  classroom: string;
  semester: string;
  description: string;
  progress: number; // 0 - 100%
  score?: number; // thang điểm 10 hoặc 4
}

export interface ScheduleItem {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  dayOfWeek: string; // 'Thứ Hai', 'Thứ Ba', ...
  dayIndex: number; // 2 -> 7, CN = 8
  time: string; // '07:00 - 09:15'
  room: string;
  lecturer: string;
  lessonType: 'Lý thuyết' | 'Thực hành' | 'Bài tập lớn';
  building: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  deadline: string; // '2026-10-20'
  isCompleted: boolean;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  requirements: string[];
}

export interface SubjectGrade {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  attendanceScore: number; // Điểm chuyên cần (10%)
  midtermScore: number;    // Điểm giữa kỳ (20% hoặc 30%)
  finalScore: number;      // Điểm thi cuối kỳ (60% hoặc 70%)
  totalScore10: number;    // Điểm tổng kết hệ 10
  totalScore4: number;     // Điểm hệ 4
  letterGrade: string;     // A, B+, B, C+, C, D+, D, F
}

export interface AcademicSummary {
  gpa10: number;
  gpa4: number;
  accumulatedCredits: number;
  totalCredits: number;
  trainingPoint: number; // Điểm rèn luyện
  academicClassification: string; // Xuất sắc, Giỏi, Khá
  grades: SubjectGrade[];
}
