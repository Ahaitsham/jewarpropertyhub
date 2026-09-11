const STYLES = {
  DRAFT: 'bg-stone-100 text-stone-600',
  PUBLISHED: 'bg-brand-100 text-brand-700',
  PENDING: 'bg-amber-100 text-amber-700',
  UNDER_DISCUSSION: 'bg-blue-100 text-blue-700',
  SOLD: 'bg-red-100 text-red-700',
  RENTED: 'bg-red-100 text-red-700',
  LEASED: 'bg-red-100 text-red-700',
  HIDDEN: 'bg-stone-200 text-stone-600',
  ARCHIVED: 'bg-stone-200 text-stone-500',
};

const LABEL = {
  UNDER_DISCUSSION: 'Under Discussion',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-stone-100 text-stone-600';
  const label = LABEL[status] || (status ? status.charAt(0) + status.slice(1).toLowerCase() : '');
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
