export type CourseTopic = {
  id: number;
  title: string;
  position: number;
};

export type CourseModuleItem = {
  id: number;
  title: string;
  position: number;
  topics: CourseTopic[];
};

export type StudentCourseDetail = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  credits: number | null;
  coverUrl: string | null;
  updatedAt: string;
  departmentName: string;
  teacherName: string;
  semesterNumbers: number[];
  modules: CourseModuleItem[];
  /** Topics the student has marked as done (filled in a later slice) */
  completedTopicIds: number[];
};
