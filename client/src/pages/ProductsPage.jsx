import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQuery(name), 250);
    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (query) params.set('name', query);
        if (category) params.set('category', category);
        if (productType) params.set('productType', productType);
        if (availability) params.set('availability', availability);
        const qs = params.toString();
        const data = await api(`/products${qs ? `?${qs}` : ''}`);
        setItems(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query, category, productType, availability]);

  const categories = useMemo(() => [...new Set(items.map((item) => item.category))], [items]);
  const types = useMemo(() => [...new Set(items.map((item) => item.productType).filter(Boolean))], [items]);

  function reset() {
    setName('');
    setQuery('');
    setCategory('');
    setProductType('');
    setAvailability('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink-900">Yarn products</h1>
      <p className="mt-2 max-w-2xl text-ink-700/80">
        Bouquets, stems, wreaths, and small yarn botanicals — flowers made of fibre, never of water.
      </p>

      <form className="mt-8 grid gap-3 rounded-2xl bg-white p-4 shadow-soft md:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="product-search">
          Search yarn products
        </label>
        <input
          id="product-search"
          className="input md:col-span-2"
          placeholder="Search yarn bouquets and flowers..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {['Bouquets', 'Stems', 'Bundles', 'Home Decor', 'Gifts', ...categories].filter((v, i, a) => a.indexOf(v) === i).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="input" value={productType} onChange={(e) => setProductType(e.target.value)} aria-label="Filter by product type">
          <option value="">All types</option>
          {['Yarn Bouquet', 'Yarn Flower', 'Yarn Botanical', 'Yarn Art', ...types]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>
        <select className="input md:col-span-2" value={availability} onChange={(e) => setAvailability(e.target.value)} aria-label="Filter by availability">
          <option value="">All availability</option>
          <option value="in-stock">In stock</option>
          <option value="made-to-order">Made to order</option>
          <option value="sold-out">Sold out</option>
        </select>
        <button type="button" className="btn-secondary md:col-span-2" onClick={reset}>
          Reset filters
        </button>
      </form>

      <div className="mt-10">
        {loading ? (
          <SkeletonGrid count={8} columns={4} />
        ) : error ? (
          <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No yarn products found."
            message="Try a different name or clear the filters to see the full catalogue."
            actionLabel="Reset search"
            onAction={reset}
          />
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
