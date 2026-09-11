import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import StatusBadge from '../../components/StatusBadge';
import { formatINR } from '../../utils/format';

export default function OwnerDashboard() {
  const [properties, setProperties] = useState(null);

  useEffect(() => {
    api.get('/owner/properties').then((res) => setProperties(res.data.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Your Properties</h1>
      <p className="mt-1 text-sm text-stone-500">
        Track the status and verification of every property you've listed with us.
      </p>

      {properties === null ? (
        <p className="mt-6 text-sm text-stone-500">Loading…</p>
      ) : properties.length === 0 ? (
        <div className="card mt-6 p-6 text-center text-sm text-stone-500">
          <p>No properties are linked to your account yet.</p>
          <p className="mt-1">
            If you've already listed with us, make sure you signed up with the same phone number.
            Otherwise, <Link to="/list-your-property" className="text-brand-700">submit a new listing</Link>.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div key={p.id} className="space-y-2">
              <PropertyCard property={p} />
              <div className="card flex items-center justify-between p-3 text-sm">
                <div>
                  <StatusBadge status={p.status} />
                  {p.ownerAskingPrice && (
                    <p className="mt-1 text-xs text-stone-500">
                      Your asking price: {formatINR(p.ownerAskingPrice)}
                    </p>
                  )}
                </div>
                {typeof p.enquiryCount === 'number' && (
                  <span className="text-xs text-stone-500">{p.enquiryCount} enquiries</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
