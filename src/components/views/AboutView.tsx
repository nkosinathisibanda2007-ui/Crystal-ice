import React from 'react';
import {
  Snowflake,
  ShieldCheck,
  Award,
  Factory,
  CheckCircle2,
  ThermometerSnowflake,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';
import storefrontImg from '../../assets/images/crystal_ice_storefront.jpg';
import productIceCubesImg from '../../assets/images/product_ice_cubes_1790773170577.jpg';
import productColdRoomImg from '../../assets/images/product_cold_room_1790773216083.jpg';
import { PlantColdStorage } from '../plant/PlantColdStorage.tsx';
import { PlantBlockFreezing } from '../plant/PlantBlockFreezing.tsx';

interface AboutViewProps {
  settings: WebsiteSettings;
  onOpenOrderModal: () => void;
  onOpenQuoteModal: (service?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  settings,
  onOpenOrderModal,
  onOpenQuoteModal
}) => {
  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello Crystal Ice Zimbabwe, I would like to learn more about your cold chain services.'
  )}`;

  const googleMapsUrl = settings.google_business_url || "https://www.google.com/search?kgmid=%2Fg%2F11q40rdy9f&hl=en-ZW&q=Crystal%20Ice%20Zimbabwe";

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#0265B5] block">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B2545] font-['Outfit'] mt-2">
            Pure Ice & Cold Chain Infrastructure
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Crystal Ice Zimbabwe was established in 2022 in Harare. We supply high-quality packaged ice cubes and solid ice blocks, and operate a dedicated commercial meat blast freezing facility at our Waterfalls plant.
          </p>
        </div>

        {/* Company Overview Card Split with Actual Physical Facility Photo (No generic borders) */}
        <div className="rounded-3xl shadow-xl overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-5">
            <span className="text-xs font-bold text-[#0265B5] uppercase tracking-wider">
              Waterfalls Facility • Harare
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] font-['Outfit']">
              Clean. Safe. Dependable Cold Solutions.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Operating from our dedicated manufacturing and cold storage plant at FF11 Waterfalls Avenue in Harare, Crystal Ice Zimbabwe provides food-grade packaged ice and industrial meat blast freezing services to meet the everyday and commercial needs of individuals, restaurants, butcheries, event organizers, and agricultural producers.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our multi-stage filtration guarantees crystal-clear, tasteless, and hygienic ice cubes and slow-melt blocks. In addition to ice manufacturing, our facilities include a 15-tonne industrial blast freezer capable of rapid core freezing for chickens ($0.25/bird) and beef ($0.20/kg), locking in natural weight, bloom, and texture.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/70">
                <span className="font-bold text-[#0B2545] text-base block font-['Outfit']">
                  15 Tonnes / 24h
                </span>
                <span className="text-xs text-slate-600">Blast freezing & cold storage capacity</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/70">
                <span className="font-bold text-[#0B2545] text-base block font-['Outfit']">
                  Harare-Wide Fleet
                </span>
                <span className="text-xs text-slate-600">Refrigerated door-to-door drops</span>
              </div>
            </div>
          </div>

          {/* Actual Photograph of the Physical Crystal Ice Storefront & Facility */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-slate-100 group overflow-hidden">
            <img
              src={settings.about_facility_image || settings.storefront_image || settings.hero_bg_image || storefrontImg}
              alt="Crystal Ice Zimbabwe Physical Facility at FF11 Waterfalls Avenue"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B223D]/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
              <span className="font-bold block text-sm">FF11 Waterfalls Avenue Facility</span>
              <span className="text-[11px] text-cyan-300">Harare, Zimbabwe</span>
            </div>
          </div>
        </div>

        {/* 2 Core Services Comparison with Actual Prices (No generic borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center mb-4">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#0B2545]">
                Packaged Ice Cubes & Solid Ice Blocks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Manufactured from clinical 7-stage purified water with high thermodynamic density. Our ice melts up to 40% slower and leaves drinks completely pure and free of odor or sediment.
              </p>

              <ul className="space-y-2 mt-5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0265B5] shrink-0" />
                  <span><strong>2.5kg Ice Bags:</strong> $1.00 per bag (&lt; 100 packs) | $0.75 per bag for 100+ packs with delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0265B5] shrink-0" />
                  <span><strong>5kg Commercial Bags:</strong> High-volume bar & catering bags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0265B5] shrink-0" />
                  <span><strong>10kg Solid Blocks:</strong> $2.00 each, lasts 24 to 48 hours</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenOrderModal}
                className="w-full py-3 bg-[#0265B5] hover:bg-[#005599] text-white rounded-full text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                Order Packaged Ice
              </button>
            </div>
          </div>

          {/* Card 2: Meat Blast Freezing */}
          <div className="p-8 rounded-3xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center mb-4">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Outfit'] text-[#0B2545]">
                Commercial Meat Blast Freezing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Operating a high-capacity industrial sub-zero blast freezer at our Waterfalls plant, we provide rapid blast freezing for commercial poultry, beef, pork, and agricultural produce.
              </p>

              <ul className="space-y-2 mt-5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0265B5] shrink-0" />
                  <span><strong>Chickens & Broilers:</strong> $0.25 per bird (Min 1 tonne, up to 10 tonnes/day)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0265B5] shrink-0" />
                  <span><strong>Beef & Pork Carcasses:</strong> $0.20 per kg (Up to 15 tonnes/day)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0265B5] shrink-0" />
                  <span><strong>Core Freeze Protection:</strong> Preserves bloom, natural weight & prevents drip loss</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onOpenQuoteModal('Commercial Meat Blast Freezing')}
                className="w-full py-3 bg-[#0B223D] hover:bg-[#071626] text-white rounded-full text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                Book Meat Blast Freezing
              </button>
            </div>
          </div>
        </div>

        {/* Plant Cold Storage Visualizers */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#0265B5] uppercase tracking-wider">
              Harare Facilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] font-['Outfit'] mt-1">
              Waterfalls Ave Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PlantColdStorage onOpenOrderModal={onOpenOrderModal} />
            <PlantBlockFreezing onOpenQuoteModal={onOpenQuoteModal} />
          </div>
        </div>

        {/* Coordinates Banner */}
        <div className="rounded-3xl bg-[#0B223D] text-white p-8 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Physical Plant
              </span>
              <h4 className="text-lg font-bold font-['Outfit']">
                Waterfalls, Harare
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {settings.physical_address}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline text-xs inline-flex items-center gap-1 font-semibold"
              >
                <span>Google Profile & Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Plant Hours
              </span>
              <h4 className="text-lg font-bold font-['Outfit']">
                Mon - Fri Intake
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {settings.business_hours}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Direct Contact
              </span>
              <h4 className="text-lg font-bold font-['Outfit']">
                Dispatch Desk
              </h4>
              <p className="text-xs text-slate-300">
                Phone: <a href={`tel:${settings.phone_primary}`} className="text-cyan-300 font-bold hover:underline">{settings.phone_primary}</a>
                <br />
                Email: <a href={`mailto:${settings.email}`} className="text-cyan-300 hover:underline">{settings.email}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
