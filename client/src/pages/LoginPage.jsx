import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      push('Welcome back.');
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      if (err.needsVerification) {
        push('Please verify the code sent to your email.');
        navigate('/verify-otp', { state: { email: err.email || form.email } });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">Welcome back</p>
        <h1 className="mt-2 font-display text-4xl text-ink-900">Sign in to Yarn-Tales</h1>
        <p className="mt-3 text-ink-700/80">Members can browse the catalogue. Administrators manage products and patterns.</p>
      </div>
      <form autoComplete="off" onSubmit={handleSubmit} className="card p-6 md:p-8" noValidate>
        <input type="text" name="prevent_autofill" autoComplete="username" tabIndex={-1} aria-hidden="true" className="hidden" />
        <input type="password" name="prevent_autofill_password" autoComplete="current-password" tabIndex={-1} aria-hidden="true" className="hidden" />
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input mb-4"
          value={form.email}
          onChange={update}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          data-lpignore="true"
          data-1p-ignore="true"
          required
        />
        <label className="label" htmlFor="password">
          Password
        </label>
        <div className="relative mb-6">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="input pr-24"
            value={form.password}
            onChange={update}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-clay-600"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </button>
        <p className="mt-4 text-center text-sm">
          New here? <Link to="/register" className="font-semibold text-clay-600">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
