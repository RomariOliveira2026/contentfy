import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import CreatorLayout from "@/components/CreatorLayout";
import DemoFileUpload from "@/components/creator/DemoFileUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

type LessonType = "video" | "text" | "pdf" | "audio";

export default function CreatorCourseBuilder() {
  const params = useParams();
  const productId = Number(params.id);
  const utils = trpc.useUtils();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteModuleId, setDeleteModuleId] = useState<number | null>(null);
  const [deleteLessonId, setDeleteLessonId] = useState<number | null>(null);
  const [lessonDrafts, setLessonDrafts] = useState<
    Record<
      number,
      {
        title: string;
        description: string;
        type: LessonType;
        contentUrl: string;
        textContent: string;
        duration: string;
        isFree: boolean;
      }
    >
  >({});

  const { data, isLoading, isError, error, refetch } =
    trpc.creator.getCourseBuilder.useQuery(
      { productId },
      { enabled: Number.isFinite(productId) && productId > 0 }
    );

  const invalidate = () =>
    utils.creator.getCourseBuilder.invalidate({ productId });

  const createModule = trpc.creator.createModule.useMutation({
    onSuccess: () => {
      toast.success("Módulo criado");
      setNewModuleTitle("");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateModule = trpc.creator.updateModule.useMutation({
    onSuccess: () => {
      toast.success("Módulo atualizado");
      setRenameId(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteModule = trpc.creator.deleteModule.useMutation({
    onSuccess: () => {
      toast.success("Módulo excluído");
      setDeleteModuleId(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const moveModule = trpc.creator.moveModule.useMutation({
    onSuccess: () => invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const createLesson = trpc.creator.createLesson.useMutation({
    onSuccess: (_, vars) => {
      toast.success("Aula criada");
      setLessonDrafts((d) => {
        const next = { ...d };
        delete next[vars.moduleId];
        return next;
      });
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateLesson = trpc.creator.updateLesson.useMutation({
    onSuccess: () => {
      toast.success("Aula atualizada");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteLesson = trpc.creator.deleteLesson.useMutation({
    onSuccess: () => {
      toast.success("Aula excluída");
      setDeleteLessonId(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const moveLesson = trpc.creator.moveLesson.useMutation({
    onSuccess: () => invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const getDraft = (moduleId: number) =>
    lessonDrafts[moduleId] || {
      title: "",
      description: "",
      type: "video" as LessonType,
      contentUrl: "",
      textContent: "",
      duration: "",
      isFree: false,
    };

  const modules = data?.modules ?? [];

  const sortedModules = useMemo(
    () => [...modules].sort((a, b) => a.order - b.order),
    [modules]
  );

  return (
    <CreatorLayout>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Link href="/creator/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-orange-400/80 font-semibold mb-1">
              Construtor de curso
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight truncate">
              {data?.product.name || "Carregando..."}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Módulos e aulas persistidos nas tabelas existentes. Reordenação por
              botões (sem dependência de drag-and-drop).
            </p>
          </div>
          {data?.product && (
            <Badge variant={data.product.isActive ? "default" : "secondary"}>
              {data.product.isActive ? "Publicado" : "Rascunho"}
            </Badge>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <Card className="border-destructive/40">
            <CardContent className="py-8 text-center space-y-3">
              <p className="text-destructive">{error.message}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <Card className="border-white/[0.08] bg-[#0f1522]">
              <CardHeader>
                <CardTitle className="text-base">Novo módulo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Título do módulo"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                />
                <Button
                  className="shrink-0 gap-2"
                  disabled={!newModuleTitle.trim() || createModule.isPending}
                  onClick={() =>
                    createModule.mutate({
                      productId,
                      title: newModuleTitle.trim(),
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Criar módulo
                </Button>
              </CardContent>
            </Card>

            {sortedModules.length === 0 ? (
              <Card className="border-white/[0.08] bg-[#0f1522]">
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  Nenhum módulo ainda. Crie o primeiro módulo para adicionar aulas.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedModules.map((mod, index) => {
                  const open = expanded[mod.id] ?? true;
                  const draft = getDraft(mod.id);
                  return (
                    <Card
                      key={mod.id}
                      className="border-white/[0.08] bg-[#0f1522] overflow-hidden"
                    >
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                        <button
                          type="button"
                          className="p-1 text-muted-foreground"
                          onClick={() =>
                            setExpanded((e) => ({ ...e, [mod.id]: !open }))
                          }
                        >
                          {open ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          {renameId === mod.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateModule.mutate({
                                    id: mod.id,
                                    title: renameValue.trim(),
                                  })
                                }
                              >
                                Salvar
                              </Button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="font-semibold text-left truncate hover:text-primary"
                              onClick={() => {
                                setRenameId(mod.id);
                                setRenameValue(mod.title);
                              }}
                              title="Clique para renomear"
                            >
                              {mod.title}
                            </button>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {mod.lessons.length} aula(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={index === 0}
                            onClick={() =>
                              moveModule.mutate({
                                productId,
                                moduleId: mod.id,
                                direction: "up",
                              })
                            }
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={index === sortedModules.length - 1}
                            onClick={() =>
                              moveModule.mutate({
                                productId,
                                moduleId: mod.id,
                                direction: "down",
                              })
                            }
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteModuleId(mod.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {open && (
                        <CardContent className="pt-4 space-y-4">
                          {mod.lessons
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="rounded-xl border border-white/[0.06] p-3 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">
                                      {lesson.title}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      <Badge variant="outline">{lesson.type}</Badge>
                                      <Badge
                                        variant={
                                          lesson.isFree ? "secondary" : "default"
                                        }
                                      >
                                        {lesson.isFree ? "Gratuita" : "Bloqueada"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      disabled={lessonIndex === 0}
                                      onClick={() =>
                                        moveLesson.mutate({
                                          moduleId: mod.id,
                                          lessonId: lesson.id,
                                          direction: "up",
                                        })
                                      }
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      disabled={
                                        lessonIndex === mod.lessons.length - 1
                                      }
                                      onClick={() =>
                                        moveLesson.mutate({
                                          moduleId: mod.id,
                                          lessonId: lesson.id,
                                          direction: "down",
                                        })
                                      }
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() =>
                                        updateLesson.mutate({
                                          id: lesson.id,
                                          isFree: !lesson.isFree,
                                        })
                                      }
                                      title="Alternar gratuita/bloqueada"
                                    >
                                      <Badge variant="outline" className="pointer-events-none">
                                        {lesson.isFree ? "Free" : "Lock"}
                                      </Badge>
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => setDeleteLessonId(lesson.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                                {lesson.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {lesson.description}
                                  </p>
                                )}
                                {lesson.contentUrl && (
                                  <p className="text-xs text-muted-foreground break-all">
                                    Conteúdo: {lesson.contentUrl}
                                  </p>
                                )}
                              </div>
                            ))}

                          <div className="rounded-xl border border-dashed border-white/15 p-4 space-y-3">
                            <p className="text-sm font-medium">Nova aula</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Título</Label>
                                <Input
                                  value={draft.title}
                                  onChange={(e) =>
                                    setLessonDrafts((d) => ({
                                      ...d,
                                      [mod.id]: { ...draft, title: e.target.value },
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Tipo de conteúdo</Label>
                                <Select
                                  value={draft.type}
                                  onValueChange={(v) =>
                                    setLessonDrafts((d) => ({
                                      ...d,
                                      [mod.id]: {
                                        ...draft,
                                        type: v as LessonType,
                                      },
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="video">Vídeo</SelectItem>
                                    <SelectItem value="text">Texto</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="audio">Áudio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Textarea
                                rows={2}
                                value={draft.description}
                                onChange={(e) =>
                                  setLessonDrafts((d) => ({
                                    ...d,
                                    [mod.id]: {
                                      ...draft,
                                      description: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            {draft.type === "video" && (
                              <div className="space-y-2">
                                <Label>URL de vídeo</Label>
                                <Input
                                  value={draft.contentUrl}
                                  placeholder="https://..."
                                  onChange={(e) =>
                                    setLessonDrafts((d) => ({
                                      ...d,
                                      [mod.id]: {
                                        ...draft,
                                        contentUrl: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                            )}
                            {draft.type === "text" && (
                              <div className="space-y-2">
                                <Label>Texto da aula</Label>
                                <Textarea
                                  rows={4}
                                  value={draft.textContent}
                                  onChange={(e) =>
                                    setLessonDrafts((d) => ({
                                      ...d,
                                      [mod.id]: {
                                        ...draft,
                                        textContent: e.target.value,
                                        contentUrl: e.target.value
                                          ? `text://local`
                                          : "",
                                      },
                                    }))
                                  }
                                />
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/40 text-amber-400"
                                >
                                  Texto salvo como descrição + marcador; sem campo
                                  rich-text no schema
                                </Badge>
                              </div>
                            )}
                            {(draft.type === "pdf" || draft.type === "audio") && (
                              <DemoFileUpload
                                label={
                                  draft.type === "pdf"
                                    ? "PDF / material"
                                    : "Áudio"
                                }
                                accept={draft.type === "pdf" ? "pdf" : "audio"}
                                value={
                                  draft.contentUrl.startsWith("blob:")
                                    ? draft.contentUrl
                                    : ""
                                }
                                onChange={(url) =>
                                  setLessonDrafts((d) => ({
                                    ...d,
                                    [mod.id]: { ...draft, contentUrl: url },
                                  }))
                                }
                              />
                            )}
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Duração (segundos)</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  value={draft.duration}
                                  onChange={(e) =>
                                    setLessonDrafts((d) => ({
                                      ...d,
                                      [mod.id]: {
                                        ...draft,
                                        duration: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between rounded-xl border border-white/[0.08] px-3 py-2 mt-6">
                                <div>
                                  <p className="text-sm font-medium">Aula gratuita</p>
                                  <p className="text-[11px] text-muted-foreground">
                                    Preview liberado / bloqueada
                                  </p>
                                </div>
                                <Switch
                                  checked={draft.isFree}
                                  onCheckedChange={(v) =>
                                    setLessonDrafts((d) => ({
                                      ...d,
                                      [mod.id]: { ...draft, isFree: v },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-white/15 text-muted-foreground"
                            >
                              Status publicado/rascunho por aula: não existe no
                              schema — omitido nesta versão
                            </Badge>
                            <Button
                              className="gap-2"
                              disabled={
                                !draft.title.trim() || createLesson.isPending
                              }
                              onClick={() => {
                                const contentUrl =
                                  draft.type === "text"
                                    ? draft.textContent.trim() || undefined
                                    : draft.contentUrl || undefined;
                                if (
                                  contentUrl?.startsWith("blob:") &&
                                  (draft.type === "pdf" || draft.type === "audio")
                                ) {
                                  toast.error(
                                    "Upload demonstrativo não pode ser salvo. Informe uma URL persistente ou use vídeo/texto."
                                  );
                                  return;
                                }
                                createLesson.mutate({
                                  moduleId: mod.id,
                                  title: draft.title.trim(),
                                  description:
                                    draft.type === "text"
                                      ? draft.textContent || draft.description
                                      : draft.description || undefined,
                                  type: draft.type,
                                  contentUrl,
                                  duration: draft.duration
                                    ? Number(draft.duration)
                                    : undefined,
                                  isFree: draft.isFree,
                                });
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Adicionar aula
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={deleteModuleId !== null}
        onOpenChange={() => setDeleteModuleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir módulo?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as aulas deste módulo também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteModuleId && deleteModule.mutate({ id: deleteModuleId })
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteLessonId !== null}
        onOpenChange={() => setDeleteLessonId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aula?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove a aula do módulo permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteLessonId && deleteLesson.mutate({ id: deleteLessonId })
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CreatorLayout>
  );
}
