import React from 'react';
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { CrystalIceLogo } from './CrystalIceLogo.tsx';
import { SocialLinks } from './SocialLinks.tsx';

interface FooterProps {
  settings: WebsiteSettings;
  setActiveTab: (tab: string) => void;
  onOpenOrderModal: () => void;
  onOpenQuoteModal: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  setActiveTab,
  onOpenOrderModal,
  onOpenQuoteModal,
  onOpenAdmin
}) => {
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About us' },
    { id: 'products', label: 'Products & Services' },
    { id: 'contact', label: 'Contact' }
  ];

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    settings.whatsapp_prefilled_message || 'Hello Crystal Ice Zimbabwe, I would like to order ice.'
  )}`;

  const googleMapsUrl = settings.google_business_url || "https://www.google.com/search?kgmid=%2Fg%2F11q40rdy9f&hl=en-ZW&q=Crystal%20Ice%20Zimbabwe";

  return (
    <footer className="bg-[#0B1E33] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Reference Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8">
          {/* Left: Full Crystal Ice Zimbabwe Logo */}
          <div className="shrink-0">
            <button
              onClick={() => handleNav('home')}
              className="text-left focus:outline-none"
              aria-label="Crystal Ice Zimbabwe Home"
            >
              <CrystalIceLogo size="md" lightMode={true} showSubtitle={true} />
            </button>
          </div>

          {/* Center: Horizontal Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm font-medium text-slate-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`footer-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: Order Ice WhatsApp Pill Button */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              id="footer-order-ice-btn"
              onClick={onOpenOrderModal}
              className="bg-[#0265B5] hover:bg-[#005599] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full inline-flex items-center gap-2 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order Ice</span>
            </button>
          </div>
        </div>

        {/* Official Social Media Connection Strip (No generic border) */}
        <div className="py-5 px-6 rounded-3xl bg-white/[0.04] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Official Social Channels & Google Profile
            </span>
            <span className="text-xs text-slate-300">
              Follow @crystalicezim for live delivery updates, factory circulars, and specials.
            </span>
          </div>

          <SocialLinks variant="light" size="md" />
        </div>

        {/* Supporting Contact Coordinates & Plant Information */}
        <div className="py-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Plant Location</span>
              <span>{settings.physical_address}</span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
              >
                <span>Google Profile & Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Dispatch Phone</span>
              <a href={`tel:${settings.phone_primary}`} className="text-slate-300 hover:text-white transition-colors">
                {settings.phone_primary}
              </a>
              <span className="block text-[11px] text-slate-400 mt-0.5">WhatsApp hotline active</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Email Inquiries</span>
              <a href={`mailto:${settings.email}`} className="text-slate-300 hover:text-white transition-colors">
                {settings.email}
              </a>
              <span className="block text-[11px] text-slate-400 mt-0.5">Prompt response</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Operational Hours</span>
              <span>{settings.business_hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Exact Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Crystal Ice Zimbabwe. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-300 font-medium">
              Pure Ice. Built for Zimbabwe.
            </span>

            {/* Business owner admin link */}
            <button
              id="footer-admin-login-link"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors ml-2"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
