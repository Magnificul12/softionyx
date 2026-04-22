// Donut chart — renders a proportional ring for a distribution.
// Shows total in the centre and a legend below. Up to ~8 segments look clean.

interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

const PALETTE = [
  '#818cf8',
  '#a78bfa',
  '#34d399',
  '#60a5fa',
  '#f472b6',
  '#fbbf24',
  '#f87171',
  '#38bdf8',
];

export default function Donut({
  segments,
  size = 160,
  thickness = 18,
  centerLabel,
  centerValue,
}: DonutProps) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const colored = segments.map((s, i) => ({
    ...s,
    color: s.color ?? PALETTE[i % PALETTE.length],
  }));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={thickness}
          />
          {total > 0 &&
            colored.map((seg, i) => {
              const frac = seg.value / total;
              const length = frac * circumference;
              const dasharray = `${length} ${circumference - length}`;
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={thickness}
                  strokeDasharray={dasharray}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += length;
              return el;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-semibold text-white tabular-nums">
            {centerValue ?? total.toLocaleString()}
          </div>
          {centerLabel && (
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
              {centerLabel}
            </div>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 w-full max-w-xs">
        {colored.map((seg, i) => {
          const pct = total > 0 ? ((seg.value / total) * 100).toFixed(0) : '0';
          return (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2 w-2 rounded-full shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-slate-300 truncate flex-1">{seg.label}</span>
              <span className="text-slate-500 tabular-nums">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
