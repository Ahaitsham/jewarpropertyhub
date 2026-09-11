import { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUSES = ['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT_PLANNED', 'NEGOTIATION', 'CLOSED', 'NOT_INTERESTED'];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [notesDraft, setNotesDraft] = useState({});

  function load() {
    api.get('/enquiries').then((res) => setEnquiries(res.data.data));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    await api.patch(`/enquiries/${id}`, { status });
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  async function saveNotes(id) {
    const privateNotes = notesDraft[id];
    await api.patch(`/enquiries/${id}`, { privateNotes });
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, privateNotes } : e)));
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900">Enquiries</h1>

      <div className="mt-4 space-y-3">
        {enquiries.length === 0 && <p className="text-sm text-stone-500">No enquiries yet.</p>}
        {enquiries.map((e) => (
          <div key={e.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-stone-800">{e.name} — {e.phone}</p>
                <p className="text-sm text-stone-500">{e.property?.propertyCode}: {e.property?.title}</p>
                {e.message && <p className="mt-1 text-sm text-stone-600">"{e.message}"</p>}
              </div>
              <select
                className="input-field w-auto"
                value={e.status}
                onChange={(ev) => updateStatus(e.id, ev.target.value)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                className="input-field"
                placeholder="Private note about this enquiry…"
                value={notesDraft[e.id] ?? e.privateNotes ?? ''}
                onChange={(ev) => setNotesDraft((d) => ({ ...d, [e.id]: ev.target.value }))}
              />
              <button onClick={() => saveNotes(e.id)} className="btn-secondary">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
