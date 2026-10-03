import React from 'react';
import { ThermometerSnowflake, ShieldCheck, Box, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface PlantColdStorageProps {
  onOpenOrderModal: () => void;
}

export const PlantColdStorage: React.FC<PlantColdStorageProps> = ({ onOpenOrderModal }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 text-white shadow-2xl flex flex-col justify-between max-w-md mx-auto">
      {/* Authentic Facility Photo Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src="/cold_room_storage_1790856812685.jpg"
          alt="Crystal Ice Walk-in Cold Storage & Loading Facility"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5">
            <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>-18°C Storage Vault</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-900/90 text-emerald-200 text-xs font-bold">
            50 Tonne Capacity
          </span>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Bulk Holding Facility
          </div>
          <h3 className="text-lg font-black text-white font-['Outfit'] mt-0.5">
            50,000kg Packaged Cold Storage
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Continuous sub-zero holding prevents melting, clumping, and bag distortion. Ready for immediate palletized loading into our refrigerated delivery fleet.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Reserve Capacity</span>
            <span className="text-white font-bold text-sm">50+ Tonnes</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Temperature Lock</span>
            <span className="text-cyan-400 font-bold text-sm">-18°C Core</span>
          </div>
        </div>

        <button
          onClick={onOpenOrderModal}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <span>Reserve Immediate Pallet Delivery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
