import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import BarChart from '../../components/charts/BarChart.jsx';
import LineChart from '../../components/charts/LineChart.jsx';
import PieChart from '../../components/charts/PieChart.jsx';
import Spinner from '../../components/Spinner.jsx';
import { formatMoney } from '../../utils/money.js';

const cardStyles = [
  'bg-gradient-to-br from-clay-500 to-clay-700 text-white',
  'bg-gradient-to-br from-sage-500 to-sage-600 text-white',
  'bg-gradient-to-br from-[#E8B4B8] to-clay-400 text-ink-900',
  'bg-gradient-to-br from-[#C4A574] to-cream-300 text-ink-900',
  'bg-gradient-to-br from-ink-900 to-ink-700 text-cream-50',
  'bg-gradient-to-br from-clay-400 to-sage-500 text-white',
  'bg-gradient-to-br from-sage-400 to-[#E8B4B8] text-ink-900',
  'bg-gradient-to-br from-clay-600 to-ink-800 text-white',
  'bg-gradient-to-br from-[#C4A574] to-sage-600 text-white',
  'bg-gradient-to-br from-ink-800 to-clay-700 text-cream-50',
];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/users/stats', { auth: true })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard" />;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>;
  if (!data?.stats) return <p className="rounded-2xl bg-red-50 p-4 text-red-800">Dashboard data is unavailable. Refresh the page.</p>;

  const { stats } = data;
  const cards = [
    {
      label: 'Revenue',
      value: formatMoney(stats.totalRevenue),
      hint: `${formatMoney(stats.revenue30d)} in the last 30 days · ${formatMoney(stats.revenue7d)} this week`,
    },
    {
      label: 'Orders',
      value: stats.totalOrders,
      hint: `${stats.orders30d} in 30 days · ${stats.orders7d} in 7 days`,
    },
    {
      label: 'Avg order',
      value: formatMoney(stats.averageOrder),
      hint: `${stats.itemsSold} items sold across all checkouts`,
    },
    {
      label: 'Members',
      value: stats.members,
      hint: `${stats.admins} admin${stats.admins === 1 ? '' : 's'} · ${stats.totalUsers} accounts total`,
    },
    {
      label: 'Products',
      value: stats.totalProducts,
      hint: `${stats.featuredProducts} featured in the shop`,
    },
    {
      label: 'In stock',
      value: stats.inStock,
      hint: 'Ready to ship from the catalogue',
    },
    {
      label: 'Sold out',
      value: stats.soldOut,
      hint: stats.soldOut ? 'Needs a restock before new orders' : 'Every listed piece is available',
    },
    {
      label: 'Made to order',
      value: stats.madeToOrder,
      hint: 'Custom or waitlist pieces',
    },
    {
      label: 'Patterns',
      value: stats.totalPatterns,
      hint: `${stats.featuredPatterns} featured for makers`,
    },
    {
      label: 'New users',
      value: stats.newUsers,
      hint: `Last 7 days · ${stats.newUsers30d} in the last 30 days`,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-ink-900">Admin dashboard</h1>
      <p className="mt-2 text-ink-700/80">Sales, catalogue mix, and studio activity.</p>
      <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-start">
        <aside className="flex w-full max-w-sm flex-col gap-3 xl:max-w-[17rem] xl:shrink-0">
          {cards.map((card, index) => (
            <div
              key={card.label}
              className={`flex flex-col items-start rounded-2xl px-4 py-4 shadow-card ${cardStyles[index % cardStyles.length]}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{card.label}</p>
              <p className="mt-1 font-display text-3xl leading-none tabular-nums">{card.value}</p>
              <p className="mt-2 text-xs leading-snug opacity-80">{card.hint}</p>
            </div>
          ))}
        </aside>
        <div className="grid min-w-0 flex-1 gap-6 lg:grid-cols-2">
          <LineChart
            title="Revenue last 30 days"
            series={(data.salesByDay || []).map((row) => ({ label: row.label, value: row.revenue }))}
            accent="clay"
          />
          <BarChart
            title="Orders last 30 days"
            series={(data.salesByDay || []).map((row) => ({ label: row.label, value: row.orders }))}
            valueFormat="number"
            accent="sage"
            layout="vertical"
          />
          <PieChart title="Products by type" series={data.productsByType || []} accent="blush" />
          <BarChart title="Products by category" series={data.productsByCategory || []} valueFormat="number" accent="sand" layout="horizontal" />
          <PieChart title="Stock availability" series={data.availability || []} accent="sage" />
          <PieChart title="Patterns by category" series={data.patternsByCategory || []} accent="clay" />
          <PieChart title="Patterns by difficulty" series={data.patternsByDifficulty || []} accent="sand" />
          <PieChart title="Orders by status" series={data.ordersByStatus || []} accent="clay" />
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/products/new" className="btn-primary">
          Add product
        </Link>
        <Link to="/admin/patterns/new" className="btn-secondary">
          Add pattern
        </Link>
        <Link to="/admin/orders" className="btn-secondary">
          Orders
        </Link>
        <Link to="/admin/customers" className="btn-secondary">
          Customers
        </Link>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-gradient-to-br from-white to-cream-100 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-clay-600">
              View all
            </Link>
          </div>
          {(data.recentOrders || []).length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">No customer orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {data.recentOrders.map((order) => (
                <li key={order._id} className="rounded-xl bg-white/80 px-3 py-3">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-ink-900">{order.billing?.fullName || 'Customer'}</span>
                    <span className="font-semibold text-clay-600">{formatMoney(order.total)}</span>
                  </div>
                  <p className="mt-1 text-ink-700/70">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-700/55">
                    {formatDate(order.createdAt)} · {order.status || 'paid'} · {order.billing?.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-gradient-to-br from-white to-[#E8B4B8]/20 p-6 shadow-soft">
          <h2 className="font-display text-2xl">Top selling pieces</h2>
          {(data.topProducts || []).length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">Sales will appear here after checkout.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {data.topProducts.map((item) => (
                <li key={item.name} className="flex justify-between gap-4 rounded-xl bg-white/70 px-3 py-2">
                  <span>
                    {item.name}
                    <span className="mt-0.5 block text-xs text-ink-700/60">{item.quantity} sold</span>
                  </span>
                  <span className="font-semibold">{formatMoney(item.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl">Latest products</h2>
          {(data.recentProducts || []).length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">No products in the catalogue yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {data.recentProducts.map((item) => (
                <li key={item._id} className="flex justify-between gap-4">
                  <span>
                    {item.name}
                    <span className="mt-0.5 block text-xs text-ink-700/60">
                      {item.category} · {item.productType} · {item.availability?.replace('-', ' ')}
                    </span>
                  </span>
                  <span className="font-semibold">{formatMoney(item.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl">Latest patterns</h2>
          {(data.recentPatterns || []).length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">No patterns in the catalogue yet.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {data.recentPatterns.map((item) => (
                <li key={item._id}>
                  <p className="font-semibold text-ink-900">{item.name}</p>
                  <p className="text-xs text-ink-700/60">
                    {item.category} · {item.difficulty}
                    {item.hookSize ? ` · ${item.hookSize}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {(data.soldOutProducts || []).length > 0 ? (
        <section className="mt-6 rounded-2xl bg-clay-500/10 p-6 ring-1 ring-clay-500/20">
          <h2 className="font-display text-2xl text-ink-900">Sold out — restock needed</h2>
          <p className="mt-2 text-sm text-ink-700/80">{data.soldOutProducts.join(' · ')}</p>
        </section>
      ) : null}
    </div>
  );
}
