import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, LandPlot, Store, Warehouse, TreePine, Building } from 'lucide-react';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import siteConfig from '../config/site';

const CATEGORIES = [
  { type: 'PLOT', label: 'Residential Plots', icon: LandPlot },
  { type: 'HOUSE', label: 'Houses', icon: Building2 },
  { type: 'FLAT', label: 'Flats', icon: Building },
  { type: 'COMMERCIAL', label: 'Commercial Property', icon: Store },
  { type: 'AGRICULTURAL_LAND', label: 'Agricultural Land', icon: TreePine },
  { type: 'SHOP', label: 'Shops', icon: Warehouse },
];

const HERO_SLIDES = [
  {
    image: '/images/jewar-1.jpg',
    title: 'Find Your Property in Jewar',
    description: 'Discover plots, houses, flats, shops and land in Jewar.',
  },
  {
    image: '/images/jewar-3.webp',
    title: 'Invest in Jewar',
    description: 'Explore property opportunities in one of the region’s fastest-growing areas.',
  },
 
];


export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/properties/featured'), api.get('/properties/recent')])
      .then(([f, r]) => {
        setFeatured(f.data.data);
        setRecent(r.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="border-b border-stone-200 bg-sand-50 py-14">
        <div className="container-page">
          <h1 className="max-w-2xl text-3xl font-bold text-stone-900 sm:text-4xl">
            {siteConfig.tagline}
          </h1>
      <HeroCarousel/>
          <p className="mt-3 max-w-xl text-stone-600">{siteConfig.description}</p>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </section>

    {/* <HeroCarousel/> */}
      

      <section className="container-page py-12">
        <h2 className="text-xl font-semibold text-stone-800">Browse by Category</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ type, label, icon: Icon }) => (
            <Link
              key={type}
              to={`/properties?propertyType=${type}`}
              className="card flex flex-col items-center gap-2 p-4 text-center transition hover:border-brand-400 hover:shadow-sm"
            >
              <Icon className="text-brand-600" size={26} />
              <span className="text-sm font-medium text-stone-700">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-page py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-800">Featured Properties</h2>
            <Link to="/properties?featured=true" className="text-sm font-medium text-brand-700">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}

      <section className="container-page py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-800">Recently Added</h2>
          <Link to="/properties" className="text-sm font-medium text-brand-700">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="mt-5 text-sm text-stone-500">Loading properties…</p>
        ) : recent.length === 0 ? (
          <p className="mt-5 text-sm text-stone-500">No properties have been added yet.</p>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>

      <section className="border-t border-stone-200 bg-brand-700 py-12 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Want to sell or rent your property?</h2>
            <p className="mt-1 text-brand-100">
              Submit your property details and our team will contact you.
            </p>
          </div>
          <Link to="/list-your-property" className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-brand-700">
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  );
}



function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const previousSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  return (
    <section
      className="container-page py-8 sm:py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[500px]">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current
                ? 'scale-100 opacity-100'
                : 'scale-105 opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 text-white sm:px-10 lg:px-14">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-white/80">
                  Jewar Property Hub
                </p>

                <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                  {slide.description}
                </p>

                <Link
                  to="/properties"
                  className="mt-6 inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-stone-100"
                >
                  Explore Properties
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Previous button */}
        <button
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-5 sm:h-10 sm:w-10"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-5 sm:h-10 sm:w-10"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.image}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
