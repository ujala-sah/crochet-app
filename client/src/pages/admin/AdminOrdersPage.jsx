import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Spinner from '../../components/Spinner.jsx';
import { formatMoney } from '../../utils/money.js';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/orders', { auth: true })
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading orders" />;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">Customer orders</h1>
      <p className="mt-2 text-ink-700/80">{orders.length} paid order{orders.length === 1 ? '' : 's'}.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-ink-700/10 text-xs uppercase tracking-wide text-ink-700/70">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-ink-700/5">
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {order.user?.name || order.billing.fullName}
                  <p className="text-ink-700/60">{order.user?.email || order.billing.email}</p>
                </td>
                <td className="px-4 py-3">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</td>
                <td className="px-4 py-3 font-semibold">{formatMoney(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
