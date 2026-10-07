import React, { useState } from 'react';
import {
  Truck,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  Phone,
  MessageCircle,
  ArrowRight,
  Snowflake,
  Calculator,
  ThermometerSnowflake
} from 'lucide-react';
import { Service, WebsiteSettings } from '../../types/index.ts';
import { FlyerBlastFreeze } from '../plant/FlyerBlastFreeze.tsx';
import { PlantColdStorage } from '../plant/PlantColdStorage.tsx';
import { PlantBlockFreezing } from '../plant/PlantBlockFreezing.tsx';
import { SkeletonImage } from '../SkeletonImage.tsx';

// Exact user photos in order
import photo2ColdRoomImg from '../../assets/images/cold_room_storage_1790856812685.jpg';
import photo3IceCubesPromoImg from '../../assets/images/ice_cubes_promo_1790856824108.jpg';
import photo4IceBlocksFreezingImg from '../../assets/images/ice_blocks_freezing_1790856836725.jpg';
import photo5ChickenBlastImg from '../../assets/images/chicken_blast_freeze_1790856846432.jpg';
import photo6BeefBlastImg from '../../assets/images/beef_blast_freeze_1790856859754.jpg';
import photo7PackagedIce5kgImg from '../../assets/images/packaged_ice_5kg_1790856872454.jpg';
import photo8IceBlocksStorageImg from '../../assets/images/ice_blocks_storage_1790856885832.jpg';

interface ServicesViewProps {
  services: Service[];
  settings: WebsiteSettings;
  onOpenQuoteModal: (serviceTitle?: string) => void;
  onOpenOrderModal: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  settings,
  onOpenQuoteModal,
  onOpenOrderModal
}) => {
  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('Hello Crystal Ice Zimbabwe, I want to discuss commercial ice supply or blast freezing services.')}`;

  // Interactive Blast Freezing Estimator
  const [calcType, setCalcType] = useState<'chicken' | 'beef'>('chicken');
  const [chickenCount, setChickenCount] = useState<number>(2000);
  const [beefWeightKg, setBeefWeightKg] = useState<number>(2500);

  const chickenRate = 0.25; // $0.25 per bird
  const beefRate = 0.20;    // $0.20 per kg

  const estimatedCost = calcType === 'chicken' 
    ? (chickenCount * chickenRate) 
    : (beefWeightKg * beefRate);

  const estimatedCapacityTonnes = calcType === 'chicken'
    ? ((chickenCount * 1.5) / 1000).toFixed(1) // avg 1.5kg dressed bird
    : (beefWeightKg / 1000).toFixed(1);

  const getServiceFallbackImage = (service: Service) => {
    const t = service.title.toLowerCase();
    if (t.includes('chicken') || t.includes('blast') || t.includes('freezing') || service.id === 'serv-2') return photo5ChickenBlastImg;
    if (t.includes('restaurant') || t.includes('daily') || service.id === 'serv-1') return photo3IceCubesPromoImg;
    if (t.includes('event') || t.includes('wedding') || service.id === 'serv-3') return photo7PackagedIce5kgImg;
    if (t.includes('butcher') || t.includes('block') || service.id === 'serv-4') return photo8IceBlocksStorageImg;
    return photo2ColdRoomImg;
  };

  // Exact authentic photo per service with live custom overrides support
  const getServiceImage = (service: Service) => {
    const customImgs = settings.custom_images || {};
    if (service.id === 'serv-1' && (customImgs['ice-cubes-2-5kg'] || customImgs['ice_cubes_2_5kg'])) {
      return customImgs['ice-cubes-2-5kg'] || customImgs['ice_cubes_2_5kg'];
    }
    if (service.id === 'serv-2' && (customImgs['chicken-blast'] || customImgs['chicken_blast'] || settings.chicken_blast_image)) {
      return customImgs['chicken-blast'] || customImgs['chicken_blast'] || settings.chicken_blast_image;
    }
    if (service.id === 'serv-3' && (customImgs['ice-promo'] || settings.ice_cubes_promo_image)) {
      return customImgs['ice-promo'] || settings.ice_cubes_promo_image;
    }
    if (service.id === 'serv-4' && (customImgs['ice-blocks-freezing'] || settings.ice_blocks_image)) {
      return customImgs['ice-blocks-freezing'] || settings.ice_blocks_image;
    }

    if (service.image && service.image.trim() !== '') {
      return service.image;
    }

    return getServiceFallbackImage(service);
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-100/60 px-3 py-1 rounded-full border border-cyan-200">
            Harare Commercial Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit'] mt-3">
            Ice Supply & Industrial Blast Freezing
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Supplying Harare restaurants, bars, and caterers with scheduled ice deliveries, emergency top-ups, and commercial blast freezing for poultry and livestock producers.
          </p>
        </div>

        {/* Blast Freezing Command Center: Interactive Calculator + Official Harare Flyer */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Blast Freezing Quick Estimator */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                      Interactive Rate Estimator
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-['Outfit']">
                      Meat Blast Freezing Calculator
                    </h3>
                  </div>
                </div>

                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCalcType('chicken')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      calcType === 'chicken' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Chickens ($0.25/bird)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcType('beef')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      calcType === 'beef' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Beef & Pork ($0.20/kg)
                  </button>
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <div>
                  {calcType === 'chicken' ? (
                    <div>
                      <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5">
                        <span className="font-semibold">Number of Chickens (Dressed / Whole Birds)</span>
                        <span className="font-mono text-cyan-400 font-bold">{chickenCount.toLocaleString()} birds</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        step="250"
                        value={chickenCount}
                        onChange={(e) => setChickenCount(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Min 500 birds (~0.75T)</span>
                        <span>5,000 birds</span>
                        <span>Max 10,000 birds/day (~15T)</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5">
                        <span className="font-semibold">Meat Weight (Beef Quarters, Pork, Sausage)</span>
                        <span className="font-mono text-cyan-400 font-bold">{beefWeightKg.toLocaleString()} kg</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="15000"
                        step="250"
                        value={beefWeightKg}
                        onChange={(e) => setBeefWeightKg(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Min 500 kg (0.5T)</span>
                        <span>7,500 kg</span>
                        <span>Max 15,000 kg/day (15T)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Freezing Cycle</span>
                    <span className="font-bold text-cyan-300 text-sm block mt-0.5">Sub-Zero Core Freeze</span>
                    <span className="text-[10px] text-slate-400">Zero drip loss or cell breakdown</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Intake Facility</span>
                    <span className="font-bold text-cyan-300 text-sm block mt-0.5">FF11 Waterfalls Ave</span>
                    <span className="text-[10px] text-slate-400">Mainway Meadows, Harare</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Estimated Total Fee
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-['Outfit']">
                    ${estimatedCost.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {calcType === 'chicken' 
                      ? `${chickenCount.toLocaleString()} birds @ $0.25 each (~${estimatedCapacityTonnes}T total weight)`
                      : `${beefWeightKg.toLocaleString()} kg @ $0.20/kg (~${estimatedCapacityTonnes}T)`}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal(`Meat Blast Freezing: ${calcType === 'chicken' ? `${chickenCount} chickens` : `${beefWeightKg}kg beef/pork`}`)}
                    className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Freezing Intake Slot</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Official Blast Freezing Circular Flyer */}
          <div className="lg:col-span-5 w-full">
            <FlyerBlastFreeze
              settings={settings}
              onOpenQuoteModal={onOpenQuoteModal}
            />
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-8">
          {services.map((service, idx) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row"
            >
              {/* Authentic Photo */}
              <div className="md:w-72 lg:w-80 h-52 md:h-auto shrink-0 relative bg-slate-900 overflow-hidden">
                <SkeletonImage
                  src={getServiceImage(service)}
                  fallbackSrc={getServiceFallbackImage(service)}
                  alt={service.title}
                  priority={true}
                  containerClassName="w-full h-full min-h-[200px]"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text Content */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 font-bold">
                      <Snowflake className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider block">
                        Commercial Program #{idx + 1}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Callout */}
                <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Pricing & Terms</span>
                    <span className="text-base font-bold text-slate-900 font-['Outfit'] block mt-0.5">
                      Commercial Volume Rates
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Direct delivery across Harare or direct plant intake at Waterfalls.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      id={`quote-service-${service.id}`}
                      onClick={() => onOpenQuoteModal(service.title)}
                      className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Request Proposal</span>
                    </button>

                    <button
                      id={`order-service-${service.id}`}
                      onClick={onOpenOrderModal}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Order Packaged Ice</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plant Infrastructure: Authentic Cold Storage & Block Freezing Lines */}
        <div className="mt-14 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-100/60 px-3 py-1 rounded-full border border-cyan-200">
              Plant Infrastructure
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-2">
              Inside Our Waterfalls Ave Facility
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Engineered with dedicated multi-tier block freezing racks and 50,000kg sub-zero insulated cold storage rooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PlantColdStorage onOpenOrderModal={onOpenOrderModal} />
            <PlantBlockFreezing onOpenQuoteModal={onOpenQuoteModal} />
          </div>
        </div>

        {/* Dispatch Contact Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-cyan-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Waterfalls Dispatch Desk
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit']">
              Talk to Our Harare Cold Logistics Coordinator
            </h3>
            <p className="text-xs text-cyan-200">
              Reach us directly for immediate intake bookings or same-day restaurant emergency drops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${settings.phone_primary}`}
              className="px-5 py-3 bg-white text-slate-900 hover:bg-cyan-50 font-bold rounded-xl text-xs sm:text-sm shadow transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-cyan-600" />
              <span>{settings.phone_primary}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
