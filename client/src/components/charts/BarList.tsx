// Horizontal bar list — compact ranking visualisation.
// Each row shows a label, a fill bar proportional to max, and a numeric value.

interface BarListItem {
  label: string;
  value: number;
  subValue?: number | string;
  sublabel?: string;
}

interface BarListProps {
  items: BarListItem[];
  color?: string;
  max?: number;
  emptyText?: string;
  valueFormatter?: (v: number) => string;
}

export default function BarList({
  items,
  color = '#818cf8',
  max,
  emptyText = 'No data',
  valueFormatter,
}: BarListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-slate-500 text-center py-6">{emptyText}</div>
    );
  }
  const hi = max ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-2">
      {items.map((it, i) => {
        const pct = Math.max(2, (it.value / hi) * 100);
        return (
          <li key={`${it.label}-${i}`} className="group">
            <div className="relative flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-white/[0.03] transition-colors">
              <div
                className="absolute inset-y-0 left-0 rounded-md opacity-60 group-hover:opacity-80 transition-opacity"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}55, ${color}10)`,
                  borderLeft: `2px solid ${color}`,
                }}
                aria-hidden
              />
              <div className="relative z-10 flex-1 min-w-0">
                <div className="text-sm text-white truncate">{it.label}</div>
                {it.sublabel && (
                  <div className="text-[10px] text-slate-500 truncate">{it.sublabel}</div>
                )}
              </div>
              <div className="relative z-10 text-right shrink-0">
                <div className="text-sm font-medium text-white tabular-nums">
                  {valueFormatter ? valueFormatter(it.value) : it.value.toLocaleString()}
                </div>
                {it.subValue !== undefined && (
                  <div className="text-[10px] text-slate-500 tabular-nums">
                    {typeof it.subValue === 'number'
                      ? it.subValue.toLocaleString()
                      : it.subValue}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
