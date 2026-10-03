import React, { useState } from 'react';
import { Sparkles, FileText, Factory, Snowflake, ThermometerSnowflake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';
import { PosterIceSpecial } from './PosterIceSpecial.tsx';
import { FlyerBlastFreeze } from './FlyerBlastFreeze.tsx';
import { PlantColdStorage } from './PlantColdStorage.tsx';
import { PlantBlockFreezing } from './PlantBlockFreezing.tsx';

interface AuthenticShowcaseProps {
  settings: WebsiteSettings;
  onOpenOrderModal: () => void;
  onOpenQuoteModal: (serviceTitle?: string) => void;
}

export const AuthenticShowcase: React.FC<AuthenticShowcaseProps> = ({
  settings,
  onOpenOrderModal,
  onOpenQuoteModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'offers' | 'plant'>('all');

  return (
    <div className="w-full space-y-8">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-black uppercase tracking-wider mb-2">
            <Factory className="w-3.5 h-3.5 text-cyan-600" />
            <span>Harare Plant Operations & Commercial Circulars</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Authentic Facilities & Official Offers
          </h2>
          <p className="text-slate-600 text-sm max-w-xl">
            Direct pricing, certified plant photos, and commercial blast freezing schedules operating from FF11 Waterfalls Avenue.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Plant circulars
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'offers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pricing & Offers
          </button>
          <button
            onClick={() => setActiveTab('plant')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'plant'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blast Freezing Facility
          </button>
        </div>
      </div>

      {/* Grid of the 4 Real Operational Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {(activeTab === 'all' || activeTab === 'offers') && (
          <div className="h-full">
            <PosterIceSpecial
              settings={settings}
              onOpenOrderModal={onOpenOrderModal}
            />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'offers') && (
          <div className="h-full">
            <FlyerBlastFreeze
              settings={settings}
              onOpenQuoteModal={onOpenQuoteModal}
            />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'plant') && (
          <div className="h-full">
            <PlantColdStorage onOpenOrderModal={onOpenOrderModal} />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'plant') && (
          <div className="h-full">
            <PlantBlockFreezing onOpenQuoteModal={onOpenQuoteModal} />
          </div>
        )}
      </div>
    </div>
  );
};
