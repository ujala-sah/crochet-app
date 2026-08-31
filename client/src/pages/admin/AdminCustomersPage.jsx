import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Spinner from '../../components/Spinner.jsx';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/users', { auth: true })
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading customers" />;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">Customers</h1>
      <p className="mt-2 text-ink-700/80">{users.length} accounts on Yarn-Tales.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-700/10 text-xs uppercase tracking-wide text-ink-700/70">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-ink-700/5">
                <td className="px-4 py-3 font-semibold">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
