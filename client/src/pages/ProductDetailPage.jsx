import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Spinner from '../components/Spinner.jsx';
import { formatMoney } from '../utils/money.js';

const availabilityLabel = {
  'in-stock': 'In stock',
  'made-to-order': 'Made to order',
  'sold-out': 'Sold out',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { applyCart, applyWishlist, wishlistIds } = useShop();
  const { push } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [active, setActive] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api(`/products/${id}`);
        setProduct(data.product);
        setActive(data.product.image);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Spinner label="Loading product" />;
  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <p className="mt-2 text-ink-700/80">{error || 'This piece is no longer in the catalogue.'}</p>
        <Link to="/products" className="btn-primary mt-6">
          Back to Products
        </Link>
      </div>
    );
  }

  const gallery = [product.image, ...(product.additionalImages || [])];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: product.name },
        ]}
      />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <SmartImage src={active} alt={product.name} className="h-[420px] w-full rounded-3xl object-cover shadow-card" />
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(src)}
                  className={`overflow-hidden rounded-xl border ${active === src ? 'border-clay-500' : 'border-transparent'}`}
                >
                  <SmartImage src={src} alt="" className="h-16 w-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <span className="chip">{product.category}</span>
          <h1 className="mt-3 font-display text-4xl text-ink-900">{product.name}</h1>
          {product.price > 0 && <p className="mt-2 text-2xl font-semibold text-clay-600">{formatMoney(product.price)}</p>}
          <p className="mt-4 leading-relaxed text-ink-700/90">{product.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-semibold">Type</dt>
              <dd>{product.productType}</dd>
            </div>
            <div>
              <dt className="font-semibold">Availability</dt>
              <dd>{availabilityLabel[product.availability] || product.availability}</dd>
            </div>
          </dl>
          {!isAdmin ? (
            <>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm font-semibold">Quantity</span>
                <div className="flex items-center rounded-full border border-ink-700/15">
                  <button type="button" className="px-3 py-1" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
                  <button type="button" className="px-3 py-1" onClick={() => setQty((n) => n + 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={product.availability === 'sold-out'}
                  onClick={async () => {
                    if (!user) {
                      push('Please log in to continue.');
                      navigate('/login');
                      return;
                    }
                    try {
                      const data = await api('/cart', {
                        method: 'POST',
                        auth: true,
                        body: { productId: product._id, quantity: qty },
                      });
                      applyCart(data);
                      push('Added to cart.');
                    } catch (err) {
                      push(err.message);
                    }
                  }}
                >
                  {product.availability === 'sold-out' ? 'Sold out' : 'Add to cart'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={async () => {
                    if (!user) {
                      push('Please log in to continue.');
                      navigate('/login');
                      return;
                    }
                    const saved = wishlistIds.includes(String(product._id));
                    try {
                      const data = saved
                        ? await api(`/wishlist/product/${product._id}`, { method: 'DELETE', auth: true })
                        : await api('/wishlist', { method: 'POST', auth: true, body: { productId: product._id } });
                      applyWishlist(data);
                      push(saved ? 'Removed from wishlist.' : 'Saved to wishlist.');
                    } catch (err) {
                      push(err.message);
                    }
                  }}
                >
                  {wishlistIds.includes(String(product._id)) ? 'Saved to wishlist' : 'Add to wishlist'}
                </button>
                <Link to="/products" className="btn-secondary">
                  Back to Products
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <p className="rounded-xl bg-cream-200 px-4 py-3 text-sm text-ink-700">
                Administrators manage the catalogue and cannot add products to cart or wishlist.
              </p>
              <Link to="/products" className="btn-secondary mt-4">
                Back to Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
