/**
 * Universal Exact Image Uploader Client SDK
 * 
 * Standalone, zero-dependency module for uploading pictures into websites
 * exactly how they are (100% lossless, preserving full native resolution,
 * byte-for-byte binary integrity, ICC color profiles, and EXIF orientation).
 * 
 * Usable across React, Next.js, Vue, Svelte, or Vanilla JavaScript.
 */

export interface ExactUploadOptions {
  endpoint?: string;
  slotId?: string;
  category?: string;
  headers?: Record<string, string>;
  maxSizeBytes?: number; // Default 50MB
  onProgress?: (percent: number) => void;
}

export interface ExactUploadResult {
  success: boolean;
  url: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sizeKb: number;
  lossless: boolean;
  slotId?: string;
}

export class ExactImageUploader {
  private endpoint: string;

  constructor(endpoint: string = '/api/upload') {
    this.endpoint = endpoint;
  }

  /**
   * Upload an image file without client-side canvas re-compression or lossy downsampling.
   */
  public async upload(file: File, options?: ExactUploadOptions): Promise<ExactUploadResult> {
    const targetEndpoint = options?.endpoint || this.endpoint;
    const maxSizeBytes = options?.maxSizeBytes || 50 * 1024 * 1024; // 50MB

    if (file.size > maxSizeBytes) {
      throw new Error(`File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds maximum allowed ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB.`);
    }

    if (!file.type.startsWith('image/')) {
      throw new Error(`File "${file.name}" is not an image (MIME: ${file.type}).`);
    }

    const formData = new FormData();
    formData.append('file', file);

    if (options?.slotId) {
      formData.append('slotId', options.slotId);
    }
    if (options?.category) {
      formData.append('category', options.category);
    }

    const headers: Record<string, string> = {
      ...(options?.headers || {})
    };

    // If an auth token is in localStorage, pass it automatically
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('arcticpure_admin_token') : null;
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Using XMLHttpRequest when onProgress is requested, else fetch
    if (options?.onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', targetEndpoint);

        Object.entries(headers).forEach(([k, v]) => {
          xhr.setRequestHeader(k, v);
        });

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && options.onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            options.onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch {
              reject(new Error('Invalid response from upload server'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(formData);
      });
    }

    const res = await fetch(targetEndpoint, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || `Upload failed with status ${res.status}`);
    }

    return res.json();
  }

  /**
   * Helper to inspect native dimensions and aspect ratio from a File object
   */
  public static async inspectFile(file: File): Promise<{
    width: number;
    height: number;
    aspectRatio: string;
    objectUrl: string;
  }> {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const ratio = (w / h).toFixed(2);
        resolve({
          width: w,
          height: h,
          aspectRatio: `${ratio}:1`,
          objectUrl
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for inspection'));
      img.src = objectUrl;
    });
  }
}

// Default export instance
export const exactUploader = new ExactImageUploader();
