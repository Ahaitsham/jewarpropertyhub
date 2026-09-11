import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button
        className="rounded-md border border-stone-300 p-2 disabled:opacity-40"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-stone-400">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`h-9 w-9 rounded-md text-sm font-medium ${
              p === currentPage ? 'bg-brand-600 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        className="rounded-md border border-stone-300 p-2 disabled:opacity-40"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
