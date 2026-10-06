import React, { useState, useMemo } from 'react';
import {
  Snowflake,
  Search,
  MessageCircle,
  FileText,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  RotateCcw
} from 'lucide-react';
import { Product, WebsiteSettings } from '../../types/index.ts';
import { BlastFreezingCalculator } from '../BlastFreezingCalculator.tsx';
import { SkeletonImage } from '../SkeletonImage.tsx';

// Exact user photos respected in numerical order
// Photo 2: 2.5kg ice cubes (cold room storage facility)
import photo2ColdRoomImg from '../../assets/images/cold_room_storage_1790856812685.jpg';
// Photo 3: Promo ice cubes flyer
import photo3IceCubesPromoImg from '../../assets/images/ice_cubes_promo_1790856824108.jpg';
// Photo 5: Chicken blast freezing
import photo5ChickenBlastImg from '../../assets/images/chicken_blast_freeze_1790856846432.jpg';
// Photo 6: Beef, pork & other meat freezing
import photo6BeefBlastImg from '../../assets/images/beef_blast_freeze_1790856859754.jpg';
// Photo 7: 5kg commercial packaged ice
import photo7PackagedIce5kgImg from '../../assets/images/packaged_ice_5kg_1790856872454.jpg';
// Photo 8: 10kg solid ice blocks storage
import photo8IceBlocksStorageImg from '../../assets/images/ice_blocks_storage_1790856885832.jpg';

interface ProductsViewProps {
  products: Product[];
  settings: WebsiteSettings;
  onOpenOrderModal: (product?: Product) => void;
  onOpenQuoteModal: (serviceTitle?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  settings,
  onOpenOrderModal,
  onOpenQuoteModal,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    return [
      'All',
      'Packaged Ice Cubes',
      'Solid Ice Blocks',
      'Meat Blast Freezing',
      'Commercial Contracts'
    ];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();

      const matchesCategory =
        selectedCategory === 'All' ||
        p.category === selectedCategory ||
        (selectedCategory === 'Meat Blast Freezing' && (p.category.includes('Blast') || p.name.includes('Blast'))) ||
        (selectedCategory === 'Solid Ice Blocks' && (p.category.includes('Solid') || p.name.includes('Block') || p.package_size?.includes('Block'))) ||
        (selectedCategory === 'Packaged Ice Cubes' && (p.category.includes('Cube') || p.name.includes('Cubes') || p.name.includes('Packaged'))) ||
        (selectedCategory === 'Commercial Contracts' && (p.category.includes('Contract') || p.name.includes('Contract') || p.availability === 'bulk_only'));

      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.package_size && p.package_size.toLowerCase().includes(q)) ||
        (p.ideal_for && p.ideal_for.some((f) => f.toLowerCase().includes(q))) ||
        (p.features && p.features.some((f) => f.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Exact image resolution per Step 3 instructions:
  // - 2.5kg photo: second photo (photo2ColdRoomImg)
  // - 5kg photo: seventh photo (photo7PackagedIce5kgImg)
  // - 10kg blocks: 8th photo (photo8IceBlocksStorageImg)
  // - chicken blast freezing: 5th photo (photo5ChickenBlastImg)
  // - beef and other meat freezing: 6th photo (photo6BeefBlastImg)
  const getProductImage = (product: Product) => {
    // If an image was uploaded or set for this product, use it immediately
    if (product.image && product.image.trim() !== '') {
      return product.image;
    }

    const lowerName = product.name.toLowerCase();
    const lowerSlug = product.slug?.toLowerCase() || '';

    // Chicken blast freezing -> 5th photo
    if (lowerName.includes('chicken') || lowerSlug.includes('chicken')) {
      return photo5ChickenBlastImg;
    }
    // Beef, pork & other meat freezing -> 6th photo
    if (lowerName.includes('beef') || lowerName.includes('pork') || lowerSlug.includes('beef') || (product.category.includes('Blast Freezing') && !lowerName.includes('chicken'))) {
      return photo6BeefBlastImg;
    }
    // 2.5kg ice photo -> 2nd photo
    if (lowerName.includes('2.5kg') || lowerSlug.includes('2-5kg')) {
      return photo2ColdRoomImg;
    }
    // 5kg ice photo -> 7th photo
    if (lowerName.includes('5kg') || lowerSlug.includes('5kg')) {
      return photo7PackagedIce5kgImg;
    }
    // 10kg solid ice blocks -> 8th photo
    if (lowerName.includes('10kg') || lowerSlug.includes('10kg') || product.category.includes('Solid')) {
      return photo8IceBlocksStorageImg;
    }
    // Default fallback
    return photo3IceCubesPromoImg;
  };

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const wholesaleWhatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello Crystal Ice Zimbabwe, I would like to inquire about commercial restaurant ice supply contract rates.'
  )}`;

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#0265B5] block">
            Products & Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B2545] font-['Outfit'] mt-2">
            Fresh Ice & Freezing Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Supplying packaged ice cubes, solid ice blocks, and industrial meat blast freezing services across Harare and surrounding areas.
          </p>
        </div>

        {/* Filter & Search Bar (Borderless Modern Design) */}
        <div className="bg-slate-50/80 p-3 sm:p-4 rounded-3xl shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0265B5] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs bg-white rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0265B5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Feedback & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'solution' : 'solutions'}
            {selectedCategory !== 'All' && (
              <span> in <strong className="text-[#0265B5]">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-slate-800">{searchQuery}</strong>"</span>
            )}
          </span>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 text-[#0265B5] hover:text-[#005599] font-bold text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show all</span>
            </button>
          )}
        </div>

        {/* Special Offer Highlight Banner - only shown when relevant to ice cubes, not pushing other categories off screen */}
        {!searchQuery && (selectedCategory === 'All' || selectedCategory === 'Packaged Ice Cubes') && (
          <div className="mb-12 rounded-3xl bg-gradient-to-r from-[#0B223D] via-[#0D2E55] to-[#0B223D] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Harare 2.5kg Pack Pricing
              </span>
              <h3 className="text-2xl font-black font-['Outfit']">
                $1.00 Retail • $0.75 for 100+ Packs
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Standard retail price is $1.00 per 2.5kg bag. For restaurants, bars, and functions ordering a minimum of 100 packs, our special rate is $0.75 per bag with refrigerated delivery included across Harare.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenOrderModal(products.find(p => p.name.includes('2.5kg')))}
                className="px-6 py-2.5 bg-[#0265B5] hover:bg-[#005599] text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Order 2.5kg Bags
              </button>
              <a
                href={wholesaleWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Inquiries</span>
              </a>
            </div>
          </div>
        )}

        {/* Empty State when no products match filter */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl p-8 mb-12 border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-blue-100 text-[#0265B5] rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No products or services match "{searchQuery}" in {selectedCategory === 'All' ? 'our catalog' : selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 bg-[#0265B5] text-white text-xs font-bold rounded-full hover:bg-[#005599] transition-colors"
            >
              Reset to All Products
            </button>
          </div>
        )}

        {/* Product Cards Grid matching Reference Styling (Borderless Elevated Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isIce = product.category.includes('Ice');
            const isBlast = product.category.includes('Blast Freezing');
            const cardImg = getProductImage(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                    <SkeletonImage
                      src={cardImg}
                      alt={product.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.price && (
                      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-xs text-[#0265B5] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        ${product.price.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
                      <span>{product.category}</span>
                      <span>{product.package_size}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0B2545] font-['Outfit'] leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>

                    {product.features && (
                      <ul className="pt-2 space-y-1 text-xs text-slate-600">
                        {product.features.slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0265B5] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                  {isBlast ? (
                    <button
                      onClick={() => onOpenQuoteModal(product.name)}
                      className="w-full py-2.5 bg-[#0265B5] hover:bg-[#005599] text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Request Quote / Booking</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenOrderModal(product)}
                      className="w-full py-2.5 bg-[#0265B5] hover:bg-[#005599] text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Industrial Meat Blast Freezing Calculator */}
        <div className="mt-16">
          <BlastFreezingCalculator
            settings={settings}
            onOpenQuoteModal={onOpenQuoteModal}
          />
        </div>
      </div>
    </div>
  );
};
