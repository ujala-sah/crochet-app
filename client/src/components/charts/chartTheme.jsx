export const CHART_COLORS = ['#C4785A', '#6F7D62', '#D49278', '#C4A574', '#8B9A7D', '#A85F44', '#E8B4B8', '#5C4033'];

export const ACCENT_HEX = {
  clay: '#C4785A',
  sage: '#6F7D62',
  blush: '#D49278',
  sand: '#C4A574',
};

export function seriesValue(row) {
  return Number(row.value ?? row.revenue ?? row.orders ?? 0);
}

export function chartId(title) {
  return String(title || 'chart')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

export function niceMax(raw) {
  const value = Math.max(Number(raw) || 0, 0);
  if (value === 0) return 1;
  const padded = value * 1.12;
  const magnitude = 10 ** Math.floor(Math.log10(padded));
  const normalized = padded / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

export function axisTicks(max, count = 4) {
  return Array.from({ length: count + 1 }, (_, index) => (max / count) * index);
}

export function formatAxis(value, valueFormat) {
  if (valueFormat === 'money') {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    if (value >= 100) return `$${Math.round(value)}`;
    return `$${value.toFixed(value < 10 && value !== 0 ? 1 : 0)}`;
  }
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(Math.round(value * 10) / 10);
}

export function ChartCard({ title, accent = 'clay', children }) {
  const rings = {
    clay: 'from-clay-500/10 via-white to-cream-50',
    sage: 'from-sage-500/15 via-white to-cream-50',
    blush: 'from-[#E8B4B8]/30 via-white to-cream-50',
    sand: 'from-[#C4A574]/20 via-white to-cream-50',
  };
  return (
    <section className={`rounded-2xl bg-gradient-to-br ${rings[accent] || rings.clay} p-5 shadow-soft ring-1 ring-ink-700/5`}>
      <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ChartTooltip({ label, value }) {
  if (!label) return null;
  return (
    <p className="mt-2 text-center text-sm text-ink-700">
      <span className="font-semibold text-ink-900">{label}</span>
      <span className="mx-1.5 text-ink-700/40">·</span>
      {value}
    </p>
  );
}
