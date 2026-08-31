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
  category: 'Motifs',
  difficulty: 'Beginner',
  materials: '',
  estimatedSkill: '',
  additionalInfo: '',
  hookSize: '',
  yarnWeight: '',
  image: '',
  additionalImages: '',
  featured: false,
};

export default function AdminPatternFormPage() {
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
    api(`/patterns/${id}`)
      .then(({ pattern }) => {
        setForm({
          ...empty,
          ...pattern,
          additionalImages: (pattern.additionalImages || []).join('\n'),
          featured: Boolean(pattern.featured),
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
    if (!form.name || !form.description || !form.category || !form.materials || !form.image) {
      setError('Name, description, category, materials, and an image are required.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) await api(`/patterns/${id}`, { method: 'PUT', body: form, auth: true });
      else await api('/patterns', { method: 'POST', body: form, auth: true });
      push(isEdit ? 'Pattern updated.' : 'Pattern created.');
      navigate('/admin/patterns');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading pattern" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-4xl text-ink-900">{isEdit ? 'Edit Pattern' : 'Add Pattern'}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div>
          <label className="label" htmlFor="name">Pattern Name</label>
          <input id="name" name="name" className="input" value={form.name} onChange={update} required />
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
            <label className="label" htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" className="input" value={form.difficulty} onChange={update}>
              {['Beginner', 'Easy', 'Intermediate', 'Advanced'].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="materials">Materials</label>
          <textarea id="materials" name="materials" rows="3" className="input" value={form.materials} onChange={update} required />
        </div>
        <div>
          <label className="label" htmlFor="estimatedSkill">Estimated skill level</label>
          <input id="estimatedSkill" name="estimatedSkill" className="input" value={form.estimatedSkill} onChange={update} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="hookSize">Hook size</label>
            <input id="hookSize" name="hookSize" className="input" value={form.hookSize} onChange={update} />
          </div>
          <div>
            <label className="label" htmlFor="yarnWeight">Yarn weight</label>
            <input id="yarnWeight" name="yarnWeight" className="input" value={form.yarnWeight} onChange={update} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="additionalInfo">Additional information</label>
          <textarea id="additionalInfo" name="additionalInfo" rows="3" className="input" value={form.additionalInfo} onChange={update} />
        </div>
        <ImageDropzone
          label="Pattern image"
          value={form.image}
          onChange={(url) => setForm((current) => ({ ...current, image: url }))}
        />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="featured" checked={form.featured} onChange={update} />
          Featured on homepage
        </label>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create pattern'}
          </button>
          <Link to="/admin/patterns" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
