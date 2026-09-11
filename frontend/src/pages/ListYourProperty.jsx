import { useState } from 'react';
import api from '../services/api';
import siteConfig from '../config/site';
import { PROPERTY_TYPE_LABEL } from '../utils/format';

const initial = {
  name: '',
  phone: '',
  whatsapp: '',
  propertyType: 'PLOT',
  location: '',
  approxArea: '',
  expectedPrice: '',
  description: '',
};

export default function ListYourProperty() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('idle');

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await api.post('/property-submissions', form);
      setStatus('success');
      setForm(initial);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-2xl font-semibold text-stone-900">
        Want to sell or rent your property?
      </h1>
      <p className="mt-2 text-stone-600">
        Submit your property details and our team will contact you. Every submission is reviewed
        by {siteConfig.businessName} before it is published — nothing goes live automatically.
      </p>

      {status === 'success' ? (
        <div className="card mt-6 p-5 text-brand-700">
          Thank you — your property details have been received. Our team will contact you shortly
          to review and, if suitable, publish the listing.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Your Name</label>
              <input required className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className="label-text">Phone Number</label>
              <input required className="input-field" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="label-text">WhatsApp Number (optional)</label>
              <input className="input-field" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
            </div>
            <div>
              <label className="label-text">Property Type</label>
              <select className="input-field" value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                {Object.entries(PROPERTY_TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Location</label>
              <input required className="input-field" placeholder="e.g. Jewar, near main market" value={form.location} onChange={(e) => set('location', e.target.value)} />
            </div>
            <div>
              <label className="label-text">Approximate Area</label>
              <input className="input-field" placeholder="e.g. 150 गज" value={form.approxArea} onChange={(e) => set('approxArea', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Expected Price</label>
              <input className="input-field" placeholder="e.g. ₹50,00,000" value={form.expectedPrice} onChange={(e) => set('expectedPrice', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label-text">Description</label>
              <textarea className="input-field min-h-[100px]" value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
          )}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
            {status === 'submitting' ? 'Submitting…' : 'Submit Property'}
          </button>

          <p className="text-xs text-stone-500">
            By submitting, you agree to our <a href="/terms" className="underline">Terms &amp; Conditions</a>,
            including that any deal closed through {siteConfig.businessName} carries a{' '}
            {siteConfig.commissionPercent}% commission payable to {siteConfig.founder.name}.
          </p>
        </form>
      )}
    </div>
  );
}
