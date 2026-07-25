export type LmsLesson = {
  id: number;
  title: string;
  description?: string | null;
  duration?: number | null;
  contentUrl?: string | null;
  type?: string | null;
  isCompleted: boolean;
  lastWatchedAt?: string | Date | null;
};

export type LmsModule = {
  id: number;
  title: string;
  lessons: LmsLesson[];
};

export type LmsStats = {
  totalModules: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
};

export type LmsNote = {
  id: string;
  lessonId: number;
  content: string;
  updatedAt: string;
};

export type LmsMaterial = {
  id: string;
  title: string;
  type: "pdf" | "slides" | "file" | "checklist";
  size: string;
};
