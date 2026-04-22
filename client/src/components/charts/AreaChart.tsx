// Responsive area chart with dual-series + hover tooltip.
// Keeps the footprint small (pure SVG, no libraries). Designed for the main
// timeline card in the admin dashboard.

import { useMemo, useRef, useState } from 'react';

export interface AreaSeries {
  label: string;
  values: number[];
  color: string;
}

interface AreaChartProps {
  series: AreaSeries[];
  labels?: string[];
  height?: number;
  className?: string;
  yTicks?: number;
}

export default function AreaChart({
  series,
  labels = [],
  height = 220,
  className = '',
  yTicks = 4,
}: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [box, setBox] = useState<{ w: number }>({ w: 800 });

  // Width is dynamic — we use CSS to stretch the SVG and resample the x axis.
  // 800 is just a comfy virtual width that gives us sub-pixel precision.
  const width = 800;
  const padLeft = 36;
  const padRight = 12;
  const padTop = 10;
  const padBottom = 22;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const count = series[0]?.values.length ?? 0;
  const max = useMemo(() => {
    let m = 0;
    for (const s of series) for (const v of s.values) if (v > m) m = v;
    return Math.max(m, 1);
  }, [series]);

  const stepX = count > 1 ? innerW / (count - 1) : innerW;

  const toXY = (i: number, v: number) => {
    const x = padLeft + i * stepX;
    const y = padTop + innerH - (v / max) * innerH;
    return [x, y] as const;
  };

  const pointsFor = (vals: number[]) =>
    vals.map((v, i) => toXY(i, v).join(',')).join(' ');

  const areaFor = (vals: number[]) => {
    if (vals.length === 0) return '';
    const first = toXY(0, 0);
    const last = toXY(vals.length - 1, 0);
    return `${first[0]},${first[1]} ${pointsFor(vals)} ${last[0]},${last[1]}`;
  };

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const el = svgRef.current;
    if (!el || count === 0) return;
    const rect = el.getBoundingClientRect();
    setBox({ w: rect.width });
    const localX = ((e.clientX - rect.left) / rect.width) * width;
    const idx = Math.round((localX - padLeft) / stepX);
    const clamped = Math.max(0, Math.min(count - 1, idx));
    setHover(clamped);
  };

  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((max * (yTicks - i)) / yTicks)
  );

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`areagrad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {yTickValues.map((v, i) => {
          const y = padTop + (innerH * i) / yTicks;
          return (
            <g key={i}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="2 3"
              />
              <text
                x={padLeft - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-500"
                style={{ fontSize: 9 }}
              >
                {v}
              </text>
            </g>
          );
        })}

        {series.map((s, i) => (
          <g key={i}>
            <polygon points={areaFor(s.values)} fill={`url(#areagrad-${i})`} />
            <polyline
              points={pointsFor(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {hover !== null && count > 0 && (
          <g>
            <line
              x1={padLeft + hover * stepX}
              x2={padLeft + hover * stepX}
              y1={padTop}
              y2={padTop + innerH}
              stroke="rgba(255,255,255,0.15)"
            />
            {series.map((s, i) => {
              const [x, y] = toXY(hover, s.values[hover] ?? 0);
              return <circle key={i} cx={x} cy={y} r={3} fill={s.color} />;
            })}
          </g>
        )}
      </svg>

      {hover !== null && count > 0 && (
        <div
          className="absolute top-1 pointer-events-none rounded-md bg-slate-950/90 border border-white/10 backdrop-blur px-2.5 py-1.5 text-[11px] text-slate-200 shadow-xl"
          style={{
            left: `calc(${((padLeft + hover * stepX) / width) * 100}% - 60px)`,
            minWidth: 120,
          }}
        >
          <div className="text-[10px] text-slate-400 mb-0.5">
            {labels[hover] ?? `#${hover + 1}`}
          </div>
          {series.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 justify-between">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="tabular-nums font-medium">{s.values[hover] ?? 0}</span>
            </div>
          ))}
        </div>
      )}

      {labels.length > 0 && (
        <div className="flex justify-between mt-1 px-9 text-[10px] text-slate-500 select-none">
          <span>{labels[0]}</span>
          {labels.length > 2 && <span>{labels[Math.floor(labels.length / 2)]}</span>}
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}

      {box.w < 0 && null}
    </div>
  );
}
