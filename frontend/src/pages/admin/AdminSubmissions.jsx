import { useEffect, useState } from 'react';
import api from '../../services/api';
import { PROPERTY_TYPE_LABEL } from '../../utils/format';

const STATUSES = ['PENDING_REVIEW', 'CONTACTED', 'CONVERTED', 'REJECTED', 'ARCHIVED'];

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);

  function load() {
    api.get('/property-submissions').then((res) => setSubmissions(res.data.data));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    await api.patch(`/property-submissions/${id}`, { status });
    setSubmissions((list) => list.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Property Submissions</h1>
      <p className="mt-1 text-sm text-stone-500">
        Leads from "List Your Property". Review and create an official listing manually — nothing publishes automatically.
      </p>

      <div className="mt-4 space-y-3">
        {submissions.length === 0 && <p className="text-sm text-stone-500">No submissions yet.</p>}
        {submissions.map((s) => (
          <div key={s.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-stone-800">{s.name} — {s.phone}</p>
                <p className="text-sm text-stone-500">
                  {PROPERTY_TYPE_LABEL[s.propertyType]} in {s.location}
                  {s.approxArea ? ` · ${s.approxArea}` : ''}
                  {s.expectedPrice ? ` · ${s.expectedPrice}` : ''}
                </p>
                {s.description && <p className="mt-1 text-sm text-stone-600">{s.description}</p>}
              </div>
              <select
                className="input-field w-auto"
                value={s.status}
                onChange={(e) => updateStatus(s.id, e.target.value)}
              >
                {STATUSES.map((st) => <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
