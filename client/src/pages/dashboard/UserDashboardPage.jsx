import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useShop } from '../../context/ShopContext.jsx';
import { api } from '../../services/api.js';
import BarChart from '../../components/charts/BarChart.jsx';
import LineChart from '../../components/charts/LineChart.jsx';
import PieChart from '../../components/charts/PieChart.jsx';
import Spinner from '../../components/Spinner.jsx';
import { formatMoney, spendByDay } from '../../utils/money.js';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { cartCount, wishlistCount } = useShop();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/orders/me', { auth: true })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const itemMix = useMemo(() => {
    const map = new Map();
    (data?.orders || []).forEach((order) => {
      order.items.forEach((item) => {
        map.set(item.name, (map.get(item.name) || 0) + item.quantity);
      });
    });
    return [...map.entries()].map(([label, value]) => ({ label, value })).slice(0, 6);
  }, [data]);

  if (loading) return <Spinner label="Loading dashboard" />;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>;

  const recent = (data.orders || []).slice(0, 5);
  const average = data.orderCount ? formatMoney(data.spent / data.orderCount) : formatMoney(0);
  const lastStatus = recent[0]?.status || 'None yet';

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">Welcome, {user?.name}</h1>
      <p className="mt-2 text-ink-700/80">Your purchases, saved pieces, and spending mix.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Orders', value: data.orderCount, className: 'bg-gradient-to-br from-clay-500 to-clay-700 text-white' },
          { label: 'Total spent', value: formatMoney(data.spent), className: 'bg-gradient-to-br from-sage-500 to-sage-600 text-white' },
          { label: 'Average order', value: average, className: 'bg-gradient-to-br from-[#E8B4B8] to-clay-400 text-ink-900' },
          { label: 'Latest status', value: lastStatus, className: 'bg-gradient-to-br from-ink-900 to-ink-700 text-cream-50' },
          { label: 'Cart items', value: cartCount, className: 'bg-gradient-to-br from-[#C4A574] to-cream-300 text-ink-900' },
          { label: 'Wishlist', value: wishlistCount, className: 'bg-gradient-to-br from-clay-400 to-sage-500 text-white' },
        ].map((card) => (
          <div key={card.label} className={`rounded-2xl p-5 shadow-card ${card.className}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{card.label}</p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LineChart title="Spending this week" series={spendByDay(data.orders)} accent="clay" />
        <BarChart title="Daily totals" series={spendByDay(data.orders)} accent="sage" />
        <PieChart title="Pieces you bought" series={itemMix.length ? itemMix : [{ label: 'No purchases yet', value: 1 }]} accent="blush" />
      </div>
      <section className="mt-8 rounded-2xl bg-gradient-to-br from-white to-cream-100 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent purchases</h2>
          <Link to="/dashboard/orders" className="text-sm font-semibold text-clay-600">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-ink-700/70">No purchases yet. When you complete checkout, orders appear here.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recent.map((order) => (
              <li key={order._id} className="flex justify-between gap-4 rounded-xl bg-white px-3 py-2 text-sm">
                <span>{order.items.map((item) => item.name).join(', ')}</span>
                <span className="font-semibold">{formatMoney(order.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
