export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-700" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-cream-300 border-t-clay-500" />
      <span>{label}…</span>
    </div>
  );
}
