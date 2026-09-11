import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import siteConfig from '../config/site';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/properties', label: 'Properties' },
  { to: '/properties?propertyType=PLOT', label: 'Plots' },
  { to: '/properties?propertyType=HOUSE', label: 'Houses' },
  { to: '/properties?propertyType=COMMERCIAL', label: 'Commercial' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const accountHref = !user ? '/login' : user.role === 'OWNER' ? '/account/dashboard' : '/admin/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-lg font-semibold tracking-tight text-stone-900">
          {siteConfig.businessName}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-brand-700 ${
                  isActive ? 'text-brand-700' : 'text-stone-600'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/list-your-property" className="btn-primary">
            List Your Property
          </Link>
          <Link to={accountHref} className="text-sm font-medium text-stone-500 hover:text-brand-700">
            {user ? 'My Account' : 'Login'}
          </Link>
        </nav>

        <button
          className="p-2 text-stone-600 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Right-side sliding drawer for mobile navigation */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-200 p-4">
            <span className="font-semibold text-stone-900">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 text-stone-500">
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/list-your-property"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              List Your Property
            </Link>
            <Link
              to={accountHref}
              className="btn-secondary mt-2"
              onClick={() => setOpen(false)}
            >
              {user ? 'My Account' : 'Login'}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
