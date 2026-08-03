import type { ContinueLearningItem } from "@shared/contentfy";

export interface LessonProgressSnapshot {
  productId: number;
  productSlug: string;
  productName: string;
  coverImage?: string | null;
  lastLessonTitle?: string;
  lastModuleTitle?: string;
  completedLessons: number;
  totalLessons: number;
  lastWatchedAt?: Date | string | null;
}

export class ContinueLearningEngine {
  build(items: LessonProgressSnapshot[], limit = 8): ContinueLearningItem[] {
    const mapped = items
      .map((item) => {
        const total = Math.max(item.totalLessons, 1);
        const progressPercent = Math.min(
          100,
          Math.round((item.completedLessons / total) * 100)
        );
        const remaining = Math.max(0, total - item.completedLessons);
        return {
          productSlug: item.productSlug,
          productId: item.productId,
          productName: item.productName,
          lastLessonTitle: item.lastLessonTitle,
          lastModuleTitle: item.lastModuleTitle,
          progressPercent,
          remainingLabel:
            remaining === 0
              ? "Concluído"
              : `${remaining} aula${remaining === 1 ? "" : "s"} restante${remaining === 1 ? "" : "s"}`,
          href: `/my-account/course/${item.productId}`,
          coverImage: item.coverImage,
          _sort: item.lastWatchedAt
            ? new Date(item.lastWatchedAt).getTime()
            : 0,
        };
      })
      .filter((i) => i.progressPercent < 100)
      .sort((a, b) => b._sort - a._sort)
      .slice(0, limit);

    return mapped.map(({ _sort: _, ...rest }) => rest);
  }
}

export const continueLearningEngine = new ContinueLearningEngine();
