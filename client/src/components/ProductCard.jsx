import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../services/api.js';
import SmartImage from './SmartImage.jsx';

export default function ProductCard({ product }) {
  const { user, isAdmin } = useAuth();
  const { applyCart, applyWishlist, wishlistIds } = useShop();
  const { push } = useToast();
  const navigate = useNavigate();
  const saved = wishlistIds.includes(String(product._id));
  const soldOut = product.availability === 'sold-out';

  function requireMember() {
    if (isAdmin) {
      push('Administrators manage the catalogue and cannot add items to cart or wishlist.');
      return false;
    }
    if (user) return true;
    push('Please log in to continue.');
    navigate('/login');
    return false;
  }

  async function addCart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!requireMember()) return;
    try {
      const data = await api('/cart', { method: 'POST', auth: true, body: { productId: product._id, quantity: 1 } });
      applyCart(data);
      push('Added to cart.');
    } catch (err) {
      push(err.message);
    }
  }

  async function toggleWish(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!requireMember()) return;
    try {
      const data = saved
        ? await api(`/wishlist/product/${product._id}`, { method: 'DELETE', auth: true })
        : await api('/wishlist', { method: 'POST', auth: true, body: { productId: product._id } });
      applyWishlist(data);
      push(saved ? 'Removed from wishlist.' : 'Saved to wishlist.');
    } catch (err) {
      push(err.message);
    }
  }

  return (
    <article className="card group flex h-full flex-col self-stretch transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="h-56 shrink-0 overflow-hidden">
        <SmartImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex h-7 items-center justify-between gap-3">
          <span className="chip">{product.category}</span>
          {product.price > 0 ? (
            <span className="text-sm font-semibold text-clay-600">${Number(product.price).toFixed(2)}</span>
          ) : (
            <span />
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 h-14 font-display text-xl leading-7 text-ink-900">{product.name}</h3>
        <p className="mt-2 line-clamp-3 h-[4.5rem] text-sm leading-relaxed text-ink-700/80">
          {product.shortDescription || product.description?.slice(0, 120)}
        </p>
        <div className="mt-auto space-y-2 pt-4">
          <Link to={`/products/${product._id}`} className="btn-secondary flex h-11 w-full items-center justify-center">
            View Details
          </Link>
          {!isAdmin ? (
            <div className="flex gap-2">
              <button type="button" className="btn-primary h-11 flex-1" disabled={soldOut} onClick={addCart}>
                {soldOut ? 'Sold out' : 'Add to cart'}
              </button>
              <button type="button" className="btn-secondary h-11 min-w-[6.5rem]" onClick={toggleWish}>
                {saved ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
