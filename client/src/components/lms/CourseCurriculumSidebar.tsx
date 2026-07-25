import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressBar } from "@/components/design-system/ProgressBar";
import BrandLogo from "@/components/BrandLogo";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { LmsModule, LmsStats } from "./types";

interface CourseCurriculumSidebarProps {
  courseTitle: string;
  modules: LmsModule[];
  stats: LmsStats;
  currentLessonId: number | null;
  expandedModules: number[];
  onToggleModule: (moduleId: number) => void;
  onSelectLesson: (lessonId: number) => void;
}

export default function CourseCurriculumSidebar({
  courseTitle,
  modules,
  stats,
  currentLessonId,
  expandedModules,
  onToggleModule,
  onSelectLesson,
}: CourseCurriculumSidebarProps) {
  return (
    <aside className="flex h-full flex-col border-r border-white/[0.08] bg-[#0c1220]/95 backdrop-blur-xl">
      <div className="border-b border-white/[0.08] p-4 lg:p-5">
        <Link href="/">
          <a className="cf-brand-logo-link mb-4 inline-flex">
            <BrandLogo />
          </a>
        </Link>
        <p className="cf-caption mb-1">Curso</p>
        <h2 className="text-base font-semibold leading-snug line-clamp-2 mb-4">
          {courseTitle}
        </h2>
        <ProgressBar
          value={stats.progressPercentage}
          label={`${stats.completedLessons}/${stats.totalLessons} aulas`}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 lg:p-4 space-y-2">
          {modules.map((module) => {
            const open = expandedModules.includes(module.id);
            const done = module.lessons.filter((l) => l.isCompleted).length;
            return (
              <div key={module.id} className="rounded-2xl border border-white/[0.06] bg-[#111827]/50 overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-3 text-left hover:bg-white/[0.03] transition-colors"
                  onClick={() => onToggleModule(module.id)}
                >
                  {open ? (
                    <ChevronUp className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">{module.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {done}/{module.lessons.length} concluídas
                    </p>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-white/[0.05] px-2 py-2 space-y-0.5">
                    {module.lessons.map((lesson) => {
                      const active = currentLessonId === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            "flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-all duration-200",
                            active
                              ? "bg-primary/15 border border-primary/30"
                              : "hover:bg-white/[0.04] border border-transparent"
                          )}
                        >
                          {lesson.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                          ) : lesson.contentUrl ? (
                            <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground/60 mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm leading-snug line-clamp-2",
                                active ? "text-foreground font-medium" : "text-foreground/85"
                              )}
                            >
                              {lesson.title}
                            </p>
                            {lesson.duration ? (
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {lesson.duration} min
                              </p>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
