import React, { useState } from 'react';
import {
  ThermometerSnowflake,
  ShieldCheck,
  Clock,
  MapPin,
  FileText,
  MessageCircle,
  Truck,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

interface BlastFreezingCalculatorProps {
  settings: WebsiteSettings;
  onOpenQuoteModal: (serviceTitle?: string) => void;
}

export const BlastFreezingCalculator: React.FC<BlastFreezingCalculatorProps> = ({
  settings,
  onOpenQuoteModal
}) => {
  const [meatType, setMeatType] = useState<'chickens' | 'beef_pork'>('chickens');
  const [chickenCount, setChickenCount] = useState<number>(1200);
  const [meatWeightKg, setMeatWeightKg] = useState<number>(1500);

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');

  const chickenRate = 0.25; // $0.25 per bird
  const beefPorkRate = 0.20; // $0.20 per kg

  const calculatedTotal =
    meatType === 'chickens'
      ? chickenCount * chickenRate
      : meatWeightKg * beefPorkRate;

  const estimatedTonnes =
    meatType === 'chickens'
      ? ((chickenCount * 1.4) / 1000).toFixed(2)
      : (meatWeightKg / 1000).toFixed(2);

  const whatsappMessage =
    meatType === 'chickens'
      ? `Hello Crystal Ice Zimbabwe, I want to book industrial blast freezing for approximately ${chickenCount} chickens (~${estimatedTonnes} tonnes). Estimated fee: $${calculatedTotal.toFixed(2)}. Please confirm intake scheduling at your Waterfalls facility.`
      : `Hello Crystal Ice Zimbabwe, I want to book industrial blast freezing for ${meatWeightKg}kg of beef/pork (~${estimatedTonnes} tonnes). Estimated fee: $${calculatedTotal.toFixed(2)}. Please confirm intake scheduling at your Waterfalls facility.`;

  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant Commercial Freezing Estimator</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Industrial Meat Blast Freezing Rates
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              FF11 Waterfalls facility with 15 tonnes/24h capacity. Rapid core pull-down to -18°C or below, locking in natural bloom and preventing weight loss.
            </p>
          </div>

          {/* Service Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMeatType('chickens')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                meatType === 'chickens'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Chickens & Broilers</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/30 font-mono">
                $0.25/bird
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMeatType('beef_pork')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                meatType === 'beef_pork'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Beef, Pork & Game</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/30 font-mono">
                $0.20/kg
              </span>
            </button>
          </div>

          {/* Quantity Controls */}
          {meatType === 'chickens' ? (
            <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Number of Chickens (Birds):</span>
                <span className="text-cyan-400 font-bold font-mono text-sm">
                  {chickenCount.toLocaleString()} birds
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={chickenCount}
                onChange={(e) => setChickenCount(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Min: 500 birds (~1T)</span>
                <span>Max: 8,000+ birds (10T/day)</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Batch Weight (Kilograms):</span>
                <span className="text-cyan-400 font-bold font-mono text-sm">
                  {meatWeightKg.toLocaleString()} kg
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="15000"
                step="250"
                value={meatWeightKg}
                onChange={(e) => setMeatWeightKg(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Min: 1,000 kg (1T)</span>
                <span>Max: 15,000 kg (15T/day)</span>
              </div>
            </div>
          )}

          {/* Plant Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Core blast freeze to -18°C</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>24-Hour batch turnaround</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Sanitary veterinary standard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Spacious truck loading bay</span>
            </div>
          </div>
        </div>

        {/* Right Calculation Outcome Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 border border-cyan-500/30 space-y-5 shadow-xl">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
              Estimated Total Cost
            </span>
            <div className="text-4xl sm:text-5xl font-black font-['Outfit'] text-cyan-300 mt-1">
              ${calculatedTotal.toFixed(2)}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Batch tonnage: <strong className="text-white font-mono">{estimatedTonnes} Tonnes</strong>
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Unit Rate:</span>
              <span className="font-bold text-white font-mono">
                {meatType === 'chickens' ? '$0.25 / bird' : '$0.20 / kg'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Turnaround:</span>
              <span className="font-bold text-cyan-300">24 Hours Deep Pull-down</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Plant Location:</span>
              <span className="font-bold text-white">Waterfalls, Harare</span>
            </div>
          </div>

          {/* Booking Actions */}
          <div className="pt-2 space-y-2.5">
            <a
              id="calculator-whatsapp-book-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book Slot via WhatsApp</span>
            </a>

            <button
              id="calculator-quote-modal-btn"
              type="button"
              onClick={() =>
                onOpenQuoteModal(
                  meatType === 'chickens'
                    ? 'Chickens Blast Freezing'
                    : 'Beef & Pork Meat Blast Freezing'
                )
              }
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Request Pro-Forma Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
