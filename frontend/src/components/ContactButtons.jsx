import { Phone, MessageCircle } from 'lucide-react';
import siteConfig from '../config/site';

export function CallButton({ label = `Call ${siteConfig.businessName}`, className = 'btn-secondary' }) {
  return (
    <a href={`tel:+91${siteConfig.contact.phone}`} className={className}>
      <Phone size={16} /> {label}
    </a>
  );
}

export function WhatsAppButton({ propertyCode, className = 'btn-primary' }) {
  const message = propertyCode
    ? `Hello, I am interested in property ${propertyCode} listed on ${siteConfig.businessName}.`
    : `Hello, I would like to know more about properties listed on ${siteConfig.businessName}.`;
  const url = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      <MessageCircle size={16} /> WhatsApp {siteConfig.businessName}
    </a>
  );
}
