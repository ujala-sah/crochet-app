import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import SmartImage from '../../components/SmartImage.jsx';
import Spinner from '../../components/Spinner.jsx';
import { formatMoney } from '../../utils/money.js';

export default function UserOrdersPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/orders/me', { auth: true })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading purchases" />;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">Purchase history</h1>
      <p className="mt-2 text-ink-700/80">
        {data.orderCount} order{data.orderCount === 1 ? '' : 's'} · {formatMoney(data.spent)} total
      </p>
      <div className="mt-8 space-y-6">
        {(data.orders || []).length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-ink-700/80 shadow-soft">You have not completed a purchase yet.</p>
        )}
        {(data.orders || []).map((order) => (
          <article key={order._id} className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="font-semibold">{formatMoney(order.total)}</p>
            </div>
            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li key={`${order._id}-${item.product}`} className="flex items-center gap-3 text-sm">
                  <SmartImage src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-ink-700/70">
                      {item.quantity} × {formatMoney(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatMoney(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid gap-1 text-sm text-ink-700/80 sm:grid-cols-3">
              <div>Subtotal {formatMoney(order.subtotal)}</div>
              <div>Tax {formatMoney(order.tax)}</div>
              <div>Shipping {formatMoney(order.shipping)}</div>
            </dl>
            <p className="mt-3 text-sm text-ink-700/70">
              Shipped to {order.billing.fullName}, {order.billing.address}, {order.billing.city}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
