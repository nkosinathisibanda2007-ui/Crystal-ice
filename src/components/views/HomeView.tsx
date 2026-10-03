import React, { useState } from 'react';
import {
  Snowflake,
  Shield,
  ShieldCheck,
  ThermometerSnowflake,
  Gem,
  Clock,
  Handshake,
  MapPin,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Phone,
  CheckCircle2,
  Sparkles,
  Calculator,
  Factory
} from 'lucide-react';
import { Product, Service, Testimonial, FAQ, WebsiteSettings, Statistic, DeliveryArea } from '../../types/index.ts';
import { BlastFreezingCalculator } from '../BlastFreezingCalculator.tsx';
import { AuthenticShowcase } from '../plant/AuthenticShowcase.tsx';

// Exact User Uploaded Photos
// Photo 3: Ice Cubes 2.5kg & 5kg ("On the Rocks with us" promo flyer)
import productIceCubesImg from '../../assets/images/ice_cubes_promo_1790856824108.jpg';
// Photo 4: Solid Ice Blocks 10kg (freezing room with vertical hanging ice columns)
import productIceBlocksImg from '../../assets/images/ice_blocks_freezing_1790856836725.jpg';
// Photo 2: Meat Blast Freezing (cold storage room with cooling fans and ice stacks on pallets)
import productMeatBlastImg from '../../assets/images/cold_room_storage_1790856812685.jpg';
import serviceHarareSkylineImg from '../../assets/images/service_harare_skyline_1790773229249.jpg';

interface HomeViewProps {
  settings: WebsiteSettings;
  statistics: Statistic[];
  products: Product[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  deliveryAreas: DeliveryArea[];
  onOpenOrderModal: (product?: Product) => void;
  onOpenQuoteModal: (serviceTitle?: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  statistics,
  products,
  services,
  testimonials,
  faqs,
  deliveryAreas,
  onOpenOrderModal,
  onOpenQuoteModal,
  onSelectProduct,
  onNavigateTab
}) => {
  const [showPlantTools, setShowPlantTools] = useState(false);

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    settings.whatsapp_prefilled_message || 'Hello Crystal Ice Zimbabwe, I would like to order ice.'
  )}`;

  // Find 2.5kg ice cubes and 10kg blocks from products dataset for modal preselection
  const iceCubesProduct = products.find((p) => p.name.includes('2.5kg')) || products[0];
  const iceBlocksProduct = products.find((p) => p.name.includes('10kg') || p.category.includes('Solid')) || products[2];

  return (
    <div className="w-full bg-white text-slate-900 font-sans selection:bg-[#0265B5] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH CLEAR VISIBLE BACKDROP (EDITORIAL STYLE) */}
      {/* ============================================================ */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between pt-28 sm:pt-32 pb-8 overflow-hidden">
        {/* Full-Bleed Atmospheric Background Photo (Fully Visible with Subtle Left Editorial Shade) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
          <img
            src={settings.hero_bg_image || "/crystal_ice_backdrop.jpg"}
            alt="Crystal Ice Zimbabwe Packaged Ice & Plant Facility"
            className="w-full h-full object-cover object-center scale-100"
          />
          {/* Subtle Editorial Shade: Left side has gentle contrast for typography; right side stays bright and crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041220]/80 via-[#061B2E]/35 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041220]/60 via-transparent to-black/20 pointer-events-none" />
          {/* Soft Bottom Transition */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white via-white/30 to-transparent pointer-events-none" />
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6 text-left py-12">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Quality Ice Solutions • Harare, Zimbabwe</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-['Outfit'] leading-[1.06] tracking-tight drop-shadow-md">
              Pure Ice.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-100 to-white">
                Built for Zimbabwe.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-xl text-slate-100 leading-relaxed max-w-xl font-normal drop-shadow-sm">
              Crystal Ice Zimbabwe supplies high-purity crystal-clear ice cubes, slow-diluting solid ice blocks, and commercial meat blast freezing services across Harare.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-order-ice-btn"
                onClick={() => onOpenOrderModal(iceCubesProduct)}
                className="px-8 py-3.5 bg-[#0265B5] hover:bg-[#005599] text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 text-sm sm:text-base border border-cyan-400/40"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order Ice</span>
              </button>

              <button
                id="hero-get-in-touch-btn"
                onClick={() => onNavigateTab('contact')}
                className="px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all text-sm sm:text-base backdrop-blur-md border border-white/30 shadow-sm active:scale-95"
              >
                <span>Get in Touch</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Bottom Ribbon (Mimics Dzinopana Ribbon) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
          <div className="pt-3 pb-2 border-t border-white/25 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-white/90 drop-shadow-sm">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <span className="flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-cyan-300" />
                Hygienic Food-Grade Ice
              </span>
              <span className="hidden sm:inline-block text-white/40">•</span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-300" />
                Fleet Cold Chain Delivery
              </span>
              <span className="hidden md:inline-block text-white/40">•</span>
              <span className="hidden md:flex items-center gap-2">
                <ThermometerSnowflake className="w-4 h-4 text-cyan-300" />
                -30°C Industrial Blast Freezing
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-200">
              <MapPin className="w-3.5 h-3.5 text-cyan-300" />
              <span>FF11 Waterfalls Avenue, Harare</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. OUR PRODUCTS SECTION (3 CORE OFFERINGS - BORDERLESS CARDS) */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#0265B5] block">
              Our Core Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B2545] font-['Outfit'] mt-2">
              Fresh Ice & Meat Blast Freezing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Premium quality ice cubes and solid ice blocks, alongside commercial sub-zero meat blast freezing services at our Waterfalls facility.
            </p>
          </div>

          {/* 3 Focused Cards Grid (No harsh generic borders) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Ice Cubes */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-50 relative">
                  <img
                    src={iceCubesProduct?.image || productIceCubesImg}
                    alt="Crystal clear food-grade Ice Cubes"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#0265B5] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    $1.00 / bag ($0.75 for 100+ packs)
                  </div>
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="text-xl font-bold text-[#0B2545] font-['Outfit']">
                    Ice Cubes (2.5kg & 5kg)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Crystal clear, hygienic and slow-melting ice cubes. $1.00 per bag for small orders, or $0.75 per bag for orders of 100+ packs with refrigerated delivery across Harare.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <button
                  id="product-card-cubes-btn"
                  onClick={() => onOpenOrderModal(iceCubesProduct)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0265B5] hover:text-[#004e8c] transition-colors group-hover:translate-x-1"
                >
                  <span>Order Ice Cubes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Ice Blocks */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-50 relative">
                  <img
                    src={iceBlocksProduct?.image || productIceBlocksImg}
                    alt="High-density solid Ice Blocks"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#0265B5] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    $2.00 / 10kg
                  </div>
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="text-xl font-bold text-[#0B2545] font-['Outfit']">
                    Solid Ice Blocks (10kg)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    High-density 10kg solid blocks lasting 24–48 hours. Specially crafted for butcheries, transport, cooler boxes, and outdoor events.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <button
                  id="product-card-blocks-btn"
                  onClick={() => onOpenOrderModal(iceBlocksProduct)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0265B5] hover:text-[#004e8c] transition-colors group-hover:translate-x-1"
                >
                  <span>Order Ice Blocks</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 3: Commercial Meat Blast Freezing */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-50 relative">
                  <img
                    src={products.find(p => p.category.includes('Blast') || p.name.includes('Blast'))?.image || productMeatBlastImg}
                    alt="Commercial Meat Blast Freezing Chamber"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#0265B5] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    15T Facility
                  </div>
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="text-xl font-bold text-[#0B2545] font-['Outfit']">
                    Meat Blast Freezing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Rapid sub-zero industrial blast freezing for poultry ($0.25/bird) and beef/pork ($0.20/kg) at our Waterfalls plant. Preserves bloom, texture, and natural weight.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <button
                  id="product-card-blast-btn"
                  onClick={() => onOpenQuoteModal('Commercial Meat Blast Freezing')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0265B5] hover:text-[#004e8c] transition-colors group-hover:translate-x-1"
                >
                  <span>Book Blast Freezing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. ABOUT SECTION (CLEAN BORDERLESS ELEVATED CARD) */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Main Card: Split Image + Dark Navy Panel */}
            <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-xl bg-white grid grid-cols-1 md:grid-cols-12">
              {/* Left Image half */}
              <div className="md:col-span-5 relative min-h-[260px] md:min-h-full">
                <img
                  src={settings.about_facility_image || settings.storefront_image || productIceCubesImg}
                  alt="Crystal Ice pure ice crystals"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Right Dark Navy Panel */}
              <div className="md:col-span-7 bg-[#0B223D] text-white p-7 sm:p-10 flex flex-col justify-center space-y-4">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
                  About Crystal Ice Zimbabwe
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] leading-tight">
                  Clean. Safe. Reliable.
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Crystal Ice Zimbabwe is dedicated to providing high-quality packaged ice cubes and solid ice blocks, alongside commercial meat blast freezing services for local butcheries, restaurants, and poultry producers.
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Our goal is to deliver dependable cold solutions that keep Zimbabwe's hospitality, retail, and agricultural sectors thriving.
                </p>

                <div className="pt-2">
                  <button
                    id="about-card-learn-more-btn"
                    onClick={() => onNavigateTab('about')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0265B5] hover:bg-[#005599] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Stacked Value Items with Circular Soft Blue Icons */}
            <div className="lg:col-span-4 space-y-6">
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0 shadow-xs">
                  <Snowflake className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                    High-Quality Ice
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Clean, clear and consistent.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                    Reliable Supply
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    On time, every time across Harare.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0 shadow-xs">
                  <ThermometerSnowflake className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                    Meat Blast Freezing
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Sub-zero preservation for poultry and livestock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHY CHOOSE US (CLEAN BORDERLESS TRUST PODS) */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#0265B5] block">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B2545] font-['Outfit'] mt-2">
              Quality You Can Trust
            </h2>
          </div>

          {/* 4 Clean Borderless Trust Pods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Col 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 text-center hover:bg-slate-50 transition-colors">
              <Gem className="w-9 h-9 text-[#0265B5] mx-auto mb-3.5" />
              <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                Premium Quality
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Crystal clear, hygienic ice cubes & solid blocks.
              </p>
            </div>

            {/* Col 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 text-center hover:bg-slate-50 transition-colors">
              <Clock className="w-9 h-9 text-[#0265B5] mx-auto mb-3.5" />
              <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                On-Time Delivery
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Scheduled daily routes across Harare.
              </p>
            </div>

            {/* Col 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 text-center hover:bg-slate-50 transition-colors">
              <Handshake className="w-9 h-9 text-[#0265B5] mx-auto mb-3.5" />
              <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                Experienced Team
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Professional cold-chain and hospitality service.
              </p>
            </div>

            {/* Col 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/70 text-center hover:bg-slate-50 transition-colors">
              <ShieldCheck className="w-9 h-9 text-[#0265B5] mx-auto mb-3.5" />
              <h4 className="font-bold text-base text-[#0B2545] font-['Outfit']">
                Wholesale Value
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Special contract pricing for bars & butcheries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. OUR SERVICE AREA (PANORAMIC HARARE SKYLINE BANNER) */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-xl">
            {/* Background Harare Skyline Image */}
            <img
              src={serviceHarareSkylineImg}
              alt="Harare Zimbabwe Skyline Service Area"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Blue Tint Gradient Overlay for contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B223D]/95 via-[#0B223D]/85 to-[#0B223D]/70" />

            {/* Foreground Content */}
            <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-white">
              {/* Left Side */}
              <div className="space-y-2 max-w-xl">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-cyan-300 block">
                  Our Service Area
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit']">
                  Serving Harare and Beyond
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                  We provide our ice products and services across Harare and surrounding areas in Zimbabwe.
                </p>

                <div className="pt-3">
                  <button
                    id="service-area-get-in-touch-btn"
                    onClick={() => onNavigateTab('contact')}
                    className="px-6 py-2.5 bg-white hover:bg-slate-100 text-[#0B223D] font-bold text-xs sm:text-sm rounded-full shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>Get in Touch</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Location Marker & Text */}
              <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl max-w-md">
                <div className="w-10 h-10 rounded-full bg-white text-[#0265B5] flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white font-['Outfit']">
                    Harare, Zimbabwe
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 leading-relaxed">
                    Fresh ice delivery and commercial meat blast freezing services available across Harare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EXPANDABLE INDUSTRIAL TOOLS & AUTHENTIC PLANT SHOWCASE */}
      {/* Keeps 100% of existing functionality, calculator & circulars */}
      {/* ============================================================ */}
      <section className="py-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0265B5] flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
                  Industrial Meat Blast Freezing Calculator & Plant Photos
                </h4>
                <p className="text-xs text-slate-500">
                  Calculate chicken ($0.25/bird) and beef ($0.20/kg) blast freezing rates or inspect our Waterfalls cold facility.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPlantTools(!showPlantTools)}
              className="px-4 py-2 text-xs font-bold text-[#0265B5] bg-blue-50 hover:bg-blue-100 rounded-full transition-colors shrink-0"
            >
              {showPlantTools ? 'Hide Plant Tools' : 'Open Rate Calculator & Plant Tools'}
            </button>
          </div>

          {showPlantTools && (
            <div className="mt-8 space-y-12 animate-in fade-in duration-300">
              <BlastFreezingCalculator
                settings={settings}
                onOpenQuoteModal={onOpenQuoteModal}
              />
              <AuthenticShowcase
                settings={settings}
                onOpenOrderModal={() => onOpenOrderModal(iceCubesProduct)}
                onOpenQuoteModal={onOpenQuoteModal}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
