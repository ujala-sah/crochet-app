import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-700/10 bg-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-ink-900">Yarn-Tales</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700/80">
            Everlasting yarn bouquets, flowers, and botanicals — stories you can keep on a shelf.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">Navigate</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/patterns">Patterns</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">Contact</h2>
          <p className="mt-3 text-sm">hello@yarn-tales.com</p>
          <p className="text-sm">Studio hours: daily, by appointment</p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700">Social</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-ink-700/10 py-4 text-center text-xs text-ink-700/70">
        © {new Date().getFullYear()} Yarn-Tales. All rights reserved.
      </p>
    </footer>
  );
}
