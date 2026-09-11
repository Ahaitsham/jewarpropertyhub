import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/admin/owners').then((res) => setOwners(res.data.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Owners</h1>

      <div className="mt-4 space-y-2">
        {owners.length === 0 && <p className="text-sm text-stone-500">No owners yet.</p>}
        {owners.map((o) => (
          <div key={o.id} className="card p-4">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
            >
              <div>
                <p className="font-medium text-stone-800">{o.fullName}</p>
                <p className="text-sm text-stone-500">{o.phone} · {o._count?.properties ?? 0} properties</p>
              </div>
              <span className="text-xs text-brand-700">{expanded === o.id ? 'Hide' : 'View'}</span>
            </button>

            {expanded === o.id && (
              <div className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm text-stone-600">
                {o.whatsapp && <p>WhatsApp: {o.whatsapp}</p>}
                {o.email && <p>Email: {o.email}</p>}
                {o.privateNotes && <p className="italic text-stone-500">Notes: {o.privateNotes}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
