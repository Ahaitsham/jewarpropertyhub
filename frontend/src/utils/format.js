// Formats a number using the Indian numbering system (lakh/crore grouping)
export function formatINR(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

// Friendlier "₹45 Lakh" / "₹2.5 Crore" style for card/hero display
export function formatINRShort(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;

  if (num >= 1_00_00_000) {
    return `₹${(num / 1_00_00_000).toFixed(num % 1_00_00_000 === 0 ? 0 : 2)} Crore`;
  }
  if (num >= 1_00_000) {
    return `₹${(num / 1_00_000).toFixed(num % 1_00_000 === 0 ? 0 : 2)} Lakh`;
  }
  return formatINR(num);
}

export function formatPropertyPrice(property) {
  if (property.priceOnRequest || !property.publicPrice) return 'Price on Request';
  const base = formatINRShort(property.publicPrice);
  if (property.purpose === 'RENT') return `${base}/month`;
  if (property.purpose === 'LEASE') return `${base}/year`;
  return base;
}

const AREA_UNIT_LABEL = {
  GAJ: 'गज',
  SQFT: 'sq ft',
  SQM: 'sq m',
  ACRE: 'acre',
  HECTARE: 'hectare',
  BIGHA: 'bigha',
};

export function formatArea(value, unit) {
  if (value === null || value === undefined) return '';
  const num = Number(value);
  const label = AREA_UNIT_LABEL[unit] || unit;
  return `${num % 1 === 0 ? num : num.toFixed(2)} ${label}`;
}

export const PROPERTY_TYPE_LABEL = {
  PLOT: 'Plot',
  HOUSE: 'House',
  FLAT: 'Flat',
  SHOP: 'Shop',
  OFFICE: 'Office',
  COMMERCIAL: 'Commercial Property',
  AGRICULTURAL_LAND: 'Agricultural Land',
  FARMHOUSE: 'Farmhouse',
  INDUSTRIAL: 'Industrial Property',
  BUILDING: 'Building',
  OTHER: 'Other',
};

export const PURPOSE_LABEL = {
  SALE: 'For Sale',
  RENT: 'For Rent',
  LEASE: 'For Lease',
};
