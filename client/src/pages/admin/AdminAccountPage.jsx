import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminAccountPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">Admin account</h1>
      <div className="card mt-8 max-w-xl p-6">
        <p><span className="font-semibold">Name:</span> {user?.name}</p>
        <p className="mt-2"><span className="font-semibold">Email:</span> {user?.email}</p>
        <p className="mt-2"><span className="font-semibold">Role:</span> {user?.role}</p>
      </div>
    </div>
  );
}
