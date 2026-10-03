import React from 'react';
import { ThermometerSnowflake, ShieldCheck, Layers, Sparkles, ArrowRight } from 'lucide-react';

interface PlantBlockFreezingProps {
  onOpenQuoteModal: (serviceTitle?: string) => void;
}

export const PlantBlockFreezing: React.FC<PlantBlockFreezingProps> = ({ onOpenQuoteModal }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 text-white shadow-2xl flex flex-col justify-between max-w-md mx-auto">
      {/* Authentic Facility Photo Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src="/ice_blocks_freezing_1790856836725.jpg"
          alt="Crystal Ice Industrial Block Freezing Plant"
          className="w-full h-full object-cover object-[center_40%]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-blue-950/90 text-cyan-300 text-xs font-bold border border-cyan-500/40">
            Multi-Tier Freezing Lines
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-700/90 text-white text-xs font-bold">
            10kg & 25kg Solid Blocks
          </span>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Solid Core Crystallization
          </div>
          <h3 className="text-lg font-black text-white font-['Outfit'] mt-0.5">
            Industrial Hanging Block Production
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Our hanging immersion freezing method expels dissolved gases, creating solid slow-melt blocks that outlast standard ice by up to 300% in Harare's climate.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Melt Duration</span>
            <span className="text-white font-bold text-sm">Up to 48 Hours</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Density</span>
            <span className="text-cyan-400 font-bold text-sm">Bubble-Free Core</span>
          </div>
        </div>

        <button
          onClick={() => onOpenQuoteModal('Industrial 10kg/25kg Solid Block Supply')}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <span>Request Block Ice Contract</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
