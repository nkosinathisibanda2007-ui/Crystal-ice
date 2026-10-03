/**
 * Universal Exact Image Uploader (Standalone Browser Bundle)
 * Version 1.0.0 - Production Ready
 * 
 * Embed this in ANY application:
 * <script src="/exact-image-uploader.js"></script>
 * 
 * Usage:
 * ExactUploader.upload(file, { endpoint: '/api/upload' })
 *   .then(res => console.log('Exact image uploaded:', res.url))
 *   .catch(err => console.error(err));
 */
(function (global) {
  function ExactUploader(config) {
    this.endpoint = (config && config.endpoint) || '/api/upload';
  }

  ExactUploader.prototype.upload = function (file, options) {
    var opts = options || {};
    var endpoint = opts.endpoint || this.endpoint;
    var maxSizeBytes = opts.maxSizeBytes || 50 * 1024 * 1024; // 50MB

    if (!file) return Promise.reject(new Error('No file provided'));
    if (file.size > maxSizeBytes) {
      return Promise.reject(new Error('File exceeds limit of ' + (maxSizeBytes / (1024 * 1024)) + 'MB'));
    }

    var formData = new FormData();
    formData.append('file', file);
    if (opts.slotId) formData.append('slotId', opts.slotId);
    if (opts.category) formData.append('category', opts.category);

    var headers = opts.headers || {};
    var token = typeof localStorage !== 'undefined' ? localStorage.getItem('arcticpure_admin_token') : null;
    if (token && !headers['Authorization']) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }

      if (opts.onProgress && xhr.upload) {
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            var percent = Math.round((e.loaded / e.total) * 100);
            opts.onProgress(percent);
          }
        };
      }

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (err) {
            resolve({ success: true, url: xhr.responseText });
          }
        } else {
          try {
            var errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || ('Upload failed with status ' + xhr.status)));
          } catch (e) {
            reject(new Error('Upload failed with status ' + xhr.status));
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error('Network error during exact upload'));
      };

      xhr.send(formData);
    });
  };

  // Attach dropzone helper to an element
  ExactUploader.prototype.attachDropzone = function (domElement, onFileDropped) {
    if (!domElement) return;
    domElement.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      domElement.classList.add('exact-dragover');
    });
    domElement.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      domElement.classList.remove('exact-dragover');
    });
    domElement.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      domElement.classList.remove('exact-dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileDropped(e.dataTransfer.files[0]);
      }
    });
  };

  var defaultInstance = new ExactUploader();
  defaultInstance.ExactUploader = ExactUploader;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = defaultInstance;
  } else {
    global.ExactUploader = defaultInstance;
  }
})(typeof window !== 'undefined' ? window : this);
