import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { formatPropertyPrice, formatArea, PROPERTY_TYPE_LABEL } from '../utils/format';
import StatusBadge from './StatusBadge';

export default function PropertyCard({ property }) {
  const cover = property.media?.find((m) => m.isCover) || property.media?.[0];

  return (
    <Link
      to={`/properties/${property.slug}`}
      className="card group block overflow-hidden transition hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {cover ? (
          <img
            src={cover.url}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
            No image available
          </div>
        )}
        {property.featured && (
          <span className="absolute left-2 top-2 rounded bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
            Featured
          </span>
        )}
        {['SOLD', 'RENTED', 'LEASED'].includes(property.status) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <StatusBadge status={property.status} />
          </div>
        )}
      </div>

      <div className="space-y-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {PROPERTY_TYPE_LABEL[property.propertyType] || property.propertyType}
        </p>
        <h3 className="line-clamp-1 text-base font-semibold text-stone-800">{property.title}</h3>
        <p className="text-lg font-semibold text-stone-900">{formatPropertyPrice(property)}</p>
        <p className="flex items-center gap-1 text-sm text-stone-500">
          <MapPin size={14} />
          {[property.locality, property.city].filter(Boolean).join(', ')}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs text-stone-500">
          <span>{formatArea(property.areaValue, property.areaUnit)}</span>
          {property.specifications?.facing && <span>{property.specifications.facing} Facing</span>}
          {property.specifications?.roadWidthFt && (
            <span>{property.specifications.roadWidthFt} ft Road</span>
          )}
        </div>
      </div>
    </Link>
  );
}
