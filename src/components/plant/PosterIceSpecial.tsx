import React from 'react';
import { ShoppingBag, CheckCircle2, Phone, MapPin, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';
import { CrystalIceLogo } from '../CrystalIceLogo.tsx';
import photo3IceCubesPromoImg from '../../assets/images/ice_cubes_promo_1790856824108.jpg';

interface PosterIceSpecialProps {
  settings: WebsiteSettings;
  onOpenOrderModal: () => void;
}

export const PosterIceSpecial: React.FC<PosterIceSpecialProps> = ({
  settings,
  onOpenOrderModal
}) => {
  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const orderWhatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello Crystal Ice Zimbabwe, I want to order the 2.5kg Packaged Ice Bags special offer at $0.75 (MOQ 100 bags with delivery).'
  )}`;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-white via-cyan-50/40 to-blue-50 shadow-xl max-w-md mx-auto flex flex-col justify-between">
      {/* Top Banner with 3D Logo and Slogan */}
      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        <div className="relative z-10 flex items-center gap-3">
          <CrystalIceLogo size="md" lightMode={true} showSubtitle={true} />
        </div>

        <div className="relative z-10 text-right">
          <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-white border border-white/30">
            Certified Plant
          </span>
        </div>
      </div>

      {/* Main Angular Slogan Header */}
      <div className="px-6 pt-5 pb-3 text-center relative">
        <div className="inline-block bg-blue-900 text-white text-xs sm:text-sm font-black uppercase tracking-wider px-4 py-1.5 rounded-lg shadow-sm transform -rotate-1">
          We Sell Ice Cubes & Ice Blocks
        </div>
        <p className="text-xs text-slate-500 font-semibold mt-2">
          7-Stage Clinical Purified • Slow-Melt Solid Density
        </p>
      </div>

      {/* Authentic Branded Ice Presentation from Photo 3 */}
      <div className="px-6 py-3 relative">
        <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-slate-900">
          <img
            src={photo3IceCubesPromoImg}
            alt="Crystal Ice 2.5kg packaged ice cubes special offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SPECIAL OFFER</span>
          </div>
        </div>
      </div>

      {/* Special Offer Price Box - Replicating Original Flyer */}
      <div className="px-6 py-2">
        <div className="bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-200">
            2.5KG ICE CUBES
          </div>
          <div className="text-4xl sm:text-5xl font-black font-['Outfit'] tracking-tight mt-0.5 text-white">
            $0.75
          </div>
          <div className="text-xs font-bold text-cyan-100 bg-white/15 px-3 py-1 rounded-full inline-block mt-2 border border-white/20">
            MOQ 100 with Free Harare Delivery
          </div>
        </div>
      </div>

      {/* Official Contact & Plant Address Footer */}
      <div className="px-6 py-4 bg-slate-900 text-white text-xs space-y-2 mt-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold">
            <Phone className="w-3.5 h-3.5" />
            <span>+263 774 213 817</span>
          </div>
          <div className="text-[11px] text-slate-400">
            sales@crystalice.co.zw
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>2194 Mainway Meadows, Waterfalls, Harare</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onOpenOrderModal}
            className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Special</span>
          </button>

          <a
            href={orderWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>WhatsApp ($0.75)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
