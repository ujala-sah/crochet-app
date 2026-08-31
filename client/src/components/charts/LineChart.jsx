import { useMemo, useState } from 'react';
import { formatMoney } from '../../utils/money.js';
import { ACCENT_HEX, ChartCard, ChartTooltip, axisTicks, chartId, formatAxis, niceMax, seriesValue } from './chartTheme.jsx';

function smoothPath(points) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const mid = (current.x + next.x) / 2;
    d += ` C ${mid} ${current.y}, ${mid} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export default function LineChart({ title, series = [], valueFormat = 'money', accent = 'sage' }) {
  const [hover, setHover] = useState(null);
  const color = ACCENT_HEX[accent] || ACCENT_HEX.clay;
  const fillId = `${chartId(title)}-fill`;

  const chart = useMemo(() => {
    const width = 520;
    const height = 220;
    const pad = { top: 16, right: 16, bottom: 32, left: 46 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const values = series.map(seriesValue);
    const max = niceMax(Math.max(...values, 0));
    const step = series.length > 1 ? innerW / (series.length - 1) : 0;
    const points = series.map((row, index) => {
      const x = pad.left + index * (series.length > 1 ? step : innerW / 2);
      const y = pad.top + innerH - (seriesValue(row) / max) * innerH;
      return { ...row, x, y, value: seriesValue(row) };
    });
    const line = smoothPath(points);
    const area = points.length
      ? `${line} L ${points[points.length - 1].x} ${pad.top + innerH} L ${points[0].x} ${pad.top + innerH} Z`
      : '';
    return { width, height, pad, innerH, max, points, line, area };
  }, [series]);

  if (!series.length) {
    return (
      <ChartCard title={title} accent={accent}>
        <p className="py-10 text-center text-sm text-ink-700/70">No data in this window yet.</p>
      </ChartCard>
    );
  }

  const labelEvery = series.length > 10 ? Math.ceil(series.length / 6) : 1;
  const display = (value) => (valueFormat === 'money' ? formatMoney(value) : String(value));

  return (
    <ChartCard title={title} accent={accent}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="h-56 w-full"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {axisTicks(chart.max).map((tick) => {
            const y = chart.pad.top + chart.innerH - (tick / chart.max) * chart.innerH;
            return (
              <g key={tick}>
                <line x1={chart.pad.left} x2={chart.width - chart.pad.right} y1={y} y2={y} stroke="#5C4033" strokeOpacity="0.08" />
                <text x={chart.pad.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#8A7468">
                  {formatAxis(tick, valueFormat)}
                </text>
              </g>
            );
          })}
          <path d={chart.area} fill={`url(#${fillId})`} />
          <path d={chart.line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          {chart.points.map((point, index) =>
            index % labelEvery === 0 || index === chart.points.length - 1 ? (
              <text key={`l-${point.label}`} x={point.x} y={chart.height - 8} textAnchor="middle" fontSize="10" fill="#8A7468">
                {point.label || point.name}
              </text>
            ) : null
          )}
          {hover ? (
            <line x1={hover.x} x2={hover.x} y1={chart.pad.top} y2={chart.pad.top + chart.innerH} stroke={color} strokeDasharray="3 3" strokeOpacity="0.5" />
          ) : null}
          {chart.points.map((point) => (
            <circle
              key={point.label || point.name}
              cx={point.x}
              cy={point.y}
              r={hover?.label === (point.label || point.name) ? 5 : 3.5}
              fill="#FBF7F2"
              stroke={color}
              strokeWidth="2"
            />
          ))}
          {chart.points.map((point) => (
            <rect
              key={`hit-${point.label || point.name}`}
              x={point.x - 12}
              y={chart.pad.top}
              width="24"
              height={chart.innerH}
              fill="transparent"
              onMouseEnter={() => setHover(point)}
            />
          ))}
        </svg>
        <ChartTooltip label={hover?.label || hover?.name} value={hover ? display(hover.value) : ''} />
      </div>
    </ChartCard>
  );
}
