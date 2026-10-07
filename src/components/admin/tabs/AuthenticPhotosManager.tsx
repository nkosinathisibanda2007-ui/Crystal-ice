import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { WebsiteSettings, Product } from '../../../types/index.ts';

interface AuthenticPhotosManagerProps {
  settings: WebsiteSettings;
  products: Product[];
  onRefreshData?: () => void;
}

interface PhotoSlot {
  id: string;
  slotNumber: number;
  label: string;
  description: string;
  defaultPath: string;
  targetKey: string;
  currentPreview: string;
}

export const AuthenticPhotosManager: React.FC<AuthenticPhotosManagerProps> = ({
  settings,
  products,
  onRefreshData
}) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Logo upload state
  const [logoPreview, setLogoPreview] = useState<string>(
    settings.logo_url || '/crystal-ice-logo.svg'
  );

  // Dynamic preview map for each slot
  const [slotPreviews, setSlotPreviews] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {
      'logo': settings.logo_url || '/crystal-ice-logo.svg',
      'storefront': settings.storefront_image || settings.about_facility_image || settings.hero_bg_image || '/crystal_ice_storefront.jpg',
      'ice-cubes-2-5kg': products.find(p => p.id === 'prod-1')?.image || '/cold_room_storage_1790856812685.jpg',
      'ice-promo': settings.homepage_ice_cubes_image || settings.ice_cubes_promo_image || settings.custom_images?.['ice-promo'] || '/ice_cubes_promo_1790856824108.jpg',
      'ice-blocks-freezing': settings.ice_blocks_image || '/ice_blocks_freezing_1790856836725.jpg',
      'chicken-blast': products.find(p => p.id === 'prod-4')?.image || '/chicken_blast_freeze_1790856846432.jpg',
      'beef-blast': products.find(p => p.id === 'prod-5')?.image || '/beef_blast_freeze_1790856859754.jpg',
      'ice-bags-5kg': products.find(p => p.id === 'prod-2')?.image || '/packaged_ice_5kg_1790856872454.jpg',
      'ice-blocks-10kg': products.find(p => p.id === 'prod-3')?.image || '/ice_blocks_storage_1790856885832.jpg',
    };
    try {
      const overrides = JSON.parse(localStorage.getItem('crystal_ice_slot_overrides') || '{}');
      return { ...initial, ...overrides };
    } catch {
      return initial;
    }
  });

  // Sync with prop updates
  useEffect(() => {
    setSlotPreviews(prev => {
      const updated = { ...prev };
      if (settings.logo_url) updated['logo'] = settings.logo_url;
      if (settings.storefront_image) updated['storefront'] = settings.storefront_image;
      if (settings.ice_blocks_image) updated['ice-blocks-freezing'] = settings.ice_blocks_image;
      if (settings.homepage_ice_cubes_image) {
        updated['ice-promo'] = settings.homepage_ice_cubes_image;
      } else if (settings.ice_cubes_promo_image) {
        updated['ice-promo'] = settings.ice_cubes_promo_image;
      }
      const p1 = products.find(p => p.id === 'prod-1');
      if (p1?.image) updated['ice-cubes-2-5kg'] = p1.image;
      const p2 = products.find(p => p.id === 'prod-2');
      if (p2?.image) updated['ice-bags-5kg'] = p2.image;
      const p3 = products.find(p => p.id === 'prod-3');
      if (p3?.image) updated['ice-blocks-10kg'] = p3.image;
      const p4 = products.find(p => p.id === 'prod-4');
      if (p4?.image) updated['chicken-blast'] = p4.image;
      const p5 = products.find(p => p.id === 'prod-5');
      if (p5?.image) updated['beef-blast'] = p5.image;
      return updated;
    });
    if (settings.logo_url) {
      setLogoPreview(settings.logo_url);
    }
  }, [settings, products]);

  // Define the 8 exact slots
  const photoSlots: PhotoSlot[] = [
    {
      id: 'photo-1',
      slotNumber: 1,
      label: 'Photo 1: Storefront & Plant Facility',
      description: 'Used for homepage centerpiece, about page, and contact plant backdrop.',
      defaultPath: settings.hero_bg_image || '/crystal_ice_storefront.jpg',
      targetKey: 'storefront',
      currentPreview: slotPreviews['storefront'] || settings.hero_bg_image || '/crystal_ice_storefront.jpg'
    },
    {
      id: 'photo-2',
      slotNumber: 2,
      label: 'Photo 2: Cold Room Storage & 2.5kg Ice',
      description: 'Used on Homepage for Meat Blast Freezing, and Products Page for 2.5kg Ice Cubes.',
      defaultPath: '/cold_room_storage_1790856812685.jpg',
      targetKey: 'ice-cubes-2-5kg',
      currentPreview: slotPreviews['ice-cubes-2-5kg'] || '/cold_room_storage_1790856812685.jpg'
    },
    {
      id: 'photo-3',
      slotNumber: 3,
      label: 'Photo 3: Ice Cubes Promo Flyer',
      description: 'Used on Homepage for Ice Cubes (2.5 & 5kg) and marketing poster.',
      defaultPath: '/ice_cubes_promo_1790856824108.jpg',
      targetKey: 'ice-promo',
      currentPreview: slotPreviews['ice-promo'] || '/ice_cubes_promo_1790856824108.jpg'
    },
    {
      id: 'photo-4',
      slotNumber: 4,
      label: 'Photo 4: Hanging Block Freezing Facility',
      description: 'Used on Homepage for Solid Ice Blocks 10kg and block freezing showcase.',
      defaultPath: '/ice_blocks_freezing_1790856836725.jpg',
      targetKey: 'ice-blocks-freezing',
      currentPreview: slotPreviews['ice-blocks-freezing'] || '/ice_blocks_freezing_1790856836725.jpg'
    },
    {
      id: 'photo-5',
      slotNumber: 5,
      label: 'Photo 5: Chicken Blast Freezing',
      description: 'Used for Chickens Blast Freezing service ($0.25/bird) in products and flyer.',
      defaultPath: '/chicken_blast_freeze_1790856846432.jpg',
      targetKey: 'chicken-blast',
      currentPreview: slotPreviews['chicken-blast'] || '/chicken_blast_freeze_1790856846432.jpg'
    },
    {
      id: 'photo-6',
      slotNumber: 6,
      label: 'Photo 6: Beef, Pork & Other Meat Freezing',
      description: 'Used for Beef/Pork Blast Freezing service ($0.20/kg) in products and flyer.',
      defaultPath: '/beef_blast_freeze_1790856859754.jpg',
      targetKey: 'beef-blast',
      currentPreview: slotPreviews['beef-blast'] || '/beef_blast_freeze_1790856859754.jpg'
    },
    {
      id: 'photo-7',
      slotNumber: 7,
      label: 'Photo 7: 5kg Commercial Packaged Ice Bags',
      description: 'Used for 5kg Commercial Ice Bags on Products and Services page.',
      defaultPath: '/packaged_ice_5kg_1790856872454.jpg',
      targetKey: 'ice-bags-5kg',
      currentPreview: slotPreviews['ice-bags-5kg'] || '/packaged_ice_5kg_1790856872454.jpg'
    },
    {
      id: 'photo-8',
      slotNumber: 8,
      label: 'Photo 8: 10kg Solid Ice Blocks Storage',
      description: 'Used for 10kg Solid Ice Blocks on Products and Services page.',
      defaultPath: '/ice_blocks_storage_1790856885832.jpg',
      targetKey: 'ice-blocks-10kg',
      currentPreview: slotPreviews['ice-blocks-10kg'] || '/ice_blocks_storage_1790856885832.jpg'
    }
  ];

  const handleFileUpload = async (file: File, target: string) => {
    setUploadingId(target);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target', target);

      const token = localStorage.getItem('arcticpure_admin_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errJson.error || 'Upload failed on server.');
      }

      const data = await res.json();
      const newUrl = data.url;
      const kb = data.size_kb || data.sizeKb || Math.round(file.size / 1024);

      // Immediately update local preview state so there are zero false positives
      setSlotPreviews(prev => ({ ...prev, [target]: newUrl }));
      if (target === 'logo') {
        setLogoPreview(newUrl);
      }

      // Save to slot overrides in localStorage so it persists instantly
      try {
        const overrides = JSON.parse(localStorage.getItem('crystal_ice_slot_overrides') || '{}');
        overrides[target] = newUrl;
        if (target === 'logo') overrides['site_logo'] = newUrl;
        if (target === 'storefront') {
          overrides['storefront_main'] = newUrl;
          overrides['hero_backdrop'] = newUrl;
        }
        if (target === 'ice-cubes-2-5kg') overrides['product-prod-1'] = newUrl;
        if (target === 'ice-bags-5kg') overrides['product-prod-2'] = newUrl;
        if (target === 'ice-blocks-10kg') overrides['product-prod-3'] = newUrl;
        if (target === 'chicken-blast') overrides['product-prod-4'] = newUrl;
        if (target === 'beef-blast') overrides['product-prod-5'] = newUrl;
        localStorage.setItem('crystal_ice_slot_overrides', JSON.stringify(overrides));
      } catch {}

      // Fire universal event for live site sync
      window.dispatchEvent(new CustomEvent('crystal-image-slot-updated', {
        detail: { slotId: target, newUrl }
      }));

      setSuccessMessage(`Successfully uploaded "${file.name}" (${kb} KB)! Website image updated live.`);

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading image.');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-black uppercase tracking-wider mb-2">
          <Upload className="w-3.5 h-3.5 text-cyan-600" />
          <span>Direct Raw Asset Uploader</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
          Authentic Photos & Brand Logo Uploader
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Upload your original camera photos and exact logo files directly from your computer or phone. Files are written in full resolution with <strong>zero AI alteration</strong> or compression.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 1: EXACT BRAND LOGO */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0265B5]" />
              <span>Official Crystal Ice Logo</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your exact logo file (.png with transparent background, .svg, or .jpg). Replaces the logo across header, footer, and flyers.
            </p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#0265B5] hover:bg-[#004e8c] text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0">
            <Upload className="w-4 h-4" />
            <span>{uploadingId === 'logo' ? 'Uploading...' : 'Choose Logo File'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0], 'logo');
                }
              }}
            />
          </label>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <div className="w-32 h-20 rounded-2xl bg-slate-900 p-3 flex items-center justify-center border border-slate-800 shadow-inner">
            <img
              src={logoPreview}
              alt="Logo Dark Preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="w-32 h-20 rounded-2xl bg-white p-3 flex items-center justify-center border border-slate-200 shadow-inner">
            <img
              src={logoPreview}
              alt="Logo Light Preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-700 block">Current Logo Source:</span>
            <code className="text-[11px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 inline-block mt-1">
              {logoPreview}
            </code>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: THE 8 EXACT USER PHOTO SLOTS */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
            The 8 Original High-Resolution Photo Slots
          </h3>
          <p className="text-xs text-slate-500">
            Each slot directly replaces the corresponding photo across homepage cards, product details, services, and flyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photoSlots.map((slot) => {
            const isUploadingThis = uploadingId === slot.targetKey;

            return (
              <div
                key={slot.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-100 mb-3.5">
                    <img
                      src={slot.currentPreview}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Slot #{slot.slotNumber}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">
                    {slot.label}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {slot.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                    {slot.defaultPath}
                  </span>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-xs font-bold transition-all shadow-xs active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingThis ? 'Saving...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], slot.targetKey);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
