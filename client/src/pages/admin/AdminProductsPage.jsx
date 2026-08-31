import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import SmartImage from '../../components/SmartImage.jsx';
import Spinner from '../../components/Spinner.jsx';

export default function AdminProductsPage() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api('/products');
      setItems(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  async function confirmDelete() {
    try {
      await api(`/products/${pending._id}`, { method: 'DELETE', auth: true });
      setItems((current) => current.filter((item) => item._id !== pending._id));
      push('Product deleted.');
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-ink-900">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>
      <input
        className="input mt-6 max-w-md"
        placeholder="Search management records..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search products"
      />
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream-100 text-ink-700">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} className="border-t border-cream-200">
                  <td className="p-3">
                    <SmartImage src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  </td>
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.price ? `$${item.price}` : '—'}</td>
                  <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/products/${item._id}`} className="btn-ghost px-3 py-1">
                        View
                      </Link>
                      <Link to={`/admin/products/edit/${item._id}`} className="btn-secondary px-3 py-1">
                        Edit
                      </Link>
                      <button type="button" className="btn-danger px-3 py-1" onClick={() => setPending(item)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete product"
        message="Are you sure you want to delete this product?"
        onCancel={() => setPending(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
