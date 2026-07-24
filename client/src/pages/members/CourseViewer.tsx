import { useState } from "react";
import { useParams } from "wouter";
import MembersLayout from "@/components/MembersLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import {
  Play,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CourseViewer() {
  const { id } = useParams();
  const productId = parseInt(id || "0");

  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

  const { data: courseData, isLoading, refetch } = trpc.members.getCourseStructure.useQuery(
    { productId },
    { enabled: productId > 0 }
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

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonClick = (lessonId: number) => {
    setCurrentLessonId(lessonId);
  };

  const handleMarkComplete = (lessonId: number, isCompleted: boolean) => {
    markCompleteMutation.mutate({
      lessonId,
      isCompleted: !isCompleted,
    });
  };

  // Encontrar a aula atual
  const currentLesson = courseData?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === currentLessonId);

  // Se não houver aula selecionada, selecionar a primeira não concluída
  if (!currentLessonId && courseData && courseData.modules.length > 0) {
    const firstIncompleteLesson = courseData.modules
      .flatMap((m) => m.lessons)
      .find((l) => !l.isCompleted);
    
    if (firstIncompleteLesson) {
      setCurrentLessonId(firstIncompleteLesson.id);
      // Expandir o módulo da primeira aula
      const moduleWithLesson = courseData.modules.find((m) =>
        m.lessons.some((l) => l.id === firstIncompleteLesson.id)
      );
      if (moduleWithLesson && !expandedModules.includes(moduleWithLesson.id)) {
        setExpandedModules([moduleWithLesson.id]);
      }
    }
  }

  if (isLoading) {
    return (
      <MembersLayout>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </MembersLayout>
    );
  }

  if (!courseData) {
    return (
      <MembersLayout>
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Curso não encontrado</h2>
            <p className="text-muted-foreground">
              Você não possui acesso a este curso ou ele não existe.
            </p>
          </CardContent>
        </Card>
      </MembersLayout>
    );
  }

  return (
    <MembersLayout>
      <div className="space-y-6">
        {/* Header do Curso */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="mb-2">Curso Online</Badge>
                <CardTitle className="text-2xl mb-2">
                  Curso Online
                </CardTitle>
                <p className="text-muted-foreground">
                  Aprenda no seu ritmo com aulas em vídeo
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso do Curso</span>
                <span className="font-medium">
                  {courseData.stats.progressPercentage}%
                </span>
              </div>
              <Progress value={courseData.stats.progressPercentage} />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {courseData.stats.completedLessons} de{" "}
                  {courseData.stats.totalLessons} aulas concluídas
                </span>
                <span>•</span>
                <span>{courseData.stats.totalModules} módulos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player de Vídeo */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  {currentLesson?.contentUrl && currentLesson.type === 'video' ? (
                    <video
                      key={currentLesson.id}
                      controls
                      className="w-full h-full"
                      src={currentLesson.contentUrl}
                    >
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">
                        {currentLesson
                          ? "Vídeo não disponível"
                          : "Selecione uma aula para começar"}
                      </p>
                    </div>
                  )}
                </div>

                {currentLesson && (
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">
                      {currentLesson.title}
                    </h2>
                    {currentLesson.description && (
                      <p className="text-muted-foreground mb-4">
                        {currentLesson.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() =>
                          handleMarkComplete(
                            currentLesson.id,
                            currentLesson.isCompleted
                          )
                        }
                        variant={currentLesson.isCompleted ? "outline" : "default"}
                        disabled={markCompleteMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {currentLesson.isCompleted
                          ? "Marcar como Não Concluída"
                          : "Marcar como Concluída"}
                      </Button>

                      {currentLesson.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{currentLesson.duration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Descrição e Recursos */}
            {currentLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre esta Aula</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {currentLesson.description ||
                      "Nesta aula você aprenderá conceitos importantes que vão te ajudar a dominar o conteúdo do curso."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Lista de Aulas */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Conteúdo do Curso</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-6 pt-0 space-y-2">
                    {courseData.modules.map((module) => (
                      <div key={module.id} className="space-y-2">
                        {/* Module Header */}
                        <Button
                          variant="ghost"
                          className="w-full justify-between h-auto py-3"
                          onClick={() => toggleModule(module.id)}
                        >
                          <div className="flex items-start gap-3 text-left flex-1">
                            <div className="mt-0.5">
                              {expandedModules.includes(module.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{module.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {module.lessons.filter((l) => l.isCompleted).length}{" "}
                                / {module.lessons.length} aulas
                              </p>
                            </div>
                          </div>
                        </Button>

                        {/* Lessons List */}
                        {expandedModules.includes(module.id) && (
                          <div className="ml-4 space-y-1">
                            {module.lessons.map((lesson) => (
                              <Button
                                key={lesson.id}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start h-auto py-2 text-left",
                                  currentLessonId === lesson.id &&
                                    "bg-accent"
                                )}
                                onClick={() => handleLessonClick(lesson.id)}
                              >
                                <div className="flex items-start gap-3 flex-1">
                                  {lesson.isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  ) : lesson.contentUrl ? (
                                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-2">
                                      {lesson.title}
                                    </p>
                                    {lesson.duration && (
                                      <p className="text-xs text-muted-foreground">
                                        {lesson.duration} min
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}

                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MembersLayout>
  );
}
