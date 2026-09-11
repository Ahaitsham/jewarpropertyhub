import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const CARDS = [
  { key: 'total', label: 'Total Properties' },
  { key: 'published', label: 'Published' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'sold', label: 'Sold / Rented / Leased' },
  { key: 'pending', label: 'Pending' },
  { key: 'newEnquiries', label: 'New Enquiries' },
  { key: 'totalOwners', label: 'Total Owners' },
  { key: 'featured', label: 'Featured Properties' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats').then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="text-sm text-stone-500">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Dashboard</h1>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CARDS.map(({ key, label }) => (
          <div key={key} className="card p-4">
            <p className="text-2xl font-semibold text-stone-900">{stats.totals[key]}</p>
            <p className="text-xs text-stone-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <p className="font-semibold text-stone-800">Recent Properties</p>
          <div className="mt-3 space-y-3">
            {stats.recentProperties.length === 0 && (
              <p className="text-sm text-stone-500">No properties have been added.</p>
            )}
            {stats.recentProperties.map((p) => (
              <Link
                key={p.id}
                to={`/admin/properties/${p.id}`}
                className="flex items-center justify-between rounded-md border border-stone-100 p-2 text-sm hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-stone-800">{p.title}</p>
                  <p className="text-xs text-stone-500">{p.propertyCode} · {p.owner?.fullName}</p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <p className="font-semibold text-stone-800">Recent Enquiries</p>
          <div className="mt-3 space-y-3">
            {stats.recentEnquiries.length === 0 && (
              <p className="text-sm text-stone-500">No enquiries yet.</p>
            )}
            {stats.recentEnquiries.map((e) => (
              <div key={e.id} className="rounded-md border border-stone-100 p-2 text-sm">
                <p className="font-medium text-stone-800">{e.name} — {e.phone}</p>
                <p className="text-xs text-stone-500">
                  {e.property?.propertyCode}: {e.property?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
