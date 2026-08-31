import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/patterns', label: 'Patterns' },
  { to: '/about', label: 'About' },
];

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-9.2-8.2C1 8.6 2.8 5.5 6.2 5.2c1.8-.2 3.4.7 4.4 2.1 1-1.4 2.6-2.3 4.4-2.1 3.4.3 5.2 3.4 3.4 6.6C19 15.6 12 20 12 20z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.4-3 4-4.5 7-4.5S17.6 16 19 19" strokeLinecap="round" />
    </svg>
  );
}

function IconMenu({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function IconButton({ to, label, count, children, onClick, active }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={count ? `${label}, ${count}` : label}
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
        active
          ? 'border-clay-500 bg-clay-500 text-white'
          : 'border-ink-700/10 bg-white text-ink-800 hover:border-clay-500 hover:text-clay-600'
      }`}
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-500 px-1 text-[10px] font-bold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useShop();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dashboardTo = isAdmin ? '/admin' : '/dashboard';

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden border-b border-ink-700/10 bg-ink-900 text-cream-50 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs tracking-wide">
          <p className="font-medium text-cream-200">Handmade yarn bouquets · Kathmandu studio</p>
          <p className="text-cream-200/80">Free shipping on orders over $75</p>
        </div>
      </div>
      <div className="border-b border-ink-700/10 bg-cream-50/95 shadow-soft backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <BrandLogo />
            <span className="min-w-0">
              <span className="block font-display text-2xl leading-none text-ink-900">
                Yarn-<span className="text-clay-500">Tales</span>
              </span>
              <span className="mt-0.5 hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700/60 sm:block">
                Yarn botanicals
              </span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-cream-200 text-clay-600' : 'text-ink-700 hover:bg-cream-200/70 hover:text-clay-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <IconButton to="/search" label="Search" active={location.pathname === '/search'} onClick={() => setOpen(false)}>
              <IconSearch />
            </IconButton>
            {!isAdmin ? (
              <>
                <IconButton
                  to="/wishlist"
                  label="Wishlist"
                  count={wishlistCount}
                  active={location.pathname === '/wishlist'}
                  onClick={() => setOpen(false)}
                >
                  <IconHeart />
                </IconButton>
                <IconButton
                  to="/cart"
                  label="Cart"
                  count={cartCount}
                  active={location.pathname === '/cart'}
                  onClick={() => setOpen(false)}
                >
                  <IconBag />
                </IconButton>
              </>
            ) : null}
            <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <Link
                  to={dashboardTo}
                  className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-ink-800"
                >
                  <IconUser />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-ink-700 hover:text-clay-600">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Join
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-700/10 bg-white text-ink-800 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <IconMenu open={open} />
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          className={`${open ? 'grid' : 'hidden'} gap-1 border-t border-ink-700/10 px-4 py-4 lg:hidden`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-cream-200 text-clay-600' : 'text-ink-800'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink
              to={dashboardTo}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-cream-50 sm:hidden"
            >
              Dashboard
            </NavLink>
          ) : (
            <div className="mt-2 flex gap-2 sm:hidden">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">
                Log in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">
                Join
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
