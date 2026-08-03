import { cn } from "@/lib/utils";

interface SkillRadarProps {
  axes: Array<{ label: string; value: number }>;
  className?: string;
}

/**
 * Lightweight CSS radar — no chart libraries.
 * Values 0–100.
 */
export function SkillRadar({ axes, className }: SkillRadarProps) {
  const items = axes.slice(0, 6);
  if (!items.length) return null;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 78;
  const n = items.length;

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, value)) / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const poly = items
    .map((a, i) => {
      const p = point(i, a.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="text-foreground"
        aria-hidden
      >
        {[0.33, 0.66, 1].map((scale) => (
          <polygon
            key={scale}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            points={items
              .map((_, i) => {
                const p = point(i, 100 * scale);
                return `${p.x},${p.y}`;
              })
              .join(" ")}
          />
        ))}
        {items.map((_, i) => {
          const p = point(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
          );
        })}
        <polygon
          points={poly}
          fill="currentColor"
          fillOpacity={0.12}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={1.5}
        />
      </svg>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 w-full max-w-xs">
        {items.map((a) => (
          <li
            key={a.label}
            className="flex justify-between text-[11px] text-muted-foreground"
          >
            <span className="truncate">{a.label}</span>
            <span className="tabular-nums ml-2">{Math.round(a.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
