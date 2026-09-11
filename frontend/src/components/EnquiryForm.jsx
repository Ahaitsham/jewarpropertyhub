import { useState } from 'react';
import api from '../services/api';

export default function EnquiryForm({ propertyId }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await api.post('/enquiries', { propertyId, ...form });
      setStatus('success');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-4 text-sm text-brand-700">
        Thank you — your enquiry has been received. Our team will contact you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <p className="text-sm font-semibold text-stone-800">Interested in this property?</p>
      <input
        required
        placeholder="Your name"
        className="input-field"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
      />
      <input
        required
        placeholder="Phone number"
        className="input-field"
        value={form.phone}
        onChange={(e) => set('phone', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email (optional)"
        className="input-field"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
      />
      <textarea
        placeholder="Message — e.g. I would like to visit the property."
        className="input-field min-h-[80px]"
        value={form.message}
        onChange={(e) => set('message', e.target.value)}
      />
      {status === 'error' && (
        <p className="text-sm text-red-600">Your enquiry could not be submitted. Please try again.</p>
      )}
      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
        {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
