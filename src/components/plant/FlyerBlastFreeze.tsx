import React from 'react';
import { ThermometerSnowflake, ShieldCheck, Phone, MapPin, Calculator, FileText, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';
import { CrystalIceLogo } from '../CrystalIceLogo.tsx';
import photo5ChickenBlastImg from '../../assets/images/chicken_blast_freeze_1790856846432.jpg';
import photo6BeefBlastImg from '../../assets/images/beef_blast_freeze_1790856859754.jpg';

interface FlyerBlastFreezeProps {
  settings: WebsiteSettings;
  onOpenQuoteModal: (serviceTitle?: string) => void;
}

export const FlyerBlastFreeze: React.FC<FlyerBlastFreezeProps> = ({
  settings,
  onOpenQuoteModal
}) => {
  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const blastWhatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello Crystal Ice Zimbabwe, I want to book industrial blast freezing at your FF11 Waterfalls Avenue plant for my poultry/meat.'
  )}`;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-blue-900/40 bg-slate-900 shadow-2xl max-w-md mx-auto flex flex-col justify-between text-white">
      {/* Top Graphic Header */}
      <div className="relative h-44 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 p-5 overflow-hidden flex items-center justify-between border-b border-blue-900/50">
        <div className="relative z-10 flex items-center gap-4">
          {/* Poultry badge */}
          <div className="rounded-2xl bg-white text-slate-900 p-3 shadow-md border border-slate-200 text-center min-w-[100px]">
            <span className="text-xs font-black uppercase text-blue-900 block">Poultry</span>
            <span className="text-xl font-black text-cyan-600 block my-0.5">$0.25</span>
            <span className="text-xs text-slate-500 font-semibold block">per bird</span>
          </div>

          {/* Beef & Pork badge */}
          <div className="rounded-2xl bg-white text-slate-900 p-3 shadow-md border border-slate-200 text-center min-w-[100px]">
            <span className="text-xs font-black uppercase text-blue-900 block">Beef / Pork</span>
            <span className="text-xl font-black text-cyan-600 block my-0.5">$0.20</span>
            <span className="text-xs text-slate-500 font-semibold block">per kg</span>
          </div>
        </div>

        {/* Official Crystal Ice Logo Card Top-Right */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-white/20">
          <CrystalIceLogo size="sm" showSubtitle={false} />
        </div>
      </div>

      {/* Blue Banner Slogan */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white relative">
        <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight leading-tight">
          Blast Freeze Your Meat Fresh!
        </h3>
        <p className="text-xs text-cyan-100 mt-1 font-medium">
          Rapid core temperature reduction preserves moisture, weight, and cellular structure.
        </p>
      </div>

      {/* Two Official Rate Cards from Flyer */}
      <div className="p-6 space-y-3 bg-slate-950">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Chickens Blast Freezing */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 flex flex-col justify-between overflow-hidden">
            <div className="h-28 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
              <img
                src={photo5ChickenBlastImg}
                alt="Chicken blast freezing at Waterfalls"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                Chickens Blast Freezing
              </h4>
              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5 font-medium">
                <div>Minimum: <strong>1 tonne</strong></div>
                <div>Maximum: <strong>10 tonnes / 24h</strong></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-['Outfit'] block">
                $0.25
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">per bird</span>
            </div>
          </div>

          {/* Card 2: Beef, Pork and Other Meat */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 flex flex-col justify-between overflow-hidden">
            <div className="h-28 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
              <img
                src={photo6BeefBlastImg}
                alt="Beef and meat blast freezing at Waterfalls"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
                Beef, Pork & Meat
              </h4>
              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5 font-medium">
                <div>Minimum: <strong>1 tonne</strong></div>
                <div>Maximum: <strong>15 tonnes / 24h</strong></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100">
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-['Outfit'] block">
                $0.20
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">per kg</span>
            </div>
          </div>
        </div>

        {/* Location and Direct Hotline from Flyer */}
        <div className="bg-blue-900/60 border border-blue-500/30 rounded-2xl p-3.5 text-xs text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>FF11 Waterfalls Avenue, Harare</span>
          </div>
          <div className="flex items-center gap-1.5 text-white font-mono font-bold">
            <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>+263 774 213 817</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenQuoteModal('Commercial Meat Blast Freezing Contract')}
            className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Book Capacity</span>
          </button>

          <a
            href={blastWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>WhatsApp Slot</span>
          </a>
        </div>
      </div>
    </div>
  );
};
