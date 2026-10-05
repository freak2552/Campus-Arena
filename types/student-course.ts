export type EnrollmentStatus = "ACTIVE" | "PENDING";

export type StudentCourse = {
  id: number;
  title: string;
  description: string | null;
  coverUrl: string | null;
  category: string | null;
  level: string | null;
  credits: number | null;
  studentAccess: "OPEN" | "APPROVAL_REQUIRED";
  teacherName: string;
  moduleCount: number;
  topicCount: number;
  enrollmentStatus: EnrollmentStatus | null;
};
