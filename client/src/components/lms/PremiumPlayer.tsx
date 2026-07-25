import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Maximize,
  Captions,
  Gauge,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumPlayerProps {
  title?: string;
  contentUrl?: string | null;
  lessonType?: string | null;
  className?: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export default function PremiumPlayer({
  title,
  contentUrl,
  lessonType,
  className,
}: PremiumPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [captions, setCaptions] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const hasVideo = Boolean(contentUrl && lessonType === "video");

  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#05080f] shadow-[0_24px_64px_rgba(0,0,0,0.5)]",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(playing)}
    >
      {hasVideo ? (
        <video
          key={contentUrl || "video"}
          controls
          className="h-full w-full object-contain"
          src={contentUrl || undefined}
        >
          Seu navegador não suporta vídeo.
        </video>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.18),transparent_55%),linear-gradient(180deg,#0c1220_0%,#05080f_100%)]" />
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22%23ffffff22%22/></svg>')]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPlaying((p) => !p)}
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-owl shadow-[0_12px_40px_rgba(249,115,22,0.45)]"
              aria-label={playing ? "Pausar" : "Reproduzir"}
            >
              {playing ? (
                <Pause className="h-8 w-8 text-white fill-white" />
              ) : (
                <Play className="h-8 w-8 text-white fill-white ml-1" />
              )}
            </motion.button>
            <p className="text-sm font-medium text-white/90 max-w-md line-clamp-2">
              {title || "Selecione uma aula para começar"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Player premium · preview sem vídeo
            </p>
          </div>

          {/* Fake progress */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/80 to-transparent">
            <div className="mb-3 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-owl"
                initial={false}
                animate={{ width: playing ? "38%" : "12%" }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      onClick={() => setPlaying((p) => !p)}
                    >
                      {playing ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <span className="ml-2 text-xs text-white/70 tabular-nums">
                      04:12 / 12:00
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-white hover:bg-white/10 gap-1.5"
                      onClick={cycleSpeed}
                    >
                      <Gauge className="h-3.5 w-3.5" />
                      {SPEEDS[speedIdx]}x
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className={cn(
                        "text-white hover:bg-white/10",
                        captions && "bg-white/15"
                      )}
                      onClick={() => setCaptions((c) => !c)}
                      aria-label="Legendas"
                    >
                      <Captions className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      aria-label="Tela cheia"
                      onClick={() => {
                        const el = document.documentElement;
                        if (!document.fullscreenElement) {
                          void el.requestFullscreen?.();
                        } else {
                          void document.exitFullscreen?.();
                        }
                      }}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
