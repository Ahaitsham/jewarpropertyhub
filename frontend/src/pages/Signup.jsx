import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import siteConfig from '../config/site';

const initial = { name: '', email: '', phone: '', password: '' };

export default function Signup() {
  const { user, loading, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={user.role === 'OWNER' ? '/account/dashboard' : '/admin/dashboard'} replace />;
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signup(form);
      navigate('/account/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <div>
          <p className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</p>
          <h1 className="text-lg font-semibold text-stone-900">Owner Account</h1>
          <p className="mt-1 text-xs text-stone-500">
            Create an account to track the status of properties you've listed with us. If we
            already have a listing under your phone number, it links automatically.
          </p>
        </div>

        <div>
          <label className="label-text">Full Name</label>
          <input required className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Phone Number</label>
          <input required className="input-field" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <p className="mt-1 text-xs text-stone-400">Use the same number you gave us when listing your property.</p>
        </div>
        <div>
          <label className="label-text">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div>
          <label className="label-text">Password</label>
          <input type="password" required minLength={6} className="input-field" value={form.password} onChange={(e) => set('password', e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-stone-500">
          Already have an account? <Link to="/login" className="font-medium text-brand-700">Log in</Link>
        </p>
      </form>
    </div>
  );
}
