import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../services/api';
import PropertyGallery from '../components/PropertyGallery';
import PropertyCard from '../components/PropertyCard';
import EnquiryForm from '../components/EnquiryForm';
import StatusBadge from '../components/StatusBadge';
import { CallButton, WhatsAppButton } from '../components/ContactButtons';
import { formatPropertyPrice, formatArea, PROPERTY_TYPE_LABEL, PURPOSE_LABEL } from '../utils/format';

const UNAVAILABLE_STATUSES = ['SOLD', 'RENTED', 'LEASED'];

export default function PropertyDetails() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    api
      .get(`/properties/${slug}`)
      .then((res) => setData(res.data.data))
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-lg font-semibold text-stone-800">Property not found.</p>
        <Link to="/properties" className="mt-3 inline-block text-brand-700">
          Browse all properties
        </Link>
      </div>
    );
  }

  if (!data) {
    return <div className="container-page py-16 text-sm text-stone-500">Loading…</div>;
  }

  const { property, related } = data;
  const unavailable = UNAVAILABLE_STATUSES.includes(property.status);
  const specs = property.specifications || {};

  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
              {PROPERTY_TYPE_LABEL[property.propertyType]} · {PURPOSE_LABEL[property.purpose]}
            </span>
            {unavailable && <StatusBadge status={property.status} />}
            {property.verification === 'VERIFIED' && <StatusBadge status="PUBLISHED" />}
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
            <MapPin size={14} />
            {[property.locality, property.city, property.state].filter(Boolean).join(', ')}
          </p>

          <div className="mt-4">
            <PropertyGallery media={property.media} />
          </div>

          {unavailable && (
            <div className="mt-4 rounded-md bg-stone-100 p-3 text-sm text-stone-600">
              This property is no longer available ({property.status.toLowerCase()}).
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-6 rounded-md border border-stone-200 p-4">
            <div>
              <p className="text-xs text-stone-500">Price</p>
              <p className="text-lg font-semibold text-stone-900">{formatPropertyPrice(property)}</p>
              {property.negotiable && <p className="text-xs text-stone-500">Negotiable</p>}
            </div>
            <div>
              <p className="text-xs text-stone-500">Area</p>
              <p className="text-lg font-semibold text-stone-900">
                {formatArea(property.areaValue, property.areaUnit)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Property ID</p>
              <p className="text-lg font-semibold text-stone-900">{property.propertyCode}</p>
            </div>
          </div>

          {property.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-stone-800">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                {property.description}
              </p>
            </div>
          )}

          {Object.keys(specs).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-stone-800">Specifications</h2>
              <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="rounded-md bg-stone-50 p-3">
                    <dt className="text-xs capitalize text-stone-500">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </dt>
                    <dd className="text-sm font-medium text-stone-800">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(property.address || property.latitude) && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-stone-800">Location</h2>
              <p className="mt-2 text-sm text-stone-600">
                {[property.address, property.landmark, property.locality, property.city, property.district, property.state, property.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          <p className="mt-8 text-xs text-stone-400">
            Please mention Property ID {property.propertyCode} when contacting us.
          </p>
        </div>

        <aside className="space-y-4">
          <div className="card space-y-2 p-4">
            <CallButton className="btn-secondary w-full" />
            <WhatsAppButton propertyCode={property.propertyCode} className="btn-primary w-full" />
          </div>
          <EnquiryForm propertyId={property.id} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-stone-800">Related Properties</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
