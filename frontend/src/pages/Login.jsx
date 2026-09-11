import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import siteConfig from '../config/site';

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={user.role === 'OWNER' ? '/account/dashboard' : '/admin/dashboard'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const loggedInUser = await login(email, password);
      navigate(loggedInUser.role === 'OWNER' ? '/account/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <div>
          <p className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</p>
          <h1 className="text-lg font-semibold text-stone-900">Log In</h1>
          <p className="mt-1 text-xs text-stone-500">
            Property owners and admin staff both log in here.
          </p>
        </div>

        <div>
          <label className="label-text">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label-text">Password</label>
          <input
            type="password"
            required
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-stone-500">
          Own a property listed with us?{' '}
          <Link to="/signup" className="font-medium text-brand-700">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
