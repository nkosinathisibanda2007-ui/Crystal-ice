import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Filter
} from 'lucide-react';
import { MediaItem } from '../../../types/index.ts';
import { api } from '../../../services/api.ts';

interface MediaLibraryTabProps {
  onOpenLiveSlotManager?: () => void;
}

export const MediaLibraryTab: React.FC<MediaLibraryTabProps> = ({ onOpenLiveSlotManager }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await api.getAdminMedia();
      setMedia(items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (files.length === 1) {
        const res = await api.uploadExactImage(files[0], selectedCategory === 'all' ? 'products' : selectedCategory);
        setSuccess(`Uploaded "${res.originalName}" (${res.sizeKb} KB) losslessly!`);
      } else {
        const fileList = Array.from(files) as File[];
        const res = await api.uploadMultipleExactImages(fileList);
        setSuccess(`Uploaded ${res.count} images byte-for-byte untouched!`);
      }
      await fetchMedia();
    } catch (err: any) {
      setError(err.message || 'Failed to upload image(s)');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await api.deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      setSuccess(`Removed "${name}" from media library.`);
      setConfirmDeleteId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete media asset');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = selectedCategory === 'all'
    ? media
    : media.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-[#0265B5]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Exact Media & Asset Library
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store and manage 100% untouched original photos for ice cubes, blocks, blast freezing facilities, and branding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="admin-media-file-picker"
          />

          {onOpenLiveSlotManager && (
            <button
              type="button"
              onClick={onOpenLiveSlotManager}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Replace or remove any picture live on the site"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Live Site Image Replacer</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0265B5] hover:bg-[#005599] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading Losslessly...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload Exact Files</span>
              </>
            )}
          </button>

          <button
            onClick={fetchMedia}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            ORIGINAL PRESERVED
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and stats row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Filter Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-[#0265B5]"
          >
            <option value="all">All Categories ({media.length})</option>
            <option value="products">Products</option>
            <option value="facilities">Facilities & Plant</option>
            <option value="delivery">Delivery Fleet</option>
            <option value="events">Events & Catering</option>
            <option value="branding">Branding</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Binary Stream Storage • 0% Transcoding Loss</span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0265B5]" />
          Loading media library...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#0265B5] mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">No media assets in this category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Upload Exact Files" above to upload uncompressed, full-fidelity pictures for your website.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              {/* Image Preview with Aspect-Ratio Containment */}
              <div className="h-44 bg-slate-900/90 relative flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 backdrop-blur-xs text-emerald-300 px-2 py-0.5 rounded font-bold">
                  {item.size_kb} KB
                </span>
                <span className="absolute top-2 right-2 text-[10px] font-semibold bg-[#0265B5]/90 text-white px-2 py-0.5 rounded capitalize">
                  {item.category}
                </span>
              </div>

              {/* Details & Actions */}
              <div className="p-3 text-xs">
                <div className="font-bold text-slate-800 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Uploaded: {item.uploaded_at}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0265B5] hover:text-[#005599] transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                      title="View original in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
