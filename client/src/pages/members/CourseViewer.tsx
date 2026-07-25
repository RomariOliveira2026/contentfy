import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Heart,
  Share2,
  Trophy,
  PlayCircle,
  Menu,
  X,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import PremiumPlayer from "@/components/lms/PremiumPlayer";
import CourseCurriculumSidebar from "@/components/lms/CourseCurriculumSidebar";
import LessonExtras from "@/components/lms/LessonExtras";
import AILearningAssistant from "@/components/lms/ai/AILearningAssistant";
import {
  DEMO_COURSE_TITLE,
  DEMO_MODULES,
  computeDemoStats,
} from "@/components/lms/demoCurriculum";
import type { LmsLesson, LmsModule } from "@/components/lms/types";

function favoritesKey(productId: number) {
  return `contentfy-lms-fav-${productId}`;
}

function loadFavorites(productId: number): number[] {
  try {
    const raw = localStorage.getItem(favoritesKey(productId));
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export default function CourseViewer() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);

  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);
  const [demoModules, setDemoModules] = useState<LmsModule[]>(DEMO_MODULES);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = trpc.members.getCourseStructure.useQuery(
    { productId },
    { enabled: productId > 0, retry: false }
  );

  const markCompleteMutation = trpc.members.markLessonComplete.useMutation({
    onSuccess: () => {
      toast.success("Progresso salvo!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const useDemo =
    isError ||
    !courseData ||
    !courseData.modules ||
    courseData.modules.length === 0;

  const modules: LmsModule[] = useDemo
    ? demoModules
    : (courseData!.modules as LmsModule[]);

  const stats = useDemo
    ? computeDemoStats(demoModules)
    : courseData!.stats;

  const courseTitle = useDemo ? DEMO_COURSE_TITLE : "Curso Online";

  const currentLesson: LmsLesson | undefined = useMemo(
    () => modules.flatMap((m) => m.lessons).find((l) => l.id === currentLessonId),
    [modules, currentLessonId]
  );

  const nextLesson = useMemo(() => {
    const all = modules.flatMap((m) => m.lessons);
    const idx = all.findIndex((l) => l.id === currentLessonId);
    return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  }, [modules, currentLessonId]);

  useEffect(() => {
    setFavorites(loadFavorites(productId));
  }, [productId]);

  useEffect(() => {
    if (initialized || modules.length === 0) return;

    const firstIncomplete = modules
      .flatMap((m) => m.lessons)
      .find((l) => !l.isCompleted);
    const first = firstIncomplete || modules[0]?.lessons[0];
    if (!first) return;

    setCurrentLessonId(first.id);
    const moduleWithLesson = modules.find((m) =>
      m.lessons.some((l) => l.id === first.id)
    );
    if (moduleWithLesson) {
      setExpandedModules([moduleWithLesson.id]);
    }
    setInitialized(true);
  }, [modules, initialized]);

  // Reset init when product changes
  useEffect(() => {
    setInitialized(false);
    setCurrentLessonId(null);
    setExpandedModules([]);
    setDemoModules(DEMO_MODULES);
  }, [productId]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lessonId: number) => {
    setCurrentLessonId(lessonId);
    setMobileNavOpen(false);
    try {
      localStorage.setItem(
        `contentfy-lms-continue-${productId}`,
        JSON.stringify({ lessonId, at: Date.now() })
      );
    } catch {
      /* ignore */
    }
  };

  const handleMarkComplete = () => {
    if (!currentLesson) return;

    if (useDemo) {
      setDemoModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) =>
            l.id === currentLesson.id
              ? { ...l, isCompleted: !l.isCompleted }
              : l
          ),
        }))
      );
      toast.success(
        currentLesson.isCompleted
          ? "Marcada como não concluída (demo)"
          : "Aula concluída (demo)"
      );
      return;
    }

    markCompleteMutation.mutate({
      lessonId: currentLesson.id,
      isCompleted: !currentLesson.isCompleted,
    });
  };

  const isFavorite = currentLesson
    ? favorites.includes(currentLesson.id)
    : false;

  const toggleFavorite = () => {
    if (!currentLesson) return;
    const next = isFavorite
      ? favorites.filter((id) => id !== currentLesson.id)
      : [...favorites, currentLesson.id];
    setFavorites(next);
    localStorage.setItem(favoritesKey(productId), JSON.stringify(next));
    toast.success(isFavorite ? "Removida dos favoritos" : "Aula favoritada");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentLesson?.title || courseTitle,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado");
      }
    } catch {
      toast.message("Compartilhamento cancelado");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Skeleton className="h-[80vh] lg:col-span-3 rounded-[1.25rem]" />
          <Skeleton className="h-[80vh] lg:col-span-6 rounded-[1.25rem]" />
          <Skeleton className="h-[80vh] lg:col-span-3 rounded-[1.25rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070B12]/85 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              size="icon-sm"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Abrir currículo"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link href="/my-account/products">
              <Button size="sm" variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Biblioteca</span>
              </Button>
            </Link>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="truncate text-sm font-medium">{courseTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            {useDemo && (
              <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 hidden sm:inline-flex">
                Preview LMS
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="lg:hidden gap-1.5"
              onClick={() => setMobileAiOpen(true)}
            >
              <Bot className="h-4 w-4 text-primary" />
              Professor IA
            </Button>
            <Badge variant="outline" className="border-white/10">
              {stats.progressPercentage}%
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-3.5rem)]">
        {/* Left curriculum */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3 h-[calc(100vh-3.5rem)] sticky top-14">
          <CourseCurriculumSidebar
            courseTitle={courseTitle}
            modules={modules}
            stats={stats}
            currentLessonId={currentLessonId}
            expandedModules={expandedModules}
            onToggleModule={toggleModule}
            onSelectLesson={handleLessonClick}
          />
        </div>

        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[min(100%,20rem)] shadow-2xl">
              <div className="absolute top-3 right-3 z-10">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CourseCurriculumSidebar
                courseTitle={courseTitle}
                modules={modules}
                stats={stats}
                currentLessonId={currentLessonId}
                expandedModules={expandedModules}
                onToggleModule={toggleModule}
                onSelectLesson={handleLessonClick}
              />
            </div>
          </div>
        )}

        {/* Main */}
        <main className="lg:col-span-6 xl:col-span-6 px-4 py-5 lg:px-6 lg:py-6 space-y-5">
          {currentLesson ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="cf-caption mb-2">Aula atual</p>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
                    {currentLesson.title}
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {currentLesson.description ||
                      "Acompanhe o conteúdo e marque como concluída ao finalizar."}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {currentLesson.duration ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        {currentLesson.duration} min estimados
                      </span>
                    ) : null}
                    {currentLesson.isCompleted && (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                        Concluída
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button
                    size="sm"
                    variant={isFavorite ? "default" : "outline"}
                    onClick={toggleFavorite}
                    className={cn(isFavorite && "bg-gradient-owl")}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 mr-2",
                        isFavorite && "fill-current"
                      )}
                    />
                    {isFavorite ? "Favorita" : "Favoritar"}
                  </Button>
                </div>
              </div>

              <PremiumPlayer
                title={currentLesson.title}
                contentUrl={currentLesson.contentUrl}
                lessonType={currentLesson.type}
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleMarkComplete}
                  variant={currentLesson.isCompleted ? "outline" : "default"}
                  disabled={markCompleteMutation.isPending}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {currentLesson.isCompleted
                    ? "Desmarcar conclusão"
                    : "Marcar como concluída"}
                </Button>
                {nextLesson && (
                  <Button
                    variant="ghost"
                    onClick={() => handleLessonClick(nextLesson.id)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Próxima aula
                  </Button>
                )}
              </div>

              <LessonExtras lesson={currentLesson} />
            </>
          ) : (
            <div className="rounded-[1.25rem] border border-white/[0.08] bg-card p-12 text-center">
              <p className="text-muted-foreground">
                Selecione uma aula na barra lateral para começar.
              </p>
            </div>
          )}
        </main>

        {/* Right — AI Learning Assistant */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3 h-[calc(100vh-3.5rem)] sticky top-14">
          {currentLesson ? (
            <AILearningAssistant
              lessonTitle={currentLesson.title}
              lessonId={currentLesson.id}
              courseTitle={courseTitle}
              completedLessons={stats.completedLessons}
              totalLessons={stats.totalLessons}
              progressPercentage={stats.progressPercentage}
              nextLessonTitle={nextLesson?.title}
              onGoNextLesson={
                nextLesson ? () => handleLessonClick(nextLesson.id) : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center border-l border-white/[0.08] bg-[#0c1220]/60 p-6 text-center text-sm text-muted-foreground">
              Selecione uma aula para ativar o Professor IA.
            </div>
          )}
        </div>
      </div>

      {/* Mobile AI drawer */}
      {mobileAiOpen && currentLesson && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileAiOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[min(100%,24rem)] shadow-2xl">
            <AILearningAssistant
              lessonTitle={currentLesson.title}
              lessonId={currentLesson.id}
              courseTitle={courseTitle}
              completedLessons={stats.completedLessons}
              totalLessons={stats.totalLessons}
              progressPercentage={stats.progressPercentage}
              nextLessonTitle={nextLesson?.title}
              onGoNextLesson={
                nextLesson
                  ? () => {
                      handleLessonClick(nextLesson.id);
                      setMobileAiOpen(false);
                    }
                  : undefined
              }
              onCloseMobile={() => setMobileAiOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      {currentLesson && !mobileAiOpen && (
        <button
          type="button"
          onClick={() => setMobileAiOpen(true)}
          className="lg:hidden fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-owl text-white shadow-[0_12px_32px_rgba(249,115,22,0.45)]"
          aria-label="Abrir Professor IA"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
