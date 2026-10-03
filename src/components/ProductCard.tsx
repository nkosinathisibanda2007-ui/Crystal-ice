import React from 'react';
import {
  Snowflake,
  ShoppingBag,
  ThermometerSnowflake,
  ShieldCheck,
  Package,
  Boxes,
  Truck,
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';
import { Product } from '../types/index.ts';

interface ProductCardProps {
  product: Product;
  onOpenOrderModal: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenOrderModal,
  onSelectProduct
}) => {
  // Determine card style based on product type
  const isSpecial25kg = product.id === 'prod-1' || product.name.includes('2.5kg');
  const isBlastFreezing = product.category === 'Meat Blast Freezing';
  const isSolidBlock = product.category === 'Solid Ice Blocks';

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
        isSpecial25kg
          ? 'bg-gradient-to-b from-cyan-950/20 via-white to-white border-cyan-300 ring-1 ring-cyan-400/30'
          : 'bg-white border-slate-200 hover:border-cyan-300'
      }`}
    >
      <div>
        {/* Technical Product Header & Graphic Visualizer (No AI Slop / Stock Photos) */}
        <div
          className={`relative h-48 w-full p-5 flex flex-col justify-between cursor-pointer overflow-hidden ${
            isSpecial25kg
              ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white'
              : isBlastFreezing
              ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white'
              : 'bg-gradient-to-br from-slate-900 to-slate-950 text-white'
          }`}
          onClick={() => onSelectProduct(product)}
        >
          {/* Authentic Photo Background */}
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-500"
            />
          )}

          {/* Subtle Ambient Background Grid & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Pill Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-cyan-300 border border-white/10">
              {isBlastFreezing ? (
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
              ) : isSolidBlock ? (
                <Boxes className="w-3 h-3 text-cyan-400" />
              ) : (
                <Snowflake className="w-3 h-3 text-cyan-400" />
              )}
              <span>{product.category}</span>
            </span>

            {isSpecial25kg && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500 text-slate-950 shadow-sm animate-pulse">
                Special $0.75
              </span>
            )}
          </div>

          {/* Central Technical Iconography Visual */}
          <div className="relative z-10 flex items-center justify-between my-auto py-2">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                Standard Packaging
              </span>
              <h4 className="text-xl font-extrabold font-['Outfit'] text-white">
                {product.package_size}
              </h4>
              {product.melt_rate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                  <ThermometerSnowflake className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{product.melt_rate}</span>
                </span>
              )}
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-cyan-400 backdrop-blur-sm group-hover:scale-110 transition-transform">
              {isBlastFreezing ? (
                <ThermometerSnowflake className="w-8 h-8 text-cyan-300" />
              ) : isSolidBlock ? (
                <Boxes className="w-8 h-8 text-cyan-300" />
              ) : isSpecial25kg ? (
                <Package className="w-8 h-8 text-cyan-300" />
              ) : (
                <Snowflake className="w-8 h-8 text-cyan-300" />
              )}
            </div>
          </div>

          {/* Bottom Footnote on Graphic Frame */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
            <span>Waterfalls Plant Certified</span>
            <span className="text-cyan-300 font-semibold font-mono">
              {product.price ? `$${product.price.toFixed(2)}` : 'Quote Base'}
            </span>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-5 space-y-3">
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer font-['Outfit'] leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Key Product Features List */}
          {product.features && product.features.length > 0 && (
            <ul className="space-y-1.5 pt-1 text-xs text-slate-600">
              {product.features.slice(0, 2).map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price & Minimum Order Line */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Order Quantity
              </span>
              <span className="font-bold text-slate-800">
                Min: {product.min_order_qty} {isBlastFreezing ? 'Tonne' : 'Bags/Units'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Wholesale Rate
              </span>
              <span className="text-base font-extrabold text-cyan-700 font-['Outfit']">
                {product.price ? `$${product.price.toFixed(2)}` : 'Contract Rate'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-2">
        <button
          id={`order-btn-${product.id}`}
          onClick={() => onOpenOrderModal(product)}
          className="py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Order Now</span>
        </button>

        <button
          id={`spec-btn-${product.id}`}
          onClick={() => onSelectProduct(product)}
          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
        >
          <span>Specs & Info</span>
          <ArrowRight className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
