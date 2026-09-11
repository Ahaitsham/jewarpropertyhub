import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-3xl font-semibold text-stone-900">404</p>
      <p className="mt-2 text-stone-600">Page not found.</p>
      <Link to="/" className="mt-4 inline-block text-brand-700">Back to home</Link>
    </div>
  );
}
