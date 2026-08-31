import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BrandLogo from '../components/BrandLogo.jsx';

const items = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/account', label: 'My Account' },
  { to: '/dashboard/orders', label: 'Purchases' },
];

export default function DashboardLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-ink-700/10 bg-ink-900 p-5 text-cream-50 md:min-h-screen md:border-b-0">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <div>
            <p className="font-display text-2xl">My Dashboard</p>
            <p className="mt-1 text-xs text-cream-200">{user?.name}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-wrap gap-2 md:flex-col">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-clay-500 text-white' : 'text-cream-200 hover:bg-white/10'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className="rounded-full px-4 py-2 text-sm text-cream-200 hover:bg-white/10">
            Cart
          </NavLink>
          <NavLink to="/wishlist" className="rounded-full px-4 py-2 text-sm text-cream-200 hover:bg-white/10">
            Wishlist
          </NavLink>
          <NavLink to="/" className="rounded-full px-4 py-2 text-sm text-cream-200 hover:bg-white/10">
            View site
          </NavLink>
          <button
            type="button"
            className="rounded-full px-4 py-2 text-left text-sm text-blush hover:bg-white/10"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <div className="p-4 md:p-8">{children}</div>
    </div>
  );
}
