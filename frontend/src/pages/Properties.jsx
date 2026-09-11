import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = Object.fromEntries(searchParams.entries());
  const [draftFilters, setDraftFilters] = useState(filters);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    api
      .get('/properties', { params: filters })
      .then((res) => {
        setProperties(res.data.data);
        setMeta({
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalItems: res.data.totalItems,
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function applyFilters() {
    const cleaned = Object.fromEntries(
      Object.entries(draftFilters).filter(([, v]) => v !== '' && v !== undefined)
    );
    setSearchParams(cleaned);
    setMobileFiltersOpen(false);
  }

  function goToPage(page) {
    setSearchParams({ ...filters, page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Properties</h1>
        <button
          className="btn-secondary lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        {loading ? 'Loading…' : `${meta.totalItems} properties found`}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px,1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={draftFilters} onChange={setDraftFilters} onApply={applyFilters} />
        </aside>

        <div>
          {loading ? (
            <p className="text-sm text-stone-500">Loading properties…</p>
          ) : properties.length === 0 ? (
            <div className="card p-8 text-center text-stone-500">
              <p className="font-medium">No properties found.</p>
              <p className="mt-1 text-sm">Try changing your filters.</p>
            </div>
          ) : (
            <div className="grid gap-5   max-sm:grid-cols-2  xl:grid-cols-3">
              {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}

          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            onChange={goToPage}
          />
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="w-80 overflow-y-auto bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <FilterPanel filters={draftFilters} onChange={setDraftFilters} onApply={applyFilters} />
          </div>
        </div>
      )}
    </div>
  );
}
