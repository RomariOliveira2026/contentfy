import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { AIFlashcard } from "./types";

interface AIFlashcardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: AIFlashcard[];
}

export default function AIFlashcardsModal({
  open,
  onOpenChange,
  cards,
}: AIFlashcardsModalProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  const next = () => {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, i + 1));
  };
  const prev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-[1.25rem] border-white/[0.08] bg-[#111827] p-0 overflow-hidden">
        <div className="cf-gradient-bar" />
        <DialogHeader className="px-6 pt-5 pb-2">
          <DialogTitle className="tracking-tight">Flashcards IA</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Cartão {index + 1} de {cards.length}
          </p>
        </DialogHeader>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="group relative w-full aspect-[4/3] rounded-[1.25rem] border border-white/[0.08] bg-[#0c1220] overflow-hidden perspective-1000"
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-8 text-center"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.35 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="cf-caption mb-3">Frente</p>
                <p className="text-lg font-semibold leading-snug">{card?.front}</p>
                <p className="mt-4 text-xs text-muted-foreground">Clique para virar</p>
              </div>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/20 to-transparent"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <p className="cf-caption mb-3">Verso</p>
                <p className="text-base leading-relaxed text-foreground/90">
                  {card?.back}
                </p>
              </div>
            </motion.div>
          </button>

          <div className="mt-5 flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" onClick={prev} disabled={index === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFlipped((f) => !f)}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Virar
            </Button>
            <Button
              size="sm"
              onClick={next}
              disabled={index === cards.length - 1}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
