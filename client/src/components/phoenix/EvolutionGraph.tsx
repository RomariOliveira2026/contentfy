import { cn } from "@/lib/utils";
import type { CompetencyViewItem } from "@shared/contentfy";

export interface EvolutionGraphNode {
  id: string;
  name: string;
  progress: number;
  status: "mastered" | "evolving" | "future" | "stagnant";
}

interface EvolutionGraphProps {
  acquired?: CompetencyViewItem[];
  inProgress?: CompetencyViewItem[];
  stagnant?: CompetencyViewItem[];
  future?: Array<{ id: string; name: string }>;
  primaryGoalName?: string | null;
  className?: string;
}

function toNodes(
  acquired: CompetencyViewItem[],
  inProgress: CompetencyViewItem[],
  stagnant: CompetencyViewItem[],
  future: Array<{ id: string; name: string }>
): EvolutionGraphNode[] {
  const nodes: EvolutionGraphNode[] = [];
  const seen = new Set<string>();

  for (const c of acquired) {
    seen.add(c.id);
    nodes.push({
      id: c.id,
      name: c.name,
      progress: Math.max(c.progress, 70),
      status: "mastered",
    });
  }
  for (const c of inProgress) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    nodes.push({
      id: c.id,
      name: c.name,
      progress: c.progress,
      status: "evolving",
    });
  }
  for (const c of stagnant) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    nodes.push({
      id: c.id,
      name: c.name,
      progress: c.progress,
      status: "stagnant",
    });
  }
  for (const c of future) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    nodes.push({
      id: c.id,
      name: c.name,
      progress: 0,
      status: "future",
    });
  }
  return nodes.slice(0, 12);
}

const STATUS_STYLE: Record<
  EvolutionGraphNode["status"],
  { ring: string; fill: string; label: string }
> = {
  mastered: {
    ring: "stroke-emerald-400/70",
    fill: "fill-emerald-400/25",
    label: "Dominadas",
  },
  evolving: {
    ring: "stroke-primary/80",
    fill: "fill-primary/20",
    label: "Em evolução",
  },
  stagnant: {
    ring: "stroke-amber-400/60",
    fill: "fill-amber-400/15",
    label: "Em pausa",
  },
  future: {
    ring: "stroke-muted-foreground/35",
    fill: "fill-muted/20",
    label: "Futuras",
  },
};

/**
 * Evolution Graph™ — proprietary radial competency map.
 * Not a bar chart. Symbol of ContentFy student evolution.
 */
export function EvolutionGraph({
  acquired = [],
  inProgress = [],
  stagnant = [],
  future = [],
  primaryGoalName,
  className,
}: EvolutionGraphProps) {
  const nodes = toNodes(acquired, inProgress, stagnant, future);

  if (!nodes.length) {
    return (
      <section
        aria-label="Evolution Graph"
        className={cn(
          "cf-phoenix-panel rounded-2xl border border-border/40 p-5 sm:p-6",
          className
        )}
      >
        <Header goal={primaryGoalName} />
        <p className="text-sm text-muted-foreground mt-4">
          Sua primeira competência aparece quando você iniciar uma jornada.
          Abra a biblioteca e dê o próximo passo.
        </p>
      </section>
    );
  }

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const orbit = 112;

  return (
    <section
      aria-label="Evolution Graph"
      className={cn(
        "cf-phoenix-panel rounded-2xl border border-border/40 p-5 sm:p-6",
        className
      )}
    >
      <Header goal={primaryGoalName} />

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] items-center">
        <div className="relative mx-auto w-full max-w-[320px] aspect-square">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="h-full w-full cf-phoenix-evo-svg"
            role="img"
            aria-label="Mapa radial de competências"
          >
            <circle
              cx={cx}
              cy={cy}
              r={orbit + 28}
              className="fill-none stroke-border/40"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            <circle
              cx={cx}
              cy={cy}
              r={orbit}
              className="fill-none stroke-border/50"
              strokeWidth="1"
            />
            <circle
              cx={cx}
              cy={cy}
              r={36}
              className="fill-primary/10 stroke-primary/40"
              strokeWidth="1.5"
            />
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              fill="currentColor"
              fontSize="11"
              fontWeight="500"
              opacity="0.95"
            >
              Evolução
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fill="currentColor"
              fontSize="9"
              opacity="0.55"
            >
              ContentFy
            </text>

            {nodes.map((node, i) => {
              const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
              const r = orbit - 8 + (node.progress / 100) * 18;
              const x = cx + Math.cos(angle) * r;
              const y = cy + Math.sin(angle) * r;
              const style = STATUS_STYLE[node.status];
              const nodeR = 10 + (node.progress / 100) * 8;
              return (
                <g key={node.id} className="cf-phoenix-evo-node">
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    className="stroke-border/40"
                    strokeWidth="1"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={nodeR}
                    className={cn(style.fill, style.ring)}
                    strokeWidth="1.5"
                  />
                  <title>
                    {node.name} · {Math.round(node.progress)}% ·{" "}
                    {STATUS_STYLE[node.status].label}
                  </title>
                </g>
              );
            })}
          </svg>
        </div>

        <ul className="space-y-2.5">
          {nodes.slice(0, 8).map((node) => {
            const style = STATUS_STYLE[node.status];
            return (
              <li
                key={node.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate font-medium">{node.name}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {style.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Header({ goal }: { goal?: string | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Evolution Graph™
      </p>
      <h2 className="text-lg font-medium tracking-tight mt-1">
        Seu mapa de evolução
      </h2>
      {goal ? (
        <p className="text-sm text-muted-foreground mt-1">
          Objetivo atual:{" "}
          <span className="text-foreground/90">{goal}</span>
        </p>
      ) : null}
    </div>
  );
}
