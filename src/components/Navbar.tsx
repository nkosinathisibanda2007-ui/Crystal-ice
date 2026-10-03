import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Menu,
  X,
  Lock,
  Phone
} from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';
import { CrystalIceLogo } from './CrystalIceLogo.tsx';

interface NavbarProps {
  settings: WebsiteSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orderItemsCount: number;
  onOpenOrderModal: () => void;
  onOpenQuoteModal: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  setActiveTab,
  orderItemsCount,
  onOpenOrderModal,
  onOpenQuoteModal,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Strict navigation items and labels
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products & Services' },
    { id: 'about', label: 'About us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(settings.whatsapp_prefilled_message)}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3.5'
            : 'bg-white/90 backdrop-blur-sm shadow-xs py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Official Full Crystal Ice Zimbabwe Logo */}
          <button
            id="nav-logo-button"
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group focus:outline-none"
            aria-label="Crystal Ice Zimbabwe Homepage"
          >
            <CrystalIceLogo size="md" showSubtitle={true} />
          </button>

          {/* Desktop Navigation Links matching Reference UI styling */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#0265B5]'
                      : 'text-slate-700 hover:text-[#0265B5]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0265B5] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Right Action CTA: Order Ice Pill Button with WhatsApp icon */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-order-ice-button"
              onClick={onOpenOrderModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0265B5] hover:bg-[#005599] rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order Ice</span>
              {orderItemsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-extrabold bg-white text-[#0265B5] rounded-full">
                  {orderItemsCount}
                </span>
              )}
            </button>

            {/* Subtle Admin management link */}
            <button
              id="admin-portal-link-header"
              onClick={onOpenAdmin}
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-order-button-icon"
              onClick={onOpenOrderModal}
              className="p-2 rounded-full bg-[#0265B5] text-white"
              aria-label="Order Ice"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>

            <button
              id="mobile-hamburger-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-dropdown-menu"
            className="md:hidden bg-white shadow-2xl px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col space-y-2 pt-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-50/80 text-[#0265B5]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#0265B5]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <button
                id="mobile-menu-order-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="w-full py-3 px-4 bg-[#0265B5] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order Ice</span>
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <a
                  href={`tel:${settings.phone_primary}`}
                  className="flex items-center gap-1.5 text-slate-700 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0265B5]" />
                  <span>{settings.phone_primary}</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-700"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
