import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
}

export default function Sparkline({
  data,
  color = "#f97316",
}: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const gradId = `spark-${color.replace("#", "")}`;
  const lastIndex = data.length - 1;

  return (
    <div className="h-10 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 2, right: 2, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            isAnimationActive
            animationDuration={800}
            dot={(props) => {
              const { cx, cy, index } = props;
              if (index !== lastIndex || cx == null || cy == null) {
                return <g key={`spark-dot-${index}`} />;
              }
              return (
                <g key={`spark-dot-current-${index}`}>
                  <circle cx={cx} cy={cy} r={5} fill={`${color}22`} />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={2.25}
                    fill={color}
                    stroke="#fff7ed"
                    strokeWidth={0.75}
                  />
                </g>
              );
            }}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
