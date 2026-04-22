// Conversion funnel — shows stepwise drop-off from the top-of-funnel to goal.
// Each step renders as a shrinking bar with absolute count + retention%.

interface FunnelStep {
  label: string;
  value: number;
}

interface FunnelProps {
  steps: FunnelStep[];
  color?: string;
}

export default function Funnel({ steps, color = '#a78bfa' }: FunnelProps) {
  if (!steps || steps.length === 0) {
    return <div className="text-sm text-slate-500">No data</div>;
  }
  const top = steps[0].value || 1;

  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const pct = top > 0 ? (s.value / top) * 100 : 0;
        // Drop-off from previous step.
        const prev = i > 0 ? steps[i - 1].value : null;
        const retention =
          prev !== null && prev > 0 ? ((s.value / prev) * 100).toFixed(0) : null;
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="text-xs text-slate-300">{s.label}</div>
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-sm font-semibold text-white">
                  {s.value.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">{pct.toFixed(0)}%</span>
                {retention !== null && (
                  <span className="text-[10px] text-indigo-300">→ {retention}%</span>
                )}
              </div>
            </div>
            <div className="relative h-3 rounded-full bg-white/[0.04] border border-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}77)`,
                  boxShadow: `0 0 18px ${color}55`,
                  transition: 'width 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
