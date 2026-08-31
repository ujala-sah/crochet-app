import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatMoney } from '../utils/money.js';

const fields = [
  ['fullName', 'Full name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['address', 'Address'],
  ['city', 'City'],
  ['postalCode', 'Postal code'],
  ['country', 'Country'],
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { applyCart, refresh } = useShop();
  const { push } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState('');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api('/cart', { auth: true })
      .then((data) => {
        setCart(data);
        applyCart(data);
      })
      .catch((err) => push(err.message))
      .finally(() => setLoading(false));
  }, [applyCart, push]);

  useEffect(() => {
    if (!done) return undefined;
    const timer = setTimeout(() => navigate('/', { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [done, navigate]);

  function validate() {
    const next = {};
    fields.forEach(([name, label]) => {
      if (!String(form[name] || '').trim()) next[name] = `${label} is required.`;
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.';
    return next;
  }

  async function confirm(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      const data = await api('/orders', { method: 'POST', auth: true, body: { billing: form } });
      applyCart({ itemCount: 0 });
      await refresh();
      setDone(data.message);
    } catch (err) {
      push(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Preparing checkout" />;
  if (!cart?.items?.length && !done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <Link to="/cart" className="btn-primary mt-6">
          Back to cart
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">Order confirmed</p>
        <h1 className="mt-3 font-display text-4xl text-ink-900">{done}</h1>
        <p className="mt-4 text-ink-700/80">You will return to the home page in a moment.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-ink-900">Billing</h1>
      <p className="mt-2 text-ink-700/80">Enter your details to complete this order.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={confirm} className="card p-6" noValidate>
          {fields.map(([name, label]) => (
            <div key={name} className="mb-4">
              <label className="label" htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                className="input"
                value={form[name]}
                onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
              />
              {errors[name] && <p className="mt-1 text-sm text-red-700">{errors[name]}</p>}
            </div>
          ))}
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Confirming…' : 'Confirm order'}
          </button>
        </form>
        <aside className="card h-fit p-6">
          <h2 className="font-display text-2xl">Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatMoney(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-ink-700/10 pt-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatMoney(cart.totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax</dt>
              <dd>{formatMoney(cart.totals.tax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{formatMoney(cart.totals.shipping)}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Total</dt>
              <dd>{formatMoney(cart.totals.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
