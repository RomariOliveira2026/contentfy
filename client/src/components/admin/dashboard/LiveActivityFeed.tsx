import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { demoLiveActivity } from "@/lib/admin/demoDashboardData";
import { cn } from "@/lib/utils";

const DOT: Record<string, string> = {
  affiliate: "bg-sky-400",
  sale: "bg-emerald-400",
  product: "bg-amber-400",
  commission: "bg-orange-400",
};

export default function LiveActivityFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % demoLiveActivity.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const current = demoLiveActivity[index];
  const visible = [
    current,
    demoLiveActivity[(index + 1) % demoLiveActivity.length],
    demoLiveActivity[(index + 2) % demoLiveActivity.length],
  ];

  return (
    <div className="space-y-3 min-h-[9.5rem]">
      <AnimatePresence mode="popLayout">
        {visible.map((item, i) => (
          <motion.div
            key={`${item.id}-${index}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1 - i * 0.15, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-start gap-2.5 text-sm"
          >
            <span
              className={cn(
                "mt-1.5 h-2 w-2 rounded-full shrink-0",
                DOT[item.type] || "bg-primary"
              )}
            />
            <p className="text-foreground/90 leading-snug">{item.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
