import { useState } from 'react';
import { CHART_COLORS, ChartCard, seriesValue } from './chartTheme.jsx';

function polar(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function donutSlice(cx, cy, inner, outer, start, end) {
  const sweep = Math.min(end - start, 359.99);
  const [sx, sy] = polar(cx, cy, outer, start);
  const [ex, ey] = polar(cx, cy, outer, start + sweep);
  const [isx, isy] = polar(cx, cy, inner, start);
  const [iex, iey] = polar(cx, cy, inner, start + sweep);
  const large = sweep > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${outer} ${outer} 0 ${large} 1 ${ex} ${ey} L ${iex} ${iey} A ${inner} ${inner} 0 ${large} 0 ${isx} ${isy} Z`;
}

export default function PieChart({ title, series = [], accent = 'blush' }) {
  const [hover, setHover] = useState(null);
  const rows = series.filter((row) => seriesValue(row) > 0);
  const total = rows.reduce((sum, row) => sum + seriesValue(row), 0);
  let cursor = 0;
  const gap = rows.length > 1 ? 1.6 : 0;
  const slices = rows.map((row, index) => {
    const value = seriesValue(row);
    const start = cursor + gap / 2;
    const angle = (value / total) * 360 - gap;
    cursor += (value / total) * 360;
    return {
      ...row,
      value,
      percent: Math.round((value / total) * 1000) / 10,
      path: donutSlice(80, 80, 44, 70, start, start + Math.max(angle, 0)),
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });

  return (
    <ChartCard title={title} accent={accent}>
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <svg viewBox="0 0 160 160" className="h-44 w-44 shrink-0">
          {slices.length === 0 ? (
            <circle cx="80" cy="80" r="70" fill="#EFE4D4" />
          ) : (
            slices.map((slice) => (
              <path
                key={slice.label || slice.name}
                d={slice.path}
                fill={slice.color}
                opacity={hover && hover !== (slice.label || slice.name) ? 0.45 : 1}
                onMouseEnter={() => setHover(slice.label || slice.name)}
                onMouseLeave={() => setHover(null)}
              />
            ))
          )}
          <circle cx="80" cy="80" r="40" fill="#FBF7F2" />
          <text x="80" y="76" textAnchor="middle" fontSize="11" fill="#8A7468">
            Total
          </text>
          <text x="80" y="94" textAnchor="middle" fontSize="16" fontWeight="700" fill="#5C4033">
            {total}
          </text>
        </svg>
        <ul className="w-full space-y-2 text-sm">
          {(rows.length ? rows : series).map((row, index) => {
            const value = seriesValue(row);
            const percent = total ? Math.round((value / total) * 1000) / 10 : 0;
            return (
              <li key={row.label || row.name} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
                  {row.label || row.name}
                </span>
                <span className="tabular-nums text-ink-700/80">
                  <span className="font-semibold text-ink-900">{value}</span>
                  {total ? <span className="ml-2 text-xs">{percent}%</span> : null}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartCard>
  );
}
