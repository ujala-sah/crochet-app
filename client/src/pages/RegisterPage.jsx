import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const initial = { name: '', email: '', password: '', confirmPassword: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else {
      if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
      else if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
        next.password = 'Use upper and lowercase letters plus a number.';
      }
    }
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const data = await register(form);
      push(data.message);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl text-ink-900">Join Yarn-Tales</h1>
      <p className="mt-2 text-ink-700/80">Create an account to browse yarn bouquets and patterns. Catalogue edits stay with the studio admin.</p>
      <form onSubmit={handleSubmit} className="card mt-8 p-6 md:p-8" noValidate>
        {serverError && (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {serverError}
          </p>
        )}
        {[
          ['name', 'Full Name', 'text'],
          ['email', 'Email', 'email'],
          ['password', 'Password', 'password'],
          ['confirmPassword', 'Confirm Password', 'password'],
        ].map(([name, label, type]) => (
          <div key={name} className="mb-4">
            <label className="label" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              className="input"
              value={form[name]}
              onChange={update}
              autoComplete={name === 'email' ? 'email' : name.includes('password') ? 'new-password' : 'name'}
              required
            />
            {errors[name] && (
              <p className="mt-1 text-sm text-red-700" role="alert">
                {errors[name]}
              </p>
            )}
          </div>
        ))}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="font-semibold text-clay-600">Log in</Link>
        </p>
      </form>
    </div>
  );
}
