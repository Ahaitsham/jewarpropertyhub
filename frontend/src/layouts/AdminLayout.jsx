import { useEffect, useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, MessageSquare, Inbox, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import siteConfig from '../config/site';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/owners', label: 'Owners', icon: Users },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox },
];

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="space-y-1 p-3">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100'
            }`
          }
        >
          <Icon size={16} /> {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  if (loading) return <div className="p-8 text-sm text-stone-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return <Navigate to="/account/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-stone-200 bg-white sm:block">
        <div className="border-b border-stone-200 p-4">
          <p className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</p>
          <p className="text-xs text-stone-500">Admin Panel</p>
        </div>
        <SidebarLinks />
        <div className="border-t border-stone-200 p-3">
          <p className="truncate px-3 text-xs text-stone-500">{user.email}</p>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 sm:hidden">
          <p className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</p>
          <button onClick={() => setDrawerOpen(true)} aria-label="Open admin menu" className="p-1 text-stone-600">
            <Menu size={22} />
          </button>
        </header>

        {/* Mobile right-sliding drawer — same pattern as the public site nav */}
        <div className={`fixed inset-0 z-50 sm:hidden ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className={`absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
              drawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between border-b border-stone-200 p-4">
              <div>
                <p className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</p>
                <p className="text-xs text-stone-500">Admin Panel</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="p-1 text-stone-500">
                <X size={22} />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setDrawerOpen(false)} />
            <div className="mt-auto border-t border-stone-200 p-3">
              <p className="truncate px-3 text-xs text-stone-500">{user.email}</p>
              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        </div>

        <main className="overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
