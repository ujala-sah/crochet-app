import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatMoney } from '../utils/money.js';

export default function WishlistPage() {
  const { applyWishlist, applyCart } = useShop();
  const { push } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/wishlist', { auth: true })
      .then((data) => {
        setItems(data.items || []);
        applyWishlist(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [applyWishlist]);

  async function remove(productId) {
    try {
      const data = await api(`/wishlist/product/${productId}`, { method: 'DELETE', auth: true });
      setItems(data.items || []);
      applyWishlist(data);
      push('Removed from wishlist.');
    } catch (err) {
      push(err.message);
    }
  }

  async function moveToCart(productId) {
    try {
      const cart = await api('/cart', { method: 'POST', auth: true, body: { productId, quantity: 1 } });
      applyCart(cart);
      const wish = await api(`/wishlist/product/${productId}`, { method: 'DELETE', auth: true });
      setItems(wish.items || []);
      applyWishlist(wish);
      push('Moved to cart.');
      navigate('/cart');
    } catch (err) {
      push(err.message);
    }
  }

  if (loading) return <Spinner label="Loading wishlist" />;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p>{error}</p>
        <Link to="/login" className="btn-primary mt-6">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-ink-900">Wishlist</h1>
      <p className="mt-2 text-ink-700/80">Pieces you have saved for later.</p>
      {items.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-ink-700/80">Your wishlist is empty.</p>
          <Link to="/products" className="btn-primary mt-6">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item._id} className="card p-4">
              <SmartImage src={item.product.image} alt="" className="h-48 w-full rounded-xl object-cover" />
              <h2 className="mt-3 font-display text-xl">{item.product.name}</h2>
              <p className="mt-1 font-semibold text-clay-600">{formatMoney(item.product.price)}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-primary flex-1" onClick={() => moveToCart(item.product._id)}>
                  Add to cart
                </button>
                <button type="button" className="btn-secondary" onClick={() => remove(item.product._id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
