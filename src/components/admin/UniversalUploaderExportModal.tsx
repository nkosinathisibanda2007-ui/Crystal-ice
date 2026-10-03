import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Code2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface UniversalUploaderExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalUploaderExportModal: React.FC<UniversalUploaderExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'react' | 'vanilla' | 'backend'>('react');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const publicScriptUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/exact-image-uploader.js`
    : 'https://ais-dev-pkimycadyw7smxbqaxvn2g-664713151287.europe-west2.run.app/exact-image-uploader.js';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (filename: string, content: string, type: string = 'text/javascript') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="universal-export-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="universal-export-dialog"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit']">
                  Universal Exact Image Uploader Export
                </h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                  Step 2 Optimization
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Use this exact lossless image uploader in any future web, mobile, or cloud application.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* CDN Link Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="overflow-hidden">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                Direct Script Link (Use anywhere via &lt;script&gt;)
              </span>
              <code className="text-xs font-mono text-indigo-700 bg-white px-2 py-1 rounded border border-indigo-200 block truncate mt-1 select-all">
                {publicScriptUrl}
              </code>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => copyToClipboard(publicScriptUrl, 'cdn-url')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0265B5] hover:bg-[#005599] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                {copiedKey === 'cdn-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cdn-url' ? 'Copied Link!' : 'Copy Script Link'}</span>
              </button>

              <a
                href="/exact-image-uploader.js"
                download="exact-image-uploader.js"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .js</span>
              </a>
            </div>
          </div>

          {/* Integration Code Tabs */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                  Drop-in Code Recipes for Any Application
                </h3>
              </div>

              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('react')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    activeTab === 'react' ? 'bg-white text-[#0265B5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  React / Next.js
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('vanilla')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    activeTab === 'vanilla' ? 'bg-white text-[#0265B5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  HTML / Vanilla JS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('backend')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    activeTab === 'backend' ? 'bg-white text-[#0265B5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Node.js / Express Server
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-slate-950 p-4 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  let code = '';
                  if (activeTab === 'react') {
                    code = `// React / Next.js Hook & Component
import React, { useState } from 'react';

export function useExactImageUpload(uploadEndpoint = '/api/upload') {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadExact = async (file, options = {}) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options.slotId) formData.append('slotId', options.slotId);

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData // Sends raw binary stream untouched
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadExact, uploading, error };
}`;
                  } else if (activeTab === 'vanilla') {
                    code = `<!-- 1. Include script link -->
<script src="${publicScriptUrl}"></script>

<!-- 2. Call anywhere in JavaScript -->
<input type="file" id="photoInput" accept="image/*" />

<script>
  document.getElementById('photoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await ExactUploader.upload(file, {
        endpoint: '/api/upload',
        onProgress: (percent) => console.log('Upload Progress:', percent + '%')
      });
      console.log('Original picture uploaded losslessly:', result.url);
      alert('Uploaded: ' + result.url);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
</script>`;
                  } else {
                    code = `// Node.js + Express Multer Exact Binary Handler
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Store raw binary stream untouched on disk (or S3/cloud)
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    success: true,
    url: '/uploads/' + req.file.filename,
    fileName: req.file.filename,
    sizeBytes: req.file.size,
    lossless: true
  });
});`;
                  }
                  copyToClipboard(code, activeTab);
                }}
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-sans transition-colors border border-slate-700"
              >
                {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === activeTab ? 'Copied Recipe!' : 'Copy Code'}</span>
              </button>

              {activeTab === 'react' && (
                <pre className="text-slate-300 leading-relaxed">
{`// React / Next.js Hook & Component
import React, { useState } from 'react';

export function useExactImageUpload(uploadEndpoint = '/api/upload') {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadExact = async (file, options = {}) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options.slotId) formData.append('slotId', options.slotId);

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData // Sends raw binary stream untouched
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadExact, uploading, error };
}`}
                </pre>
              )}

              {activeTab === 'vanilla' && (
                <pre className="text-slate-300 leading-relaxed">
{`<!-- 1. Include script link in any HTML page -->
<script src="${publicScriptUrl}"></script>

<!-- 2. Call anywhere in JavaScript -->
<input type="file" id="photoInput" accept="image/*" />

<script>
  document.getElementById('photoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await ExactUploader.upload(file, {
        endpoint: '/api/upload',
        onProgress: (pct) => console.log('Progress:', pct + '%')
      });
      console.log('Original picture saved:', result.url);
      alert('Uploaded exact picture: ' + result.url);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
</script>`}
                </pre>
              )}

              {activeTab === 'backend' && (
                <pre className="text-slate-300 leading-relaxed">
{`// Node.js + Express Multer Exact Binary Handler
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Store raw binary stream untouched on disk (or S3/cloud)
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    success: true,
    url: '/uploads/' + req.file.filename,
    fileName: req.file.filename,
    sizeBytes: req.file.size,
    lossless: true
  });
});`}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500">
            Exported from Crystal Ice Zimbabwe • Standalone MIT License
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
