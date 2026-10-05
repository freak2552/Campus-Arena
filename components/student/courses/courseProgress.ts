import type {
  CourseModuleItem,
  StudentCourseDetail,
} from "@/types/student-course-detail";

export const EXAM_UNLOCK_PERCENT = 75;

export function getModuleProgress(
  courseModule: CourseModuleItem,
  completed: Set<number>
) {
  const total = courseModule.topics.length;
  const done = courseModule.topics.filter((topic) =>
    completed.has(topic.id)
  ).length;

  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function getCourseProgress(course: StudentCourseDetail) {
  const completed = new Set(course.completedTopicIds);

  const total = course.modules.reduce(
    (sum, courseModule) => sum + courseModule.topics.length,
    0
  );

  const done = course.modules.reduce(
    (sum, courseModule) =>
      sum + getModuleProgress(courseModule, completed).done,
    0
  );

  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/** First module that still has unfinished topics (or the first module). */
export function getCurrentModule(course: StudentCourseDetail) {
  const completed = new Set(course.completedTopicIds);

  const index = course.modules.findIndex((courseModule) => {
    const { done, total } = getModuleProgress(courseModule, completed);
    return total > 0 && done < total;
  });

  const safeIndex = index === -1 ? 0 : index;
  const courseModule = course.modules[safeIndex] ?? null;

  return courseModule ? { module: courseModule, number: safeIndex + 1 } : null;
}
