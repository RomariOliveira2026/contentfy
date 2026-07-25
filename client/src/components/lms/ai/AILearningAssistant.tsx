import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ACTIVE_AI_PROVIDER,
  INITIAL_CHAT,
  MOCK_FLASHCARDS,
  MOCK_MIND_MAP,
  MOCK_QUIZ,
  QUICK_ACTIONS,
  getMockReply,
} from "./mockAI";
import type { AIChatMessage, AIQuickActionId } from "./types";
import AIFlashcardsModal from "./AIFlashcardsModal";
import AIMindMap from "./AIMindMap";
import AIQuizPanel from "./AIQuizPanel";
import AISummaryCard from "./AISummaryCard";
import AIProgressStats from "./AIProgressStats";
import ProgressCard from "@/components/lms/ProgressCard";
import CertificateCard from "@/components/lms/CertificateCard";
import LessonNotes from "@/components/lms/LessonNotes";

interface AILearningAssistantProps {
  lessonTitle: string;
  lessonId: number;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  nextLessonTitle?: string | null;
  onGoNextLesson?: () => void;
  className?: string;
  onCloseMobile?: () => void;
}

export default function AILearningAssistant({
  lessonTitle,
  lessonId,
  courseTitle,
  completedLessons,
  totalLessons,
  progressPercentage,
  nextLessonTitle,
  onGoNextLesson,
  className,
  onCloseMobile,
}: AILearningAssistantProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_CHAT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [flashOpen, setFlashOpen] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [questionsHelped, setQuestionsHelped] = useState(12);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Reset panels lightly when lesson changes (keep chat continuity)
  useEffect(() => {
    setShowMindMap(false);
    setShowQuiz(false);
    setShowSummary(true);
  }, [lessonId]);

  const pushAssistant = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setQuestionsHelped((n) => n + 1);
  };

  const handleSend = (text?: string, action?: AIQuickActionId) => {
    const value = (text ?? input).trim();
    if (!value && !action) return;

    const userText =
      value ||
      QUICK_ACTIONS.find((a) => a.id === action)?.label ||
      "Ajuda";

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      const reply = getMockReply(userText, lessonTitle, action);
      setTyping(false);
      pushAssistant(reply);

      if (action === "flashcards") setFlashOpen(true);
      if (action === "mindmap") setShowMindMap(true);
      if (action === "quiz") setShowQuiz(true);
      if (action === "summarize") setShowSummary(true);
    }, 650);
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-l border-white/[0.08] bg-[#0c1220]/95 backdrop-blur-xl",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-white/[0.08] p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-owl shadow-[0_8px_24px_rgba(249,115,22,0.35)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c1220] bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold tracking-tight">Professor IA</h2>
              {onCloseMobile && (
                <Button size="icon-sm" variant="ghost" onClick={onCloseMobile}>
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-emerald-400 font-medium">● Online</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Estou acompanhando esta aula. Como posso ajudar?
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground/70">
          Provider: {ACTIVE_AI_PROVIDER} · pronto para OpenAI / Claude / Gemini
        </p>
      </div>

      <Tabs defaultValue="assistant" className="flex flex-1 flex-col min-h-0">
        <div className="px-3 pt-3">
          <TabsList className="w-full h-9 rounded-xl bg-[#111827] border border-white/[0.06]">
            <TabsTrigger value="assistant" className="flex-1 rounded-lg text-xs">
              Assistente
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex-1 rounded-lg text-xs">
              Progresso
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="assistant"
          className="mt-0 flex flex-1 flex-col min-h-0 data-[state=inactive]:hidden"
        >
          {/* Quick actions */}
          <div className="px-3 py-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Ações rápidas
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleSend(action.label, action.id)}
                  className="rounded-full border border-white/[0.08] bg-[#111827]/80 px-2.5 py-1 text-[11px] text-foreground/85 hover:border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-3 py-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "max-w-[92%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "ml-auto bg-gradient-owl text-white"
                      : "mr-auto border border-white/[0.08] bg-[#111827] text-foreground/90"
                  )}
                >
                  {msg.content}
                </motion.div>
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mr-auto rounded-2xl border border-white/[0.08] bg-[#111827] px-3 py-2 text-xs text-muted-foreground"
                  >
                    Professor IA está digitando…
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />

              {showSummary && (
                <AISummaryCard lessonTitle={lessonTitle} className="mt-2" />
              )}
              {showMindMap && (
                <AIMindMap root={MOCK_MIND_MAP} className="mt-2" />
              )}
              {showQuiz && (
                <div className="mt-2">
                  <AIQuizPanel
                    questions={MOCK_QUIZ}
                    onClose={() => setShowQuiz(false)}
                  />
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-white/[0.08] p-3">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte qualquer coisa..."
                className="h-10 rounded-xl border-white/[0.08] bg-[#111827] text-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 rounded-xl"
                disabled={!input.trim() || typing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent
          value="progress"
          className="mt-0 flex-1 overflow-y-auto px-3 py-3 space-y-3 data-[state=inactive]:hidden"
        >
          <AIProgressStats
            studiedMinutes={32}
            questionsHelped={questionsHelped}
            summaryGenerated={showSummary}
            flashcardsReady
            quizDone={showQuiz}
          />
          <ProgressCard
            courseTitle={courseTitle}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
            progressPercentage={progressPercentage}
            studiedMinutes={32}
            lastActivityLabel="Agora"
          />
          {nextLessonTitle && onGoNextLesson && (
            <div className="rounded-[1.25rem] border border-white/[0.08] bg-[#111827]/80 p-4">
              <p className="cf-caption mb-1">Próxima aula</p>
              <p className="text-sm font-semibold mb-3 line-clamp-2">
                {nextLessonTitle}
              </p>
              <Button size="sm" variant="outline" className="w-full" onClick={onGoNextLesson}>
                Ir para aula
              </Button>
            </div>
          )}
          <CertificateCard
            courseTitle={courseTitle}
            workloadHours={12}
            progressPercentage={progressPercentage}
          />
          <LessonNotes lessonId={lessonId} />
        </TabsContent>
      </Tabs>

      <AIFlashcardsModal
        open={flashOpen}
        onOpenChange={setFlashOpen}
        cards={MOCK_FLASHCARDS}
      />
    </aside>
  );
}
