import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import PatternCard from '../components/PatternCard.jsx';
import Spinner from '../components/Spinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';

const SUGGESTIONS = ['bouquet', 'rose', 'daisy', 'sunflower', 'wreath', 'lavender', 'peony', 'yarn flower'];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') || '';
  const [name, setName] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [scope, setScope] = useState('all');
  const [products, setProducts] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQuery(name.trim()), 280);
    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    setParams(next, { replace: true });
  }, [query, setParams]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setPatterns([]);
      setLoading(false);
      setError('');
      return;
    }
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [productData, patternData] = await Promise.all([
          api(`/products/search?name=${encodeURIComponent(query)}`),
          api(`/patterns/search?name=${encodeURIComponent(query)}`),
        ]);
        if (cancelled) return;
        setProducts(productData.products);
        setPatterns(patternData.patterns);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const productCount = products.length;
  const patternCount = patterns.length;
  const total = productCount + patternCount;
  const showProducts = scope !== 'patterns';
  const showPatterns = scope !== 'products';
  const visibleProducts = showProducts ? products : [];
  const visiblePatterns = showPatterns ? patterns : [];
  const empty = query && !loading && !error && visibleProducts.length === 0 && visiblePatterns.length === 0;

  const hint = useMemo(() => {
    if (!query) return 'Try a bloom, a colour, or a style — bouquet, rose, wreath…';
    if (loading) return 'Searching the catalogue…';
    return `${total} result${total === 1 ? '' : 's'} for “${query}”`;
  }, [query, loading, total]);

  function applySuggestion(term) {
    setName(term);
    setQuery(term);
  }

  return (
    <div>
      <section className="yarn-ring">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">Search Yarn-Tales</p>
          <h1 className="mt-2 font-display text-4xl text-ink-900 md:text-5xl">Find a yarn bloom</h1>
          <p className="mt-3 text-ink-700/80">Search products and patterns together, then narrow to one collection.</p>
          <form
            className="mt-8 rounded-3xl bg-white p-3 shadow-card sm:flex sm:items-center sm:gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(name.trim());
            }}
          >
            <label className="sr-only" htmlFor="global-search">
              Search yarn products and patterns
            </label>
            <input
              id="global-search"
              className="input border-0 shadow-none"
              placeholder="Search yarn bouquets, flowers, wreaths…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn-primary mt-2 w-full sm:mt-0 sm:w-auto">
              Search
            </button>
          </form>
          <p className="mt-3 text-sm text-ink-700/70">{hint}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  query.toLowerCase() === term ? 'bg-clay-500 text-white' : 'bg-white text-ink-700 shadow-soft'
                }`}
                onClick={() => applySuggestion(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {query && !loading && (
          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Result type">
            {[
              { id: 'all', label: `All (${total})` },
              { id: 'products', label: `Products (${productCount})` },
              { id: 'patterns', label: `Patterns (${patternCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={scope === tab.id}
                className={scope === tab.id ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setScope(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {!query && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Bouquets', text: 'Hand-tied yarn roses, peonies, and garden mixes.' },
              { title: 'Stems', text: 'Single sunflowers, tulips, hydrangeas, and daisies.' },
              { title: 'Patterns', text: 'Notes for wrapping stems, wreaths, and yarn flowers.' },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl bg-white p-5 shadow-soft">
                <h2 className="font-display text-xl text-ink-900">{card.title}</h2>
                <p className="mt-2 text-sm text-ink-700/80">{card.text}</p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="mt-6">
            <Spinner label="Searching Yarn-Tales" />
            <SkeletonGrid count={8} columns={4} />
          </div>
        )}
        {error && <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}
        {empty && (
          <EmptyState
            title="No yarn pieces found."
            message="Nothing matched that name. Try bouquet, rose, or wreath — or clear the search."
            actionLabel="Clear search"
            onAction={() => {
              setName('');
              setQuery('');
              setScope('all');
            }}
          />
        )}
        {showProducts && visibleProducts.length > 0 && (
          <section className="mt-4">
            <h2 className="font-display text-2xl">Products</h2>
            <div className="mt-4 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
        {showPatterns && visiblePatterns.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Patterns</h2>
            <div className="mt-4 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visiblePatterns.map((pattern) => (
                <PatternCard key={pattern._id} pattern={pattern} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
