import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PROPERTY_TYPE_LABEL, PURPOSE_LABEL } from '../utils/format';

export default function SearchBar() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [purpose, setPurpose] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (propertyType) params.set('propertyType', propertyType);
    if (purpose) params.set('purpose', purpose);
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="card flex flex-col gap-3 p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-md border border-stone-300 px-3 py-2.5">
        <Search size={16} className="text-stone-400" />
        <input
          className="w-full text-sm outline-none placeholder:text-stone-400"
          placeholder="Search by location, property type or landmark"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <select
        className="input-field sm:w-44"
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="">Property Type</option>
        {Object.entries(PROPERTY_TYPE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        className="input-field sm:w-36"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      >
        <option value="">Purpose</option>
        {Object.entries(PURPOSE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <button type="submit" className="btn-primary sm:w-auto">
        Search Properties
      </button>
    </form>
  );
}
