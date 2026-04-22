// SVG sparkline — tiny area chart used inside KPI cards.
// No dependencies; draws a smooth polyline over a fitted viewbox so the host
// container can size freely.

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
}

export default function Sparkline({
  values,
  width = 160,
  height = 44,
  stroke = '#818cf8',
  fill = 'rgba(129,140,248,0.18)',
  className = '',
}: SparklineProps) {
  if (!values || values.length === 0) {
    return (
      <svg
        className={className}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
      />
    );
  }

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const points = values
    .map((v, i) => {
      const x = i * step;
      // Flip y — SVG y grows downward. Clamp with a 2px top/bottom padding.
      const y = height - 2 - ((v - min) / range) * (height - 4);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
    >
      <polygon points={areaPoints} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
