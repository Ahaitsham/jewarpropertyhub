import { PROPERTY_TYPE_LABEL, PURPOSE_LABEL } from '../utils/format';

export default function FilterPanel({ filters, onChange, onApply }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card space-y-4 p-4">
      <div>
        <label className="label-text">Property Type</label>
        <select
          className="input-field"
          value={filters.propertyType || ''}
          onChange={(e) => set('propertyType', e.target.value)}
        >
          <option value="">Any</option>
          {Object.entries(PROPERTY_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-text">Purpose</label>
        <select
          className="input-field"
          value={filters.purpose || ''}
          onChange={(e) => set('purpose', e.target.value)}
        >
          <option value="">Any</option>
          {Object.entries(PURPOSE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label-text">Min Price</label>
          <input
            type="number"
            className="input-field"
            value={filters.minPrice || ''}
            onChange={(e) => set('minPrice', e.target.value)}
          />
        </div>
        <div>
          <label className="label-text">Max Price</label>
          <input
            type="number"
            className="input-field"
            value={filters.maxPrice || ''}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label-text">Location</label>
        <input
          className="input-field"
          placeholder="e.g. Jewar, Yamuna Expressway"
          value={filters.location || ''}
          onChange={(e) => set('location', e.target.value)}
        />
      </div>

      <div>
        <label className="label-text">Sort By</label>
        <select
          className="input-field"
          value={filters.sort || 'newest'}
          onChange={(e) => set('sort', e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="area_asc">Area: Low to High</option>
          <option value="area_desc">Area: High to Low</option>
        </select>
      </div>

      <button onClick={onApply} className="btn-primary w-full">
        Apply Filters
      </button>
    </div>
  );
}
