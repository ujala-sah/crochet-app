import { useMemo, useState } from 'react';
import { formatMoney } from '../../utils/money.js';
import { ACCENT_HEX, CHART_COLORS, ChartCard, ChartTooltip, axisTicks, formatAxis, niceMax, seriesValue } from './chartTheme.jsx';

export default function BarChart({ title, series = [], valueFormat = 'money', accent = 'clay', layout = 'auto' }) {
  const [hover, setHover] = useState(null);
  const color = ACCENT_HEX[accent] || ACCENT_HEX.clay;
  const values = series.map(seriesValue);
  const hasValues = values.some((value) => value > 0);
  const isCategory = layout === 'horizontal' || (layout === 'auto' && series.some((row) => String(row.label || row.name || '').length > 4));
  const max = niceMax(Math.max(...values, 0));
  const display = (value) => (valueFormat === 'money' ? formatMoney(value) : String(value));

  const chart = useMemo(() => {
    const width = 520;
    const height = isCategory ? Math.max(180, series.length * 36 + 40) : 220;
    const pad = { top: 12, right: isCategory ? 48 : 12, bottom: isCategory ? 12 : 32, left: isCategory ? 108 : 46 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const band = series.length ? (isCategory ? innerH / series.length : innerW / series.length) : 0;
    const gap = isCategory ? 10 : Math.max(2, Math.min(8, band * 0.22));
    const thickness = Math.max(8, band - gap);
    const bars = series.map((row, index) => {
      const value = seriesValue(row);
      const ratio = value / max;
      if (isCategory) {
        const y = pad.top + index * band + (band - thickness) / 2;
        const w = Math.max(value ? 4 : 0, ratio * innerW);
        return { ...row, value, x: pad.left, y, w, h: thickness, color: CHART_COLORS[index % CHART_COLORS.length] };
      }
      const x = pad.left + index * band + (band - thickness) / 2;
      const h = Math.max(value ? 4 : 0, ratio * innerH);
      const y = pad.top + innerH - h;
      return { ...row, value, x, y, w: thickness, h, color };
    });
    return { width, height, pad, innerW, innerH, bars };
  }, [series, isCategory, max, color]);

  if (!series.length) {
    return (
      <ChartCard title={title} accent={accent}>
        <p className="py-10 text-center text-sm text-ink-700/70">No data in this window yet.</p>
      </ChartCard>
    );
  }

  const labelEvery = !isCategory && series.length > 10 ? Math.ceil(series.length / 7) : 1;

  return (
    <ChartCard title={title} accent={accent}>
      <div className="relative">
        <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="w-full" style={{ height: isCategory ? Math.min(320, 28 * series.length + 48) : 224 }} onMouseLeave={() => setHover(null)}>
          {isCategory
            ? axisTicks(max).map((tick) => {
                const x = chart.pad.left + (tick / max) * chart.innerW;
                return (
                  <g key={tick}>
                    <line x1={x} x2={x} y1={chart.pad.top} y2={chart.height - chart.pad.bottom} stroke="#5C4033" strokeOpacity="0.08" />
                    <text x={x} y={chart.height - 2} textAnchor="middle" fontSize="10" fill="#8A7468">
                      {formatAxis(tick, valueFormat)}
                    </text>
                  </g>
                );
              })
            : axisTicks(max).map((tick) => {
                const y = chart.pad.top + chart.innerH - (tick / max) * chart.innerH;
                return (
                  <g key={tick}>
                    <line x1={chart.pad.left} x2={chart.width - chart.pad.right} y1={y} y2={y} stroke="#5C4033" strokeOpacity="0.08" />
                    <text x={chart.pad.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#8A7468">
                      {formatAxis(tick, valueFormat)}
                    </text>
                  </g>
                );
              })}
          {chart.bars.map((bar, index) => (
            <g key={bar.label || bar.name} onMouseEnter={() => setHover(bar)}>
              {isCategory ? (
                <text x={chart.pad.left - 8} y={bar.y + bar.h / 2 + 4} textAnchor="end" fontSize="11" fill="#5C4033">
                  {(bar.label || bar.name || '').slice(0, 14)}
                </text>
              ) : null}
              <rect x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx="4" fill={bar.color} opacity={hover && hover.label !== bar.label ? 0.45 : 1} />
              {isCategory && bar.value ? (
                <text x={bar.x + bar.w + 6} y={bar.y + bar.h / 2 + 4} fontSize="11" fill="#5C4033">
                  {display(bar.value)}
                </text>
              ) : null}
              {!isCategory && (index % labelEvery === 0 || index === chart.bars.length - 1) ? (
                <text x={bar.x + bar.w / 2} y={chart.height - 8} textAnchor="middle" fontSize="10" fill="#8A7468">
                  {bar.label || bar.name}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
        {!hasValues ? <p className="mt-1 text-center text-sm text-ink-700/70">No activity in this window yet.</p> : null}
        <ChartTooltip label={hover?.label || hover?.name} value={hover ? display(hover.value) : ''} />
      </div>
    </ChartCard>
  );
}
