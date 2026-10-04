import React from 'react';
import {
  X,
  Snowflake,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  FileText,
  Boxes,
  ThermometerSnowflake
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { SkeletonImage } from './SkeletonImage.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderProduct: (product: Product) => void;
  onQuoteProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOrderProduct,
  onQuoteProduct
}) => {
  if (!product) return null;

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto">
          {/* Technical Product Header (No AI Slop / Stock Photos) */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2 max-w-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-md">
                  <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                  {product.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span>Standard Package: <strong className="text-white font-mono">{product.package_size}</strong></span>
                  <span>•</span>
                  <span>Waterfalls Plant Certified</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-right shadow-lg">
                <span className="text-[10px] uppercase font-bold text-cyan-300 block">Commercial Rate</span>
                <span className="text-2xl font-black text-white font-['Outfit']">
                  {product.price_display}
                </span>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Product Real Image if available */}
            {product.image && (
              <div className="p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-56 sm:h-64 w-full overflow-hidden rounded-xl bg-slate-100 relative">
                  <SkeletonImage
                    src={product.image}
                    alt={product.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Product Specification & Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Packaging</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">{product.package_size}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Dimensions</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">{product.dimensions || 'Precision Cut'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Min. Order</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">
                  {product.min_order_qty ? `${product.min_order_qty} units` : '1 unit'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Availability</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1 capitalize">
                  {product.availability.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Melt Rate & Thermal Retention */}
            {product.melt_rate && (
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-start gap-3">
                <ThermometerSnowflake className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-cyan-950 uppercase tracking-wider">
                    Thermodynamic Melt Profile
                  </h4>
                  <p className="text-xs text-cyan-900 mt-1">
                    {product.melt_rate}
                  </p>
                </div>
              </div>
            )}

            {/* Ideal Pairings */}
            {product.ideal_for && product.ideal_for.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Engineered For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.ideal_for.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Quality Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Quality Standards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                id={`modal-order-btn-${product.id}`}
                onClick={() => {
                  onClose();
                  onOrderProduct(product);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order This Ice</span>
              </button>

              <button
                id={`modal-quote-btn-${product.id}`}
                onClick={() => {
                  onClose();
                  onQuoteProduct(product);
                }}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Request Pallet Quote</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
