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
import { UniversalUploaderExportModal } from './components/admin/UniversalUploaderExportModal.tsx';

import {
  Product,
  Service,
  Testimonial,
  FAQ,
  WebsiteSettings,
  Statistic,
  DeliveryArea
} from './types/index.ts';
import { api } from './services/api.ts';
import { MessageCircle, Phone, Snowflake, ArrowUp } from 'lucide-react';

// Default initial state
const defaultSettings: WebsiteSettings = {
  company_name: "Crystal Ice Zimbabwe",
  tagline: "Quality Ice Cubes, Solid Ice Blocks & Meat Blast Freezing in Harare",
  phone_primary: "+263 774 213 817",
  phone_secondary: "+263 774 213 817",
  email: "sales@crystalice.co.zw",
  whatsapp_number: "+263774213817",
  whatsapp_prefilled_message: "Hello Crystal Ice Zimbabwe, I would like to order ice / inquire about restaurant supply or meat blast freezing.",
  business_hours: "Mon - Thu: 7:30 AM – 4:45 PM | Fri: 7:00 AM – 4:15 PM (Deliveries active across Harare)",
  physical_address: "FF11 Waterfalls Avenue, 2194 Mainway Meadows, Waterfalls, Harare",
  same_day_cutoff_time: "2:00 PM",
  facebook_url: "https://www.facebook.com/crystalicezim",
  instagram_url: "https://www.instagram.com/crystalicezim?stkn=MTVkODRobXRpc2hqaw==",
  twitter_url: "https://x.com/crystalicezim",
  google_business_url: "https://www.google.com/search?kgmid=%2Fg%2F11q40rdy9f&hl=en-ZW&q=Crystal%20Ice%20Zimbabwe&shem=epsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm1%2F4&kgs=73ff328e81c3f7ff",
  hero_headline: "Harare's Trusted Ice Manufacturer & Blast Freezing Facility",
  hero_subheadline: "Supplying high-purity 2.5kg & 5kg ice cubes, 10kg slow-melt solid ice blocks, and industrial-grade meat blast freezing to local restaurants, bars, butcheries, and events.",
  hero_badge: "Supplying Harare's Top Restaurants & Butcheries",
  hero_cta_primary: "Order Ice ($0.75 / 2.5kg)",
  hero_cta_secondary: "Meat Blast Freezing Rates"
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Datasets
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderPreselectedProduct, setOrderPreselectedProduct] = useState<Product | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quotePreselectedService, setQuotePreselectedService] = useState<string | undefined>(undefined);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  // Check if admin is currently authenticated
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('arcticpure_admin_token');
  });

  // Live Image Slot Manager & Universal Export States (Admin Only)
  const [isLiveSlotManagerOpen, setIsLiveSlotManagerOpen] = useState<boolean>(false);
  const [isUniversalExportOpen, setIsUniversalExportOpen] = useState<boolean>(false);
  const [activeSlotIdForManager, setActiveSlotIdForManager] = useState<string | undefined>(undefined);

  // Load all public site data from backend API
  const fetchAllData = async () => {
    try {
      const [
        settingsRes,
        productsRes,
        servicesRes,
        testimonialsRes,
        faqsRes,
        deliveryAreasRes,
        statisticsRes
      ] = await Promise.all([
        api.getSettings().catch(() => defaultSettings),
        api.getProducts().catch(() => []),
        api.getServices().catch(() => []),
        api.getTestimonials().catch(() => []),
        api.getFAQs().catch(() => []),
        api.getDeliveryAreas().catch(() => []),
        api.getStatistics().catch(() => [])
      ]);

      if (settingsRes) setSettings({ ...settingsRes });
      if (productsRes && productsRes.length > 0) setProducts([...productsRes]);
      if (servicesRes && servicesRes.length > 0) setServices([...servicesRes]);
      if (testimonialsRes && testimonialsRes.length > 0) setTestimonials([...testimonialsRes]);
      if (faqsRes && faqsRes.length > 0) setFaqs(faqsRes);
      if (deliveryAreasRes && deliveryAreasRes.length > 0) setDeliveryAreas(deliveryAreasRes);
      if (statisticsRes && statisticsRes.length > 0) setStatistics(statisticsRes);
    } catch (err) {
      console.error('Error fetching Crystal Ice data:', err);
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
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      unsubscribeEvents();
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
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
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
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
            products={products}
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
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Speed Actions (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        <a
          id="floating-whatsapp-action"
          href={whatsappFloatingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group"
          title="Instant WhatsApp Dispatch Chat"
        >
          <MessageCircle className="w-6 h-6" />
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
            if (window.location.hash === '#admin') {
              history.replaceState(null, '', window.location.pathname);
            }
            setIsAdminLoggedIn(!!localStorage.getItem('arcticpure_admin_token'));
          }}
          onRefreshData={fetchAllData}
          settings={settings}
          onOpenLiveImageManager={(slotId) => {
            setActiveSlotIdForManager(slotId);
            setIsLiveSlotManagerOpen(true);
          }}
          onOpenUniversalExport={() => setIsUniversalExportOpen(true)}
        />
      )}

      {/* Live Image Slot Manager Modal for in-place website updates */}
      <LiveImageSlotManagerModal
        isOpen={isLiveSlotManagerOpen}
        onClose={() => setIsLiveSlotManagerOpen(false)}
        onRefreshSiteData={fetchAllData}
        initialSelectedSlotId={activeSlotIdForManager}
        onOpenUniversalExport={() => {
          setIsLiveSlotManagerOpen(false);
          setIsUniversalExportOpen(true);
        }}
      />

      {/* Universal Uploader Export Modal (Step 2) */}
      <UniversalUploaderExportModal
        isOpen={isUniversalExportOpen}
        onClose={() => setIsUniversalExportOpen(false)}
      />
    </div>
  );
}
