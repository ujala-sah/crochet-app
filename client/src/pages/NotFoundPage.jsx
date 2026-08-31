import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-4xl text-ink-900">Page not found</h1>
      <p className="mt-3 text-ink-700/80">That bloom isn’t in this tale. Return to the Yarn-Tales homepage.</p>
      <Link to="/" className="btn-primary mt-6">
        Home
      </Link>
    </div>
  );
}
