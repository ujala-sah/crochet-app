import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function VerifyOtpPage() {
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const email = useMemo(
    () => location.state?.email || params.get('email') || '',
    [location.state, params]
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email) {
      setError('Start from the registration page so we know which email to verify.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api('/auth/verify-otp', { method: 'POST', body: { email, code } });
      push(data.message || 'Registration complete. Please log in.');
      navigate('/login', { replace: true, state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError('');
    try {
      const data = await api('/auth/resend-otp', { method: 'POST', body: { email } });
      push(data.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl text-ink-900">Check your email</h1>
      <p className="mt-2 text-ink-700/80">
        We sent a 6-digit code to <span className="font-semibold">{email || 'your inbox'}</span>. Enter it to finish signing up.
      </p>
      <form onSubmit={handleSubmit} className="card mt-8 p-6">
        {error && <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
        <label className="label" htmlFor="code">
          Verification code
        </label>
        <input
          id="code"
          className="input tracking-[0.4em]"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
          required
        />
        <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify email'}
        </button>
        <button type="button" className="btn-secondary mt-3 w-full" onClick={resend} disabled={!email}>
          Resend code
        </button>
        <p className="mt-4 text-center text-sm">
          Wrong email? <Link to="/register" className="font-semibold text-clay-600">Register again</Link>
        </p>
      </form>
    </div>
  );
}
