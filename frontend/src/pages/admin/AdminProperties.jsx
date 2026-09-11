import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { formatPropertyPrice, PROPERTY_TYPE_LABEL } from '../../utils/format';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/admin/properties', { params: keyword ? { keyword } : {} })
      .then((res) => setProperties(res.data.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Properties</h1>
        <Link to="/admin/properties/new" className="btn-primary">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2">
          <Search size={16} className="text-stone-400" />
          <input
            className="w-full text-sm outline-none"
            placeholder="Search by title or property ID"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
        </div>
        <button onClick={load} className="btn-secondary">Search</button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Property ID</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Public Price</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-stone-500" colSpan={6}>Loading…</td></tr>
            ) : properties.length === 0 ? (
              <tr><td className="px-4 py-6 text-stone-500" colSpan={6}>No properties have been added.</td></tr>
            ) : (
              properties.map((p) => (
                <tr key={p.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/properties/${p.id}`} className="font-medium text-brand-700">
                      {p.propertyCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3">{PROPERTY_TYPE_LABEL[p.propertyType]}</td>
                  <td className="px-4 py-3">{formatPropertyPrice(p)}</td>
                  <td className="px-4 py-3">{p.owner?.fullName}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
