import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import siteConfig from '../config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif font-semibold text-brand-700">{siteConfig.businessName}</p>
          <p className="mt-2 text-sm text-stone-600">
            Helping buyers discover property in {siteConfig.location.city} and connecting
            serious buyers with property owners through a trusted local intermediary.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-800">Quick Links</p>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-600">
            <li><Link to="/properties" className="hover:text-brand-700">Properties</Link></li>
            <li><Link to="/about" className="hover:text-brand-700">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-700">Contact</Link></li>
            <li><Link to="/list-your-property" className="hover:text-brand-700">List Your Property</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-800">Legal</p>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-600">
            <li><Link to="/terms" className="hover:text-brand-700">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-brand-700">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-800">Contact</p>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <Phone size={15} /> {siteConfig.contact.phoneDisplay}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> {siteConfig.contact.email}
            </li>
            <li>{siteConfig.location.city}, {siteConfig.location.district}, {siteConfig.location.state}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200 py-4">
        <p className="container-page text-center text-xs text-stone-500">
          © {year} {siteConfig.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
