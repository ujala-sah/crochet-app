import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import PatternCard from '../components/PatternCard.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [productData, patternData] = await Promise.all([
          api('/products?featured=true'),
          api('/patterns?featured=true'),
        ]);
        setProducts(productData.products.slice(0, 12));
        setPatterns(patternData.patterns.slice(0, 12));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <section className="yarn-ring relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay-600">Yarn botanicals</p>
            <h1 className="mt-3 font-display text-5xl leading-tight text-ink-900 md:text-6xl">
              Stitch Something Beautiful
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-700/85">
              Explore everlasting yarn bouquets, single stems, and patterns — flowers that never fade, made entirely of fibre.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Browse Products
              </Link>
              <Link to="/patterns" className="btn-secondary">
                Explore Patterns
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-blush/50" aria-hidden="true" />
            <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-sage-400/40" aria-hidden="true" />
            <img
              src="/images/yt-hero-bouquet.png"
              alt="Handmade yarn flower bouquet held in a garden"
              className="relative z-10 h-[420px] w-full rounded-[2rem] object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">From the studio</p>
            <h2 className="font-display text-3xl text-ink-900">Featured Products</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-clay-600">
            View all
          </Link>
        </div>
        {loading ? (
          <SkeletonGrid count={12} columns={4} />
        ) : error ? (
          <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">For makers</p>
              <h2 className="font-display text-3xl text-ink-900">Featured Patterns</h2>
            </div>
            <Link to="/patterns" className="text-sm font-semibold text-clay-600">
              View all
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid count={12} columns={4} />
          ) : (
            <div className="grid items-stretch gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {patterns.map((pattern) => (
                <PatternCard key={pattern._id} pattern={pattern} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl text-ink-900">A quieter place for yarn flowers</h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-700/85">
          Yarn-Tales is a catalogue of bouquets, stems, and written patterns. Browse freely, search by bloom, and meet
          the four people who design, write, photograph, and finish each piece.
        </p>
        <Link to="/about" className="btn-secondary mt-6">
          Our story
        </Link>
      </section>
    </div>
  );
}
