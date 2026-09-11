import { Navigate, Outlet, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import siteConfig from '../config/site';

export default function OwnerLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="p-8 text-sm text-stone-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'OWNER') return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-stone-500 sm:inline">{user.name}</span>
            <button onClick={logout} className="flex items-center gap-1 text-stone-600 hover:text-brand-700">
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </div>
      </header>
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
}
