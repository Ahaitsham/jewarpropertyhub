import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import siteConfig from '../config/site';
import { CallButton, WhatsAppButton } from '../components/ContactButtons';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No dedicated contact-form endpoint in V1 — route serious enquiries
    // through the property enquiry or List Your Property forms, which are
    // stored in the database. This form simply confirms next steps for now.
    setSent(true);
  }

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Contact Us</h1>
        <p className="mt-2 text-stone-600">
          Have a question about a property, or want to discuss buying, selling or renting in{' '}
          {siteConfig.location.city}? Reach out directly.
        </p>

        <div className="mt-6 space-y-3 text-sm text-stone-700">
          <p className="flex items-center gap-2"><Phone size={16} /> {siteConfig.contact.phoneDisplay}</p>
          <p className="flex items-center gap-2"><Mail size={16} /> {siteConfig.contact.email}</p>
          <p className="flex items-center gap-2">
            <MapPin size={16} /> {siteConfig.location.city}, {siteConfig.location.district}, {siteConfig.location.state}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <CallButton />
          <WhatsAppButton />
        </div>
      </div>

      <div className="card p-5">
        {sent ? (
          <p className="text-sm text-brand-700">
            Thanks for reaching out — call or WhatsApp us directly for the fastest response.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder="Your name" className="input-field" />
            <input required placeholder="Phone number" className="input-field" />
            <textarea required placeholder="How can we help?" className="input-field min-h-[100px]" />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
