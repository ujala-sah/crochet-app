import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/Spinner.jsx';
import ImageDropzone from '../../components/ImageDropzone.jsx';

const empty = {
  name: '',
  description: '',
  shortDescription: '',
  category: 'Bags',
  productType: 'Handmade Piece',
  price: '',
  availability: 'in-stock',
  image: '',
  additionalImages: '',
  featured: false,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { push } = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api(`/products/${id}`)
      .then(({ product }) => {
        setForm({
          ...empty,
          ...product,
          additionalImages: (product.additionalImages || []).join('\n'),
          featured: Boolean(product.featured),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.category || !form.image) {
      setError('Name, description, category, and an image are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: form.price === '' ? 0 : Number(form.price) };
      if (isEdit) await api(`/products/${id}`, { method: 'PUT', body: payload, auth: true });
      else await api('/products', { method: 'POST', body: payload, auth: true });
      push(isEdit ? 'Product updated.' : 'Product created.');
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading product" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl text-ink-900">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div>
          <label className="label" htmlFor="name">Product Name</label>
          <input id="name" name="name" className="input" value={form.name} onChange={update} required />
        </div>
        <div>
          <label className="label" htmlFor="shortDescription">Short description</label>
          <input id="shortDescription" name="shortDescription" className="input" value={form.shortDescription} onChange={update} />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="5" className="input" value={form.description} onChange={update} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <input id="category" name="category" className="input" value={form.category} onChange={update} required />
          </div>
          <div>
            <label className="label" htmlFor="productType">Product type</label>
            <input id="productType" name="productType" className="input" value={form.productType} onChange={update} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="price">Price</label>
            <input id="price" name="price" type="number" min="0" step="0.01" className="input" value={form.price} onChange={update} />
          </div>
          <div>
            <label className="label" htmlFor="availability">Availability</label>
            <select id="availability" name="availability" className="input" value={form.availability} onChange={update}>
              <option value="in-stock">In stock</option>
              <option value="made-to-order">Made to order</option>
              <option value="sold-out">Sold out</option>
            </select>
          </div>
        </div>
        <ImageDropzone
          label="Product image"
          value={form.image}
          onChange={(url) => setForm((current) => ({ ...current, image: url }))}
        />
        <ImageDropzone
          label="Additional images"
          value={form.additionalImages}
          multiple
          onChange={(urls) => setForm((current) => ({ ...current, additionalImages: urls }))}
        />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="featured" checked={form.featured} onChange={update} />
          Featured on homepage
        </label>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <Link to="/admin/products" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
