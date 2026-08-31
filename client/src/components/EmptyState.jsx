import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, actionLabel, onAction, to }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-700/20 bg-white px-6 py-16 text-center">
      <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-700/80">{message}</p>
      {to && (
        <Link to={to} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {onAction && (
        <button type="button" className="btn-primary mt-6" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
