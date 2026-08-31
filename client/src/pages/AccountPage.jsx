import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl text-ink-900">My Account</h1>
      <div className="card mt-8 p-6">
        <p><span className="font-semibold">Name:</span> {user?.name}</p>
        <p className="mt-2"><span className="font-semibold">Email:</span> {user?.email}</p>
        <p className="mt-2"><span className="font-semibold">Role:</span> {user?.role}</p>
        <p className="mt-4 text-sm text-ink-700/80">
          Members can browse yarn products and patterns. Catalogue edits are reserved for administrators.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/products" className="btn-primary">
            Browse products
          </Link>
          <Link to="/patterns" className="btn-secondary">
            Browse patterns
          </Link>
        </div>
      </div>
    </div>
  );
}
