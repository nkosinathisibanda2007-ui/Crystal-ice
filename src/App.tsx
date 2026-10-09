import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { OrderModal } from './components/OrderModal.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

// Views
import { HomeView } from './components/views/HomeView.tsx';
import { ProductsView } from './components/views/ProductsView.tsx';
import { ServicesView } from './components/views/ServicesView.tsx';
import { DeliveryView } from './components/views/DeliveryView.tsx';
import { CustomersView } from './components/views/CustomersView.tsx';
import { AboutView } from './components/views/AboutView.tsx';
import { FAQView } from './components/views/FAQView.tsx';
import { ContactView } from './components/views/ContactView.tsx';
import { LiveImageSlotManagerModal } from './components/admin/LiveImageSlotManagerModal.tsx';

import {
  Product,
  Service,
  Testimonial,
  FAQ,
  WebsiteSettings,
  Statistic,
  DeliveryArea
} from './types/index.ts';
import {
  defaultSettings,
  defaultProducts,
  defaultServices,
  defaultTestimonials,
  defaultFaqs,
  defaultDeliveryAreas,
  defaultStatistics
} from './data/defaultContent.ts';
import { api } from './services/api.ts';
import { MessageCircle, Phone, Snowflake, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  // Check if we have cached homepage data to render immediately without waiting
  const hasCachedHome = !!localStorage.getItem('crystal_ice_settings');
  const [isLoading, setIsLoading] = useState<boolean>(!hasCachedHome);

  // Core Datasets with fallback to static content to guarantee products never render empty on Cloudflare Pages
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_settings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return defaultSettings;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultProducts;
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_services');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultServices;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_testimonials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultTestimonials;
  });

  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_faqs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultFaqs;
  });

  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_delivery_areas');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultDeliveryAreas;
  });

  const [statistics, setStatistics] = useState<Statistic[]>(() => {
    try {
      const cached = localStorage.getItem('crystal_ice_statistics');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultStatistics;
  });

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderPreselectedProduct, setOrderPreselectedProduct] = useState<Product | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quotePreselectedService, setQuotePreselectedService] = useState<string | undefined>(undefined);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin')
    );
  });

  // Check if admin is currently authenticated
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('arcticpure_admin_token');
  });

  // Live Image Slot Manager States (Admin Only)
  const [isLiveSlotManagerOpen, setIsLiveSlotManagerOpen] = useState<boolean>(false);
  const [activeSlotIdForManager, setActiveSlotIdForManager] = useState<string | undefined>(undefined);

  // Load all public site data from backend API with automatic fallback to local dataset
  const fetchAllData = async () => {
    try {
      const bootstrap = await api.getBootstrapData(true);

      if (bootstrap.settings) {
        setSettings({ ...bootstrap.settings });
        try { localStorage.setItem('crystal_ice_settings', JSON.stringify(bootstrap.settings)); } catch {}
      }
      if (bootstrap.products && bootstrap.products.length > 0) {
        setProducts([...bootstrap.products]);
        try { localStorage.setItem('crystal_ice_products', JSON.stringify(bootstrap.products)); } catch {}
      } else {
        setProducts(defaultProducts);
      }
      if (bootstrap.services && bootstrap.services.length > 0) {
        setServices([...bootstrap.services]);
        try { localStorage.setItem('crystal_ice_services', JSON.stringify(bootstrap.services)); } catch {}
      } else {
        setServices(defaultServices);
      }
      if (bootstrap.testimonials && bootstrap.testimonials.length > 0) {
        setTestimonials([...bootstrap.testimonials]);
        try { localStorage.setItem('crystal_ice_testimonials', JSON.stringify(bootstrap.testimonials)); } catch {}
      } else {
        setTestimonials(defaultTestimonials);
      }
      if (bootstrap.faqs && bootstrap.faqs.length > 0) {
        setFaqs(bootstrap.faqs);
        try { localStorage.setItem('crystal_ice_faqs', JSON.stringify(bootstrap.faqs)); } catch {}
      } else {
        setFaqs(defaultFaqs);
      }
      if (bootstrap.delivery_areas && bootstrap.delivery_areas.length > 0) {
        setDeliveryAreas(bootstrap.delivery_areas);
        try { localStorage.setItem('crystal_ice_delivery_areas', JSON.stringify(bootstrap.delivery_areas)); } catch {}
      } else {
        setDeliveryAreas(defaultDeliveryAreas);
      }
      if (bootstrap.statistics && bootstrap.statistics.length > 0) {
        setStatistics(bootstrap.statistics);
        try { localStorage.setItem('crystal_ice_statistics', JSON.stringify(bootstrap.statistics)); } catch {}
      } else {
        setStatistics(defaultStatistics);
      }
    } catch (err) {
      console.error('Error fetching Crystal Ice data:', err);
      // Ensure defaults are populated on any uncaught exception
      setProducts(prev => (prev && prev.length > 0 ? prev : defaultProducts));
      setServices(prev => (prev && prev.length > 0 ? prev : defaultServices));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Listen to real-time Server-Sent Events (SSE) from Admin mutations
    const unsubscribeEvents = api.subscribeToEvents((data) => {
      if (data.event === 'content_updated' || data.event === 'settings' || data.event === 'products' || data.event === 'image_slot') {
        fetchAllData();
      }
    });

    // Handle back/forward navigation or URL change to /admin
    const handlePopState = () => {
      if (
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin' ||
        window.location.search.includes('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    const handleCustomAdminOpen = () => {
      setIsAdminOpen(true);
    };

    // Secret shortcut: Ctrl+Shift+A or Alt+Shift+A opens Admin Portal
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };

    // Initial check on load
    if (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin')
    ) {
      setIsAdminOpen(true);
    }

    const handleSlotUpdated = () => {
      fetchAllData();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-crystal-admin', handleCustomAdminOpen);
    window.addEventListener('crystal-image-slot-updated', handleSlotUpdated);

    return () => {
      unsubscribeEvents();
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-crystal-admin', handleCustomAdminOpen);
      window.removeEventListener('crystal-image-slot-updated', handleSlotUpdated);
    };
  }, []);

  // Update admin logged-in indicator
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminLoggedIn(!!localStorage.getItem('arcticpure_admin_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleOpenOrderModal = (product?: Product) => {
    setOrderPreselectedProduct(product || null);
    setIsOrderModalOpen(true);
  };

  const handleOpenQuoteModal = (serviceTitle?: string) => {
    setQuotePreselectedService(serviceTitle);
    setIsQuoteModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setDetailProduct(product);
  };

  const handleOrderFromDetail = (product: Product) => {
    setDetailProduct(null);
    setOrderPreselectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleQuoteFromDetail = (product: Product) => {
    setDetailProduct(null);
    setQuotePreselectedService(`Bulk Pallet Rate for ${product.name}`);
    setIsQuoteModalOpen(true);
  };

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappFloatingUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(settings.whatsapp_prefilled_message)}`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-cyan-500 selection:text-white font-sans antialiased">
      {/* Global Navigation Header */}
      <Navbar
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderItemsCount={0}
        onOpenOrderModal={() => handleOpenOrderModal()}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            settings={settings}
            statistics={statistics}
            products={products}
            services={services}
            testimonials={testimonials}
            faqs={faqs}
            deliveryAreas={deliveryAreas}
            onOpenOrderModal={handleOpenOrderModal}
            onOpenQuoteModal={handleOpenQuoteModal}
            onSelectProduct={handleSelectProduct}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products && products.length > 0 ? products : defaultProducts}
            settings={settings}
            onOpenOrderModal={handleOpenOrderModal}
            onOpenQuoteModal={handleOpenQuoteModal}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            services={services}
            settings={settings}
            onOpenQuoteModal={handleOpenQuoteModal}
            onOpenOrderModal={() => handleOpenOrderModal()}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryView
            deliveryAreas={deliveryAreas}
            settings={settings}
            onOpenOrderModal={() => handleOpenOrderModal()}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            settings={settings}
            onOpenQuoteModal={handleOpenQuoteModal}
            onOpenOrderModal={() => handleOpenOrderModal()}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            settings={settings}
            onOpenOrderModal={() => handleOpenOrderModal()}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
          />
        )}

        {activeTab === 'faq' && (
          <FAQView
            faqs={faqs}
            settings={settings}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
            onOpenOrderModal={() => handleOpenOrderModal()}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView settings={settings} />
        )}
      </main>

      {/* Corporate Certified Footer */}
      <Footer
        settings={settings}
        setActiveTab={setActiveTab}
        onOpenOrderModal={() => handleOpenOrderModal()}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
      />

      {/* Floating Speed Actions (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        <a
          id="floating-whatsapp-action"
          href={whatsappFloatingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-13 sm:h-13 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
          title="Instant WhatsApp Dispatch Chat"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>

        <button
          id="floating-quick-order-btn"
          onClick={() => handleOpenOrderModal()}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-xl shadow-cyan-600/30 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
        >
          <Snowflake className="w-4 h-4 animate-spin" />
          <span>Order Ice Now</span>
        </button>
      </div>

      {/* Guest Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        products={products}
        deliveryAreas={deliveryAreas}
        settings={settings}
        preselectedProduct={orderPreselectedProduct}
      />

      {/* Commercial Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        settings={settings}
        services={services}
        preselectedService={quotePreselectedService}
      />

      {/* Product Detail Specifications Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onOrderProduct={handleOrderFromDetail}
        onQuoteProduct={handleQuoteFromDetail}
      />

      {/* Business Owner Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
              history.replaceState(null, '', '/');
            }
            setIsAdminLoggedIn(!!localStorage.getItem('arcticpure_admin_token'));
          }}
          onRefreshData={fetchAllData}
          settings={settings}
          onOpenLiveImageManager={(slotId) => {
            setActiveSlotIdForManager(slotId);
            setIsLiveSlotManagerOpen(true);
          }}
        />
      )}

      {/* Live Image Slot Manager Modal for in-place website updates */}
      <LiveImageSlotManagerModal
        isOpen={isLiveSlotManagerOpen}
        onClose={() => setIsLiveSlotManagerOpen(false)}
        onRefreshSiteData={fetchAllData}
        initialSelectedSlotId={activeSlotIdForManager}
      />
    </div>
  );
}
