import React from 'react';
import {
  GlassWater,
  Building,
  Music,
  Utensils,
  Store,
  Factory,
  CheckCircle,
  FileText,
  ThermometerSnowflake,
  ShoppingBag
} from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';

interface CustomersViewProps {
  settings: WebsiteSettings;
  onOpenQuoteModal: (serviceTitle?: string) => void;
  onOpenOrderModal: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  settings,
  onOpenQuoteModal,
  onOpenOrderModal
}) => {
  const customerSegments = [
    {
      title: "Harare Restaurants, Grills & Cafes",
      icon: Utensils,
      painPoint: "Ice machines failing during power load shedding and cloudy ice that melts too fast in Harare heat, watering down soft drinks and cocktails.",
      solution: "Pure 2.5kg & 5kg ice bags with carry handles, scheduled replenishment directly into restaurant freezers. Special $0.75 offer with free delivery on MOQ 100.",
      popularProduct: "2.5kg Packaged Ice Cubes ($0.75 Special)",
      suggestedService: "Restaurant Daily Ice Replenishment Contract"
    },
    {
      title: "Sports Bars, Nightclubs & Lounges",
      icon: GlassWater,
      painPoint: "Running out of ice during busy football matches and weekend music nights; cloudy ice leaves unpleasant tap residue in premium whiskies.",
      solution: "Slow-dilution crystal cubes and blocks that keep drinks icy cold through extended sessions, backed by same-day emergency top-up runs.",
      popularProduct: "5kg Commercial Ice Bags & 10kg Solid Blocks",
      suggestedService: "Bar & Nightclub Weekend Staging Program"
    },
    {
      title: "Commercial Poultry & Broiler Farmers",
      icon: ThermometerSnowflake,
      painPoint: "Slow home or walk-in freezing causes cellular rupture, high drip loss, chicken weight reduction, and risk of bacterial contamination.",
      solution: "High-velocity sub-zero blast freezing at FF11 Waterfalls Avenue for just $0.25 per bird. Minimum 1 tonne, up to 10 tonnes per 24 hours.",
      popularProduct: "Poultry Meat Blast Freezing ($0.25 / bird)",
      suggestedService: "Meat Blast Freezing Intake Services"
    },
    {
      title: "Butcheries & Meat Wholesalers",
      icon: Factory,
      painPoint: "Load shedding threatens expensive carcass stock; domestic freezers take 24-48 hours to freeze heavy quarters, risking core spoilage.",
      solution: "Sub-zero blast freezing at $0.20/kg (up to 15 tonnes/day) plus 10kg solid blocks ($2.50) to hold butchery display cold for 24-48 hours.",
      popularProduct: "Beef & Pork Blast Freezing ($0.20 / kg) & 10kg Ice Blocks",
      suggestedService: "Commercial Meat Blast Freezing & Ice Block Backup"
    },
    {
      title: "Weddings, Galas & Event Caterers",
      icon: Music,
      painPoint: "Outdoor receptions in Borrowdale, Glen Lorne, or Chitungwiza running out of cold drinks, with caterers scrambling to find last-minute ice.",
      solution: "Bulk deliveries of 10kg solid blocks and 2.5kg/5kg cubes pre-staged in insulated cool boxes for open bars and braai areas.",
      popularProduct: "10kg Solid Ice Blocks ($2.50 each) + 2.5kg Bags",
      suggestedService: "Event & Wedding Bulk Ice Supply"
    },
    {
      title: "Bottle Stores & Service Station Marts",
      icon: Store,
      painPoint: "Customers demanding bags of ice for weekend braais and road trips, but owners don't want the headache of unreliable ice makers.",
      solution: "Consistently packaged 2.5kg & 5kg bags with easy carry handles, delivered on scheduled morning runs ready for chest freezers.",
      popularProduct: "2.5kg Ice Bags with Carry Handles",
      suggestedService: "Retail Reseller Stocking Program"
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-100/60 px-3 py-1 rounded-full border border-cyan-200">
            Zimbabwe Commercial Sectors
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit'] mt-3">
            Who Crystal Ice Supplies in Harare
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            From premier dining venues and vibrant sports bars to large-scale poultry producers and meat wholesalers across Harare.
          </p>
        </div>

        {/* Segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {customerSegments.map((segment, idx) => {
            const Icon = segment.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-2">
                    {segment.title}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-900">
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-600 mb-0.5">
                        The Challenge
                      </span>
                      {segment.painPoint}
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 text-cyan-950">
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-cyan-700 mb-0.5">
                        Crystal Ice Solution
                      </span>
                      {segment.solution}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Recommended: </span>
                    {segment.popularProduct}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => onOpenQuoteModal(segment.suggestedService)}
                    className="flex-1 py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Get Quote</span>
                  </button>
                  <button
                    onClick={onOpenOrderModal}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                    title="Order Ice"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Commercial Contracting & Regular Supply
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
            Need Scheduled Deliveries for Your Restaurant or Butchery?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Get guaranteed daily or weekly deliveries across Harare with locked-in commercial volume rates, reliable delivery windows, and priority emergency dispatch.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onOpenQuoteModal('Commercial Restaurant Ice Supply Contract')}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
            >
              Discuss Restaurant / Butchery Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
