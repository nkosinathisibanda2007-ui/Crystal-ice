import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Clock,
  ShoppingBag,
  Sparkles,
  ThermometerSnowflake,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Eye,
  Maximize2
} from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

interface StorefrontCenterpieceProps {
  settings: WebsiteSettings;
  onOpenOrderModal: () => void;
  onOpenQuoteModal: (serviceTitle?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StorefrontCenterpiece: React.FC<StorefrontCenterpieceProps> = ({
  settings,
  onOpenOrderModal,
  onOpenQuoteModal,
  onNavigateTab
}) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isSignGlowBoosted, setIsSignGlowBoosted] = useState(false);

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('Hello Crystal Ice Zimbabwe, I saw your Waterfalls facility online and would like to place an order.')}`;

  const hotspots = [
    {
      id: 1,
      top: '46%',
      left: '42%',
      label: 'Backlit 3D Logo Signage',
      desc: 'Crystal Ice illuminated headquarters signage at our Waterfalls facility.'
    },
    {
      id: 2,
      top: '68%',
      left: '50%',
      label: 'Customer Collection Counter',
      desc: 'Direct walk-in collection for 2.5kg, 5kg bags & 10kg solid blocks.'
    },
    {
      id: 3,
      top: '55%',
      left: '80%',
      label: 'Cold Logistics Bay',
      desc: '15-Tonne sub-zero blast freezing plant & Harare refrigerated dispatch.'
    }
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Decorative Outer Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-cyan-400/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main Container Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl shadow-cyan-950/40">
        {/* Top Control & Location Bar */}
        <div className="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <span className="font-bold text-slate-200">
              Crystal Ice (Pvt) Ltd • Waterfalls Headquarters
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>FF11 Waterfalls Ave, Harare</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSignGlowBoosted(!isSignGlowBoosted)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
                isSignGlowBoosted
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Backlight Glow"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{isSignGlowBoosted ? 'Sign Glow: High' : 'Sign Glow: Normal'}</span>
            </button>
            <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              Open Today
            </span>
          </div>
        </div>

        {/* Centerpiece Image Frame with Subtle Animations */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100 select-none">
          {/* Subtle Ambient Breathing Animation on Image */}
          <motion.div
            className="w-full h-full"
            animate={{
              scale: [1, 1.025, 1],
              y: [0, -3, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={settings.storefront_image || settings.hero_bg_image || "/crystal_ice_storefront.jpg"}
              alt="Crystal Ice Zimbabwe Storefront & Plant Facility in Waterfalls, Harare"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Targeted Backlight Glow Layer Positioned over the 3D 'CRYSTAL ICE' Sign */}
          <motion.div
            className="absolute pointer-events-none rounded-full blur-2xl"
            style={{
              top: '40%',
              left: '42%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '100px',
              background: isSignGlowBoosted
                ? 'radial-gradient(ellipse at center, rgba(253, 230, 138, 0.7) 0%, rgba(56, 189, 248, 0.4) 55%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(254, 240, 138, 0.45) 0%, rgba(56, 189, 248, 0.25) 50%, transparent 70%)'
            }}
            animate={{
              opacity: [0.65, 1, 0.65],
              scale: [0.95, 1.08, 0.95]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Gentle Shimmer Sweeping Across Entrance Glass */}
          <motion.div
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut"
            }}
          />

          {/* Subtle Corner Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

          {/* Interactive Hotspot Beacons */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ top: spot.top, left: spot.left }}
            >
              <button
                type="button"
                onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                className="group relative flex items-center justify-center p-2 focus:outline-none"
                aria-label={spot.label}
              >
                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-cyan-400 opacity-60" />
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 text-[10px] font-bold shadow-lg shadow-cyan-500/40 group-hover:scale-125 transition-transform">
                  +
                </span>

                {/* Tooltip Popover */}
                {activeHotspot === spot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 sm:w-60 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3 shadow-2xl text-left z-20 text-white pointer-events-auto"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <span className="text-[11px] font-bold text-cyan-300 font-['Outfit']">
                        {spot.label}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                        Crystal Ice
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                      {spot.desc}
                    </p>
                  </motion.div>
                )}
              </button>
            </div>
          ))}

          {/* Bottom Floating Info Pill Overlaid on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-2xl px-4 py-2.5 text-white pointer-events-auto shadow-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                Direct Cold Hub
              </span>
              <h4 className="text-sm font-bold font-['Outfit'] text-slate-100">
                Mainway Meadows, Waterfalls Facility
              </h4>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={onOpenOrderModal}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order 2.5kg Bags ($0.75)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="px-5 py-4 bg-slate-900/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <ThermometerSnowflake className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">2.5kg Bags at $0.75</span>
              <span className="text-[11px] text-slate-400">MOQ 100 with free Harare delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">15T Blast Freezing Plant</span>
              <span className="text-[11px] text-slate-400">Poultry $0.25/bird | Beef $0.20/kg</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Plant Pickup & Delivery</span>
              <span className="text-[11px] text-slate-400">Walk-ins welcome at Waterfalls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
