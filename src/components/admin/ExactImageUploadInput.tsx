import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { api } from '../../services/api.ts';

interface ExactImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: string;
  helperText?: string;
}

export const ExactImageUploadInput: React.FC<ExactImageUploadInputProps> = ({
  label,
  value,
  onChange,
  category = 'products',
  helperText = 'Uploads byte-for-byte original file without lossy recompression'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    originalName?: string;
    sizeKb?: number;
    mimeType?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const result = await api.uploadExactImage(file, category);
      onChange(result.url);
      setUploadStats({
        originalName: result.originalName,
        sizeKb: result.sizeKb,
        mimeType: result.mimeType
      });
    } catch (err: any) {
      setError(err.message || 'Failed to upload image exactly as it is.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
        <span className="text-[11px] text-cyan-700 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-600" />
          Lossless 100% Fidelity
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/... or https://..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0265B5] focus:border-[#0265B5] font-mono text-slate-800"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`exact-file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60"
          title="Upload exact original image file"
        >
          {isUploading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0265B5]" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5 text-[#0265B5]" />
              <span>Upload Exact</span>
            </>
          )}
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadStats && (
        <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Uploaded <strong>{uploadStats.originalName}</strong> ({uploadStats.sizeKb} KB) byte-for-byte uncompressed!
          </span>
        </div>
      )}

      {value && (
        <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
          <div className="w-14 h-14 rounded-md bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
            <img
              src={value}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="text-[11px] text-slate-600 overflow-hidden">
            <div className="font-medium text-slate-800 truncate">{value}</div>
            <div className="text-slate-400 mt-0.5">
              Rendered with <code className="text-[#0265B5]">object-contain</code> to preserve exact aspect ratio
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
