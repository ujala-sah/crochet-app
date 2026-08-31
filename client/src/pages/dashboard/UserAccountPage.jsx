import { useAuth } from '../../context/AuthContext.jsx';

export default function UserAccountPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">My Account</h1>
      <p className="mt-2 text-ink-700/80">Your profile details for Yarn-Tales.</p>
      <div className="card mt-8 max-w-xl p-6">
        <p><span className="font-semibold">Name:</span> {user?.name}</p>
        <p className="mt-2"><span className="font-semibold">Email:</span> {user?.email}</p>
        <p className="mt-2"><span className="font-semibold">Role:</span> {user?.role}</p>
        <p className="mt-2">
          <span className="font-semibold">Joined:</span>{' '}
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
        </p>
      </div>
    </div>
  );
}
