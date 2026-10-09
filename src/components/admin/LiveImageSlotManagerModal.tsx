import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Check,
  ShieldCheck
} from 'lucide-react';
import { SiteImageSlot } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface LiveImageSlotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshSiteData: () => void;
  initialSelectedSlotId?: string;
}

export const LiveImageSlotManagerModal: React.FC<LiveImageSlotManagerModalProps> = ({
  isOpen,
  onClose,
  onRefreshSiteData,
  initialSelectedSlotId
}) => {
  const [slots, setSlots] = useState<SiteImageSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewSlot, setPreviewSlot] = useState<SiteImageSlot | null>(null);
  const [confirmRemoveSlotId, setConfirmRemoveSlotId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetSlotForFileInput, setTargetSlotForFileInput] = useState<string | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getSiteImageSlots();
      setSlots(data || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load website image slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
      if (initialSelectedSlotId) {
        // If a specific slot was passed, focus on it
        const cat = initialSelectedSlotId.startsWith('product-')
          ? 'products'
          : initialSelectedSlotId.startsWith('service-')
          ? 'services'
          : 'all';
        setActiveCategory(cat);
      }
    }
  }, [isOpen, initialSelectedSlotId]);

  if (!isOpen) return null;

  const handleTriggerUpload = (slotId: string) => {
    setTargetSlotForFileInput(slotId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = targetSlotForFileInput;
    if (!file || !slotId) return;

    setUploadingSlotId(slotId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.replaceSiteImageSlot(slotId, file);
      setSuccessMessage(`Replaced picture for "${slotId}" with original "${file.name}" (${Math.round(file.size / 1024)} KB)! Live website updated.`);
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, currentUrl: res.newUrl } : s));
      await fetchSlots();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload exact picture');
    } finally {
      setUploadingSlotId(null);
      setTargetSlotForFileInput(null);
    }
  };

  const handleRemoveImage = async (slotId: string, slotTitle: string) => {
    setUploadingSlotId(slotId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await api.removeSiteImageSlot(slotId);
      setSuccessMessage(`Removed picture from "${slotTitle}". Live website updated.`);
      setConfirmRemoveSlotId(null);
      await fetchSlots();
      onRefreshSiteData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove picture');
    } finally {
      setUploadingSlotId(null);
    }
  };

  const filteredSlots = activeCategory === 'all'
    ? slots
    : slots.filter((s) => s.category === activeCategory);

  return (
    <div
      id="live-image-manager-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="live-image-manager-dialog"
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          className="hidden"
          id="exact-slot-file-picker"
        />

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit'] tracking-tight">
                  Exact Image Uploader & Live Replacer
                </h2>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Add, replace, or remove pictures in any slot on the website live without altering code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Banners */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-6 text-xs text-emerald-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 px-2 py-0.5 rounded font-bold text-emerald-900">
              LIVE BROADCAST (SSE)
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border-b border-rose-200 p-3 px-6 text-xs text-rose-800 flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Filter Navigation Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-500 font-semibold mr-1">Slots:</span>
            {[
              { id: 'all', label: `All Slots (${slots.length})` },
              { id: 'hero', label: 'Hero & Storefront' },
              { id: 'products', label: 'Catalog Products' },
              { id: 'services', label: 'Plant Services' },
              { id: 'about', label: 'About Facility' },
              { id: 'portfolio', label: 'Portfolio' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#0265B5] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Uncompressed Lossless Streaming</span>
          </div>
        </div>

        {/* Picture Slots List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-[#0265B5] mx-auto mb-2" />
              Scanning website picture slots...
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No picture slots found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSlots.map((slot) => {
                const isUploading = uploadingSlotId === slot.id;
                const hasImage = !!slot.currentUrl;

                return (
                  <div
                    key={slot.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top slot info */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              {slot.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              Ratio: {slot.recommendedAspect}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1.5 font-['Outfit']">
                            {slot.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {slot.description}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            hasImage
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {hasImage ? 'Active Picture' : 'Empty Slot'}
                        </span>
                      </div>

                      {/* Image Preview Box with responsive fit and zero black borders */}
                      <div className="w-full h-40 rounded-xl bg-slate-100 border border-slate-200 relative flex items-center justify-center overflow-hidden group">
                        {hasImage ? (
                          <img
                            src={slot.currentUrl}
                            alt={slot.title}
                            className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-center text-slate-400 text-xs flex flex-col items-center">
                            <ImageIcon className="w-8 h-8 mb-1 stroke-1 text-slate-400" />
                            <span>No picture currently assigned</span>
                          </div>
                        )}

                        {hasImage && (
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded shadow-sm">
                            Active Slot
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Add/Replace or Remove */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Upload / Replace Button */}
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(slot.id)}
                        disabled={isUploading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#0265B5] hover:bg-[#005599] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{hasImage ? 'Upload & Replace' : 'Upload Exact Picture'}</span>
                          </>
                        )}
                      </button>

                      {/* Remove Button with Safe Inline Confirmation */}
                      {hasImage && (
                        confirmRemoveSlotId === slot.id ? (
                          <div className="flex items-center gap-1 shrink-0 animate-in fade-in duration-150">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(slot.id, slot.title)}
                              disabled={isUploading}
                              className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Confirm?
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveSlotId(null)}
                              className="px-2.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmRemoveSlotId(slot.id)}
                            disabled={isUploading}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                            title="Remove picture from this slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updates sync live instantly to public visitors via Server-Sent Events.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
