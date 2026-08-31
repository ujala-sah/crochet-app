import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatMoney } from '../utils/money.js';

export default function CartPage() {
  const { applyCart } = useShop();
  const { push } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await api('/cart', { auth: true });
      setCart(data);
      applyCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setQuantity(id, quantity) {
    setBusy(id);
    try {
      const data = await api(`/cart/${id}`, { method: 'PATCH', auth: true, body: { quantity } });
      setCart(data);
      applyCart(data);
    } catch (err) {
      push(err.message);
    } finally {
      setBusy('');
    }
  }

  async function removeItem(id) {
    setBusy(id);
    try {
      const data = await api(`/cart/${id}`, { method: 'DELETE', auth: true });
      setCart(data);
      applyCart(data);
      push('Removed from cart.');
    } catch (err) {
      push(err.message);
    } finally {
      setBusy('');
    }
  }

  if (loading) return <Spinner label="Loading cart" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-ink-700">{error}</p>
        <Link to="/login" className="btn-primary mt-6">
          Log in
        </Link>
      </div>
    );
  }

  const empty = !cart?.items?.length;
  const totals = cart.totals;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-ink-900">Shopping cart</h1>
      <p className="mt-2 text-ink-700/80">Review quantities, then proceed to billing.</p>
      {empty ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-ink-700/80">Your cart is empty.</p>
          <Link to="/products" className="btn-primary mt-6">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="card flex gap-4 p-4">
                <SmartImage src={item.product.image} alt="" className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col">
                  <Link to={`/products/${item.product._id}`} className="font-display text-xl text-ink-900">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-ink-700/70">{formatMoney(item.unitPrice)} each</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-full border border-ink-700/15">
                      <button
                        type="button"
                        className="px-3 py-1 text-lg"
                        disabled={busy === item.id}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-1 text-lg"
                        disabled={busy === item.id}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="text-sm font-semibold text-red-700" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                    <span className="ml-auto font-semibold">{formatMoney(item.lineTotal)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="card h-fit p-6">
            <h2 className="font-display text-2xl">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax (10%)</dt>
                <dd>{formatMoney(totals.tax)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-700/10 pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatMoney(totals.total)}</dd>
              </div>
            </dl>
            {totals.shipping > 0 && (
              <p className="mt-3 text-xs text-ink-700/70">
                Free shipping on orders of {formatMoney(totals.freeShippingAt)} or more.
              </p>
            )}
            <button type="button" className="btn-primary mt-6 w-full" onClick={() => navigate('/checkout')}>
              Proceed to checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
