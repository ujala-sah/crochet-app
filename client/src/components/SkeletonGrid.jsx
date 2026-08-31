export default function SkeletonGrid({ count = 6, columns = 3 }) {
  const cols =
    columns === 6
      ? 'grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      : columns === 4
        ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={cols} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-56 bg-cream-200" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 rounded bg-cream-200" />
            <div className="h-6 w-3/4 rounded bg-cream-200" />
            <div className="h-4 w-full rounded bg-cream-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
