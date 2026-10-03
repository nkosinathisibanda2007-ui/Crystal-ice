import React from 'react';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  ShoppingBag,
  FileText,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { DeliveryArea, WebsiteSettings } from '../../types/index.ts';

interface DeliveryViewProps {
  deliveryAreas: DeliveryArea[];
  settings: WebsiteSettings;
  onOpenOrderModal: () => void;
  onOpenQuoteModal: () => void;
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  deliveryAreas,
  settings,
  onOpenOrderModal,
  onOpenQuoteModal
}) => {
  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-100/60 px-3 py-1 rounded-full border border-cyan-200">
            Cold-Chain Logistics
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit'] mt-3">
            Delivery Zones & Warehouse Pickup
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Our multi-temp refrigerated fleet maintains -18°F product hold until the moment ice reaches your freezers. Order for same-day dispatch or pick up directly at Bay Door 3.
          </p>
        </div>

        {/* Same-day Notification Card */}
        <div className="mb-12 p-6 rounded-3xl bg-cyan-50 border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cyan-950 font-['Outfit']">
                Same-Day Metro Dispatch Cutoff: {settings.same_day_cutoff_time}
              </h3>
              <p className="text-xs text-cyan-800 mt-0.5">
                Orders received before {settings.same_day_cutoff_time} are guaranteed delivery by 4:00 PM same day. Emergency runs available 24/7.
              </p>
            </div>
          </div>

          <button
            id="delivery-quick-order-btn"
            onClick={onOpenOrderModal}
            className="shrink-0 px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            Order Same-Day Run
          </button>
        </div>

        {/* Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {deliveryAreas.map((area) => (
            <div
              key={area.id}
              id={`delivery-zone-card-${area.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                      {area.area_name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {area.delivery_fee === 0 ? 'FREE DELIVERY' : `$${area.delivery_fee} Flat Rate`}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {area.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Min. Order</span>
                    <span className="font-extrabold text-slate-900 block mt-0.5">
                      ${area.minimum_order_amount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Typical Arrival</span>
                    <span className="font-extrabold text-cyan-700 block mt-0.5">
                      {area.estimated_delivery_time}
                    </span>
                  </div>
                </div>

                {/* Zip codes / localities covered */}
                {area.zip_codes && area.zip_codes.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                      Postal Coverage Areas
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {area.zip_codes.map((zip, zIdx) => (
                        <span
                          key={zIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {zip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-xs text-slate-400">Scheduled runs twice daily</span>
                <button
                  id={`order-area-btn-${area.id}`}
                  onClick={onOpenOrderModal}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Order to This Zone
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Warehouse Pickup Instructions */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Delivery Fee Pickup
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                Direct Plant Dock Loading
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Need ice immediately? Swing by our main cold manufacturing plant. Our loading dock team will forklift pallet loads directly into your refrigerated van or assist in loading bags and cocktail boxes into your car trunk.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span><strong>Plant Location:</strong> {settings.physical_address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span><strong>Loading Hours:</strong> {settings.business_hours}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span><strong>Dock Door 3:</strong> Designated express pickup lane for web order confirmations.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold font-['Outfit'] text-cyan-300 uppercase tracking-wider">
                Pickup Checklist
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-600/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Select "Warehouse Pickup" at order checkout to bypass delivery fees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-600/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Receive your order reference number via screen and WhatsApp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-600/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Pull into Bay Door 3. Show reference number for touch-free loading.</span>
                </li>
              </ul>

              <button
                id="pickup-order-cta"
                onClick={onOpenOrderModal}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Schedule Warehouse Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
