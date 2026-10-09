const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');
const uploadsDir = path.join(publicDir, 'uploads');
const distUploadsDir = path.join(distDir, 'uploads');

if (!fs.existsSync(distDir)) {
  console.log('[Post-Build Cloudflare] dist/ does not exist, skipping.');
  process.exit(0);
}

// 1. Ensure dist/uploads has all files from public/uploads
fs.mkdirSync(distUploadsDir, { recursive: true });
if (fs.existsSync(uploadsDir)) {
  const uploadFiles = fs.readdirSync(uploadsDir);
  uploadFiles.forEach(file => {
    const src = path.join(uploadsDir, file);
    const dest = path.join(distUploadsDir, file);
    if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  });
  console.log(`[Post-Build Cloudflare] Synced ${uploadFiles.length} uploaded files to dist/uploads/`);
}

// 2. Ensure dist/api/public/bootstrap exists as static JSON
fs.mkdirSync(path.join(distDir, 'api', 'public'), { recursive: true });
const bootstrapSrc = path.join(publicDir, 'bootstrap.json');
if (fs.existsSync(bootstrapSrc)) {
  fs.copyFileSync(bootstrapSrc, path.join(distDir, 'bootstrap.json'));
  fs.copyFileSync(bootstrapSrc, path.join(distDir, 'api', 'public', 'bootstrap'));
}

const siteImagesSrc = path.join(publicDir, 'site-images.json');
if (fs.existsSync(siteImagesSrc)) {
  fs.copyFileSync(siteImagesSrc, path.join(distDir, 'site-images.json'));
  fs.copyFileSync(siteImagesSrc, path.join(distDir, 'api', 'public', 'site-images'));
}

// 3. Ensure _worker.js, _redirects and _headers are in dist
const workerSrc = path.join(publicDir, '_worker.js');
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, path.join(distDir, '_worker.js'));
}
const redirectsSrc = path.join(publicDir, '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(distDir, '_redirects'));
}
const headersSrc = path.join(publicDir, '_headers');
if (fs.existsSync(headersSrc)) {
  fs.copyFileSync(headersSrc, path.join(distDir, '_headers'));
}
const assetsIgnoreSrc = path.join(publicDir, '.assetsignore');
if (fs.existsSync(assetsIgnoreSrc)) {
  fs.copyFileSync(assetsIgnoreSrc, path.join(distDir, '.assetsignore'));
}

console.log('[Post-Build Cloudflare] Production distribution prepared for instant deployment to Cloudflare Pages.');
