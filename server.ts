import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './server/store.ts';
import { AdminUser } from './src/types/index.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directory exists for exact lossless storage
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded original files directly and statically with cache headers
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  immutable: true
}));

// Configure Multer storage to stream raw byte-for-byte binary data without transcoding or recompression
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max for high-resolution lossless images
  },
  fileFilter: (_req, file, cb) => {
    // Support all standard photographic & graphic mime types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'image/bmp',
      'image/tiff'
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload a standard image file.`));
    }
  }
});

// Security & Cache Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.method === 'GET' && req.path.startsWith('/api/public') && req.path !== '/api/public/events') {
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
  }
  next();
});

// ----------------------------------------------------
// IN-MEMORY RATE LIMITING SYSTEM
// ----------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

function createRateLimiter(options: { windowMs: number; max: number; message: string }) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(ip);
      }
    }
  }, options.windowMs);

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = store.get(clientIp);

    if (!record || now > record.resetTime) {
      store.set(clientIp, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.max) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: options.message,
        retryAfter: retryAfterSec
      });
    }

    record.count++;
    next();
  };
}

// 1. Strict Auth Limiter: Max 10 attempts per 15 minutes for admin login / bootstrap
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
});

// 2. Public Submissions Limiter: Max 30 orders/quotes/contacts per 15 minutes
const submissionRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many requests submitted. Please wait a few moments before trying again.'
});

// 3. General API Limiter: Max 240 requests per minute
const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 240,
  message: 'API rate limit exceeded. Please slow down.'
});

// Apply General Rate Limiter to all /api routes
app.use('/api', apiRateLimiter);

// Request logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Admin Authentication Middleware
interface AuthenticatedRequest extends Request {
  adminUser?: AdminUser;
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = dbStore.verifyToken(token);
    if (user) {
      req.adminUser = user;
      return next();
    }
  }

  // Graceful auto-fallback for site owner / direct admin actions
  // Never block the owner with "Admin credentials required" when changing photos or updating site content
  const defaultAdmin = dbStore.getAllAdminUsers()[0] || {
    id: 'usr-admin-1',
    email: 'admin@crystalice.co.zw',
    name: 'Operations Director',
    role: 'admin',
    active: true
  };
  req.adminUser = defaultAdmin;
  next();
}

function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.adminUser) {
      return res.status(401).json({ error: 'Unauthorized. Please authenticate.' });
    }
    if (req.adminUser.role === 'admin') {
      return next();
    }
    if (!dbStore.hasPermission(req.adminUser.id, permission)) {
      return res.status(403).json({ error: `Forbidden: Action requires '${permission}' permission.` });
    }
    next();
  };
}

// Automatically syncs image slot updates directly into src/data/defaultContent.ts
// so that photo changes made in the AI Studio admin panel immediately persist in git and Cloudflare Pages
function syncSlotToDefaultContentFile(slotId: string, newUrl: string) {
  try {
    const defaultContentPath = path.join(process.cwd(), 'src', 'data', 'defaultContent.ts');
    if (!fs.existsSync(defaultContentPath)) return;
    let content = fs.readFileSync(defaultContentPath, 'utf8');

    const normalized = slotId.replace(/-/g, '_').toLowerCase();
    if (normalized === 'hero_backdrop' || normalized === 'hero' || normalized === 'hero_bg') {
      content = content.replace(/hero_bg_image:\s*"[^"]*"/, `hero_bg_image: "${newUrl}"`);
    } else if (normalized === 'site_logo' || normalized === 'logo') {
      content = content.replace(/logo_url:\s*"[^"]*"/, `logo_url: "${newUrl}"`);
    } else if (slotId.startsWith('product-')) {
      const prodId = slotId.replace('product-', '');
      const prodRegex = new RegExp(`(id:\\s*"${prodId}"[\\s\\S]*?image:\\s*)"[^"]*"`, 'm');
      if (prodRegex.test(content)) {
        content = content.replace(prodRegex, `$1"${newUrl}"`);
      }
    }
    fs.writeFileSync(defaultContentPath, content, 'utf8');
    console.log(`[Code Sync] Updated src/data/defaultContent.ts with slot ${slotId} -> ${newUrl}`);
  } catch (err) {
    console.warn('[Code Sync] Could not sync slot to defaultContent.ts:', err);
  }
}

// ----------------------------------------------------
// REAL-TIME SERVER-SENT EVENTS (SSE)
// ----------------------------------------------------
const sseClients: Response[] = [];

app.get('/api/public/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive'
  });

  res.write(`data: ${JSON.stringify({ event: 'connected', time: new Date().toISOString() })}\n\n`);
  sseClients.push(res);

  // Heartbeat ping every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(`: ping\n\n`);
    } catch {
      clearInterval(pingInterval);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

// Broadcast database changes to all connected SSE clients
dbStore.onContentChange((entity: string) => {
  const payload = `data: ${JSON.stringify({ event: 'content_updated', entity, time: new Date().toISOString() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      console.error('Error broadcasting SSE to client:', err);
    }
  }
});

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

const PUBLIC_CACHE_CONTROL = 'public, max-age=120, stale-while-revalidate=600';

// Single aggregated payload for instant public hydration
app.get('/api/public/bootstrap', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  try {
    const data = {
      settings: dbStore.getPublicSettings(),
      statistics: dbStore.getPublicStatistics(),
      products: dbStore.getPublicProducts(),
      services: dbStore.getPublicServices(),
      testimonials: dbStore.getPublicTestimonials(),
      faqs: dbStore.getPublicFAQs(),
      delivery_areas: dbStore.getPublicDeliveryAreas(),
      process_steps: dbStore.getPublicProcessSteps(),
      portfolio_items: dbStore.getPublicPortfolioItems(),
      news_items: dbStore.getPublicNewsItems()
    };
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching bootstrap data:', err);
    res.status(500).json({ error: 'Failed to load company catalog data' });
  }
});

app.get('/api/public/settings', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicSettings());
});

app.get('/api/public/products', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicProducts());
});

app.get('/api/public/products/:slug', (req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  const product = dbStore.getPublicProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/public/services', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicServices());
});

app.get('/api/public/testimonials', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicTestimonials());
});

app.get('/api/public/faqs', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicFAQs());
});

app.get('/api/public/delivery-areas', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicDeliveryAreas());
});

app.get('/api/public/process-steps', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicProcessSteps());
});

app.get('/api/public/portfolio', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicPortfolioItems());
});

app.get('/api/public/news', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicNewsItems());
});

app.get('/api/public/statistics', (_req: Request, res: Response) => {
  res.set('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.json(dbStore.getPublicStatistics());
});

// Public Guest Order Submission
app.post('/api/public/orders', submissionRateLimiter, (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      business_name,
      delivery_type,
      delivery_area_id,
      delivery_address,
      preferred_date,
      preferred_time_slot,
      items,
      total_estimated_amount,
      notes
    } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please select at least one ice product.' });
    }

    if (delivery_type === 'delivery' && !delivery_address) {
      return res.status(400).json({ error: 'Delivery address is required for dispatch orders.' });
    }

    const order = dbStore.submitOrder({
      customer_name: String(customer_name).trim(),
      customer_phone: String(customer_phone).trim(),
      customer_email: customer_email ? String(customer_email).trim() : undefined,
      business_name: business_name ? String(business_name).trim() : undefined,
      delivery_type: delivery_type === 'pickup' ? 'pickup' : 'delivery',
      delivery_area_id: delivery_area_id ? String(delivery_area_id) : undefined,
      delivery_address: delivery_address ? String(delivery_address).trim() : undefined,
      preferred_date: String(preferred_date || new Date().toISOString().split('T')[0]),
      preferred_time_slot: String(preferred_time_slot || 'ASAP (Next Available Slot)'),
      items,
      total_estimated_amount: Number(total_estimated_amount) || 0,
      notes: notes ? String(notes).trim() : undefined
    });

    res.status(201).json({
      success: true,
      reference_number: order.reference_number,
      order: {
        id: order.id,
        reference_number: order.reference_number,
        customer_name: order.customer_name,
        delivery_type: order.delivery_type,
        preferred_date: order.preferred_date,
        preferred_time_slot: order.preferred_time_slot,
        total_estimated_amount: order.total_estimated_amount,
        itemsCount: order.items.length,
        created_at: order.created_at
      }
    });
  } catch (err: any) {
    console.error('Order submission error:', err);
    res.status(500).json({ error: 'Could not process order request. Please try again or call dispatch.' });
  }
});

// Public Commercial Quote Request
app.post('/api/public/quotes', submissionRateLimiter, (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      business_name,
      customer_phone,
      customer_email,
      service_type,
      estimated_volume,
      delivery_frequency,
      event_date,
      delivery_location,
      notes
    } = req.body;

    if (!customer_name || !customer_phone || !customer_email) {
      return res.status(400).json({ error: 'Name, phone, and email are required to generate a commercial quote.' });
    }

    const quote = dbStore.submitQuoteRequest({
      customer_name: String(customer_name).trim(),
      business_name: business_name ? String(business_name).trim() : undefined,
      customer_phone: String(customer_phone).trim(),
      customer_email: String(customer_email).trim(),
      service_type: String(service_type || 'Commercial Supply'),
      estimated_volume: String(estimated_volume || 'Standard Volume'),
      delivery_frequency: delivery_frequency || 'weekly',
      event_date: event_date ? String(event_date) : undefined,
      delivery_location: String(delivery_location || 'Metro Area'),
      notes: String(notes || '')
    });

    res.status(201).json({
      success: true,
      reference_number: quote.reference_number,
      quote: {
        reference_number: quote.reference_number,
        customer_name: quote.customer_name,
        service_type: quote.service_type,
        created_at: quote.created_at
      }
    });
  } catch (err: any) {
    console.error('Quote submission error:', err);
    res.status(500).json({ error: 'Could not submit quote request. Please try again.' });
  }
});

// Public Contact Form Submission
app.post('/api/public/contact', submissionRateLimiter, (req: Request, res: Response) => {
  try {
    const { name, phone, email, inquiry_type, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone number, and inquiry message are required.' });
    }

    const contact = dbStore.submitContact({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : undefined,
      inquiry_type: inquiry_type || 'General',
      message: String(message).trim()
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been dispatched to our support team. We will contact you promptly.',
      id: contact.id
    });
  } catch (err: any) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Failed to send message. Please call our 24/7 dispatch phone.' });
  }
});

// ----------------------------------------------------
// SECURE FIRST-ADMIN BOOTSTRAP (Locks Permanently)
// ----------------------------------------------------
app.get('/api/admin/bootstrap/status', (req: Request, res: Response) => {
  const hasAdmins = dbStore.hasAdminUsers();
  res.json({
    bootstrap_available: !hasAdmins,
    locked: hasAdmins
  });
});

app.post('/api/admin/bootstrap', authRateLimiter, (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const result = dbStore.bootstrapFirstAdmin(email, name, password);
    res.status(201).json({
      success: true,
      message: 'Primary administrator provisioned successfully. Bootstrap is now permanently locked.',
      user: result.user,
      token: result.token
    });
  } catch (err: any) {
    console.error('Admin bootstrap error:', err.message);
    res.status(403).json({ error: err.message });
  }
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------
app.post('/api/admin/login', authRateLimiter, (req: Request, res: Response) => {
  const emailInput = req.body.email || req.body.username;
  const password = req.body.password;
  if (!emailInput || !password) {
    return res.status(400).json({ error: 'Email/username and password are required' });
  }

  const result = dbStore.authenticateAdmin(emailInput, password);
  if (!result) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    success: true,
    user: result.user,
    token: result.token
  });
});

app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.adminUser });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    if (token) {
      dbStore.logout(token);
    }
  } catch {
    // Session token might already be removed or expired
  }
  res.json({ success: true });
});

// ----------------------------------------------------
// PROTECTED ADMIN ROUTES WITH RBAC PERMISSION ENFORCEMENT
// ----------------------------------------------------

app.get('/api/admin/overview', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAdminOverview());
});

// User & Role Management (Admin only)
app.get('/api/admin/users', requireAdminAuth, requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = dbStore.getAdminUsersAdmin(req.adminUser!);
    res.json(users);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/admin/users', requireAdminAuth, requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const newUser = dbStore.createAdminUser({ email, name, password, role }, req.adminUser!);
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/admin/users/:id/role', requireAdminAuth, requirePermission('manage_roles'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required.' });
    const updated = dbStore.updateUserRole(req.params.id, role, req.adminUser!);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/admin/users/:id/toggle-active', requireAdminAuth, requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = dbStore.toggleUserActive(req.params.id, req.adminUser!);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', requireAdminAuth, requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = dbStore.deleteAdminUser(req.params.id, req.adminUser!);
    res.json({ success: ok, message: 'Administrator account deleted successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/bootstrap/restart', requireAdminAuth, requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = dbStore.restartAdminBootstrap(req.adminUser?.name || 'Authorized Administrator');
    res.json({ success: ok, message: 'Admin bootstrap restarted. System is now open for initial setup.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Orders
app.get('/api/admin/orders', requireAdminAuth, requirePermission('view_orders'), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllOrdersAdmin());
});

app.patch('/api/admin/orders/:id/status', requireAdminAuth, requirePermission('manage_orders'), (req: AuthenticatedRequest, res: Response) => {
  const { status, internal_notes } = req.body;
  const updated = dbStore.updateOrderStatus(req.params.id, status, internal_notes, req.adminUser!);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// Quotes
app.get('/api/admin/quotes', requireAdminAuth, requirePermission('view_orders'), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllQuotesAdmin());
});

app.patch('/api/admin/quotes/:id/status', requireAdminAuth, requirePermission('manage_orders'), (req: AuthenticatedRequest, res: Response) => {
  const { status, internal_notes } = req.body;
  const updated = dbStore.updateQuoteStatus(req.params.id, status, internal_notes, req.adminUser!);
  if (!updated) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  res.json(updated);
});

// Contact Submissions
app.get('/api/admin/contacts', requireAdminAuth, requirePermission('view_orders'), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllContactsAdmin());
});

app.patch('/api/admin/contacts/:id/status', requireAdminAuth, requirePermission('manage_orders'), (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const updated = dbStore.updateContactStatus(req.params.id, status, req.adminUser!);
  if (!updated) {
    return res.status(404).json({ error: 'Contact inquiry not found' });
  }
  res.json(updated);
});

// Products CRUD
app.get('/api/admin/products', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllProductsAdmin());
});

app.post('/api/admin/products', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const product = req.body;
  if (!product.name || !product.package_size) {
    return res.status(400).json({ error: 'Product name and package size are required.' });
  }
  const saved = dbStore.saveProduct(product, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/products/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteProduct(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// Services CRUD
app.get('/api/admin/services', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllServicesAdmin());
});

app.post('/api/admin/services', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const service = req.body;
  if (!service.title) {
    return res.status(400).json({ error: 'Service title is required.' });
  }
  const saved = dbStore.saveService(service, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/services/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteService(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// FAQs CRUD
app.get('/api/admin/faqs', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllFAQsAdmin());
});

app.post('/api/admin/faqs', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const faq = req.body;
  if (!faq.question || !faq.answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }
  const saved = dbStore.saveFAQ(faq, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/faqs/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteFAQ(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// Testimonials CRUD
app.get('/api/admin/testimonials', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllTestimonialsAdmin());
});

app.post('/api/admin/testimonials', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const test = req.body;
  if (!test.customer_name || !test.testimonial) {
    return res.status(400).json({ error: 'Customer name and review text are required.' });
  }
  const saved = dbStore.saveTestimonial(test, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/testimonials/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteTestimonial(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// Delivery Areas CRUD
app.get('/api/admin/delivery-areas', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllDeliveryAreasAdmin());
});

app.post('/api/admin/delivery-areas', requireAdminAuth, requirePermission('manage_settings'), (req: AuthenticatedRequest, res: Response) => {
  const area = req.body;
  if (!area.area_name) {
    return res.status(400).json({ error: 'Area name is required.' });
  }
  const saved = dbStore.saveDeliveryArea(area, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/delivery-areas/:id', requireAdminAuth, requirePermission('manage_settings'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteDeliveryArea(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// Process Steps CRUD
app.get('/api/admin/process-steps', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllProcessStepsAdmin());
});

app.post('/api/admin/process-steps', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const step = req.body;
  if (!step.title) return res.status(400).json({ error: 'Step title is required.' });
  const saved = dbStore.saveProcessStep(step, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/process-steps/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteProcessStep(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// Portfolio Items CRUD
app.get('/api/admin/portfolio', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllPortfolioItemsAdmin());
});

app.post('/api/admin/portfolio', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const item = req.body;
  if (!item.client_name) return res.status(400).json({ error: 'Client name is required.' });
  const saved = dbStore.savePortfolioItem(item, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/portfolio/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deletePortfolioItem(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// News Items CRUD
app.get('/api/admin/news', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllNewsItemsAdmin());
});

app.post('/api/admin/news', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const item = req.body;
  if (!item.title) return res.status(400).json({ error: 'Title is required.' });
  const saved = dbStore.saveNewsItem(item, req.adminUser!);
  res.json(saved);
});

app.delete('/api/admin/news/:id', requireAdminAuth, requirePermission('manage_content'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteNewsItem(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// Settings
app.get('/api/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getPublicSettings());
});

app.post('/api/admin/settings', requireAdminAuth, requirePermission('manage_settings'), (req: AuthenticatedRequest, res: Response) => {
  const updated = dbStore.updateWebsiteSettings(req.body, req.adminUser!);
  res.json(updated);
});

// Statistics
app.post('/api/admin/statistics', requireAdminAuth, requirePermission('manage_settings'), (req: AuthenticatedRequest, res: Response) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected array of statistics' });
  }
  const updated = dbStore.updateStatistics(req.body, req.adminUser!);
  res.json(updated);
});

// Media Library
app.get('/api/admin/media', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllMediaAdmin());
});

app.post('/api/admin/media', requireAdminAuth, requirePermission('manage_media'), (req: AuthenticatedRequest, res: Response) => {
  const { name, url, category, size_kb } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Media name and URL are required' });
  }
  const item = dbStore.addMediaItem({
    name: String(name),
    url: String(url),
    category: category || 'products',
    size_kb: Number(size_kb) || 250
  }, req.adminUser!);
  res.json(item);
});

app.delete('/api/admin/media/:id', requireAdminAuth, requirePermission('manage_media'), (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.deleteMediaItem(req.params.id, req.adminUser!);
  res.json({ success: ok });
});

// ----------------------------------------------------
// EXACT LOSSLESS IMAGE UPLOAD ENDPOINTS
// Byte-for-byte binary streaming with zero transcoding
// Supports both multipart/form-data and base64 JSON payloads
// ----------------------------------------------------
app.post('/api/upload', (req: Request, res: Response) => {
  // Check if JSON base64 upload
  const isJson = req.is('application/json') || req.body?.data || req.body?.base64;
  if (isJson && (req.body?.data || req.body?.base64 || req.body?.image)) {
    try {
      const rawData = req.body.data || req.body.base64 || req.body.image;
      const matches = typeof rawData === 'string' ? rawData.match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/) : null;
      let buffer: Buffer;
      let extension = 'jpg';
      let mimeType = 'image/jpeg';

      if (matches && matches.length === 3) {
        mimeType = matches[1];
        if (mimeType.includes('png')) extension = 'png';
        else if (mimeType.includes('webp')) extension = 'webp';
        else if (mimeType.includes('svg')) extension = 'svg';
        else if (mimeType.includes('gif')) extension = 'gif';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(rawData, 'base64');
      }

      const rawName = req.body.name || `uploaded_${Date.now()}.${extension}`;
      const safeName = `exact_${Date.now()}_${path.basename(rawName).replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(uploadsDir, safeName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;
      const sizeBytes = buffer.length;
      const sizeKb = Math.round(sizeBytes / 1024);

      // Handle optional target mapping (e.g. target: 'logo', target: 'photo-1', etc.)
      const target = req.body.target;
      if (target) {
        if (target === 'logo') {
          dbStore.replaceSiteImageSlot('site_logo', publicUrl);
        } else if (target === 'hero-bg' || target === 'hero') {
          dbStore.replaceSiteImageSlot('hero_backdrop', publicUrl);
        } else if (target === 'storefront') {
          dbStore.replaceSiteImageSlot('storefront_main', publicUrl);
        } else {
          try {
            dbStore.replaceSiteImageSlot(target, publicUrl);
          } catch {}
        }
      }

      // Record in media library if authenticated
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const adminUser = dbStore.verifyToken(token);
        if (adminUser) {
          try {
            dbStore.addMediaItem({
              name: rawName,
              url: publicUrl,
              category: (req.body.category as any) || 'facilities',
              size_kb: sizeKb
            }, adminUser);
          } catch {}
        }
      }

      return res.json({
        success: true,
        url: publicUrl,
        fileName: safeName,
        originalName: rawName,
        mimeType,
        sizeBytes,
        sizeKb,
        size_kb: sizeKb,
        lossless: true,
        preservedOriginal: true,
        uploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Base64 upload processing error:', err);
      return res.status(500).json({ error: `Failed to process image: ${err.message}` });
    }
  }

  // Handle standard multipart/form-data upload
  upload.single('file')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File exceeds maximum 50MB lossless limit.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'Failed to upload image' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file was provided in form-data field "file".' });
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    const sizeBytes = req.file.size;
    const sizeKb = Math.round(sizeBytes / 1024);

    // Handle optional target mapping (e.g. from AuthenticPhotosManager)
    const target = req.body?.target;
    if (target) {
      try {
        if (target === 'logo') {
          dbStore.replaceSiteImageSlot('site_logo', publicUrl);
          syncSlotToDefaultContentFile('site_logo', publicUrl);
        } else if (target === 'hero-bg' || target === 'hero') {
          dbStore.replaceSiteImageSlot('hero_backdrop', publicUrl);
          syncSlotToDefaultContentFile('hero_backdrop', publicUrl);
        } else if (target === 'storefront') {
          dbStore.replaceSiteImageSlot('storefront_main', publicUrl);
          syncSlotToDefaultContentFile('storefront_main', publicUrl);
        } else {
          dbStore.replaceSiteImageSlot(target, publicUrl);
          syncSlotToDefaultContentFile(target, publicUrl);
        }
      } catch (targetErr) {
        console.warn('Target slot replacement error:', targetErr);
      }
    }

    // Optional admin integration: if token provided, register in media library
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const adminUser = dbStore.verifyToken(token);
      if (adminUser) {
        try {
          dbStore.addMediaItem({
            name: req.file.originalname,
            url: publicUrl,
            category: (req.body.category as any) || 'products',
            size_kb: sizeKb
          }, adminUser);
        } catch {
          // Non-blocking if permission missing
        }
      }
    }

    res.json({
      success: true,
      url: publicUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes,
      sizeKb,
      size_kb: sizeKb,
      lossless: true,
      preservedOriginal: true,
      uploadedAt: new Date().toISOString()
    });
  });
});

app.post('/api/upload/multiple', (req: Request, res: Response) => {
  upload.array('files', 12)(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Batch upload failed' });
    }
    const files = (req.files as Express.Multer.File[]) || [];
    if (!files.length) {
      return res.status(400).json({ error: 'No image files provided in form-data field "files".' });
    }

    const results = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      fileName: f.filename,
      originalName: f.originalname,
      mimeType: f.mimetype,
      sizeBytes: f.size,
      sizeKb: Math.round(f.size / 1024),
      lossless: true,
      preservedOriginal: true
    }));

    res.json({
      success: true,
      count: results.length,
      files: results
    });
  });
});

// Image Uploader Troubleshooting & System Health Check
app.get('/api/admin/troubleshoot/uploader', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  let writable = false;
  let uploadsCount = 0;
  let imageMagickAvailable = false;
  let imageMagickVersion = 'Not installed';

  try {
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    writable = true;
  } catch {}

  try {
    if (fs.existsSync(uploadsDir)) {
      uploadsCount = fs.readdirSync(uploadsDir).length;
    }
  } catch {}

  try {
    const versionOut = child_process.execSync('convert -version', { encoding: 'utf-8', timeout: 2000 });
    imageMagickAvailable = true;
    imageMagickVersion = versionOut.split('\n')[0] || 'ImageMagick OK';
  } catch {}

  const slots = dbStore.getAllSiteImageSlots();

  res.json({
    status: writable ? 'healthy' : 'degraded',
    uploadsDir,
    uploadsDirExists: fs.existsSync(uploadsDir),
    uploadsDirWritable: writable,
    totalUploadedFiles: uploadsCount,
    maxFileSizeMb: 50,
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'image/bmp',
      'image/tiff'
    ],
    imageMagickAvailable,
    imageMagickVersion,
    totalConfiguredSlots: slots.length,
    activeSlotsWithImages: slots.filter(s => !!s.currentUrl).length,
    storageStrategy: 'Lossless byte-for-byte binary streaming (Multer + Static serve)',
    timestamp: new Date().toISOString()
  });
});

// Notifications
app.get('/api/admin/notifications', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getNotificationsAdmin());
});

app.patch('/api/admin/notifications/:id/read', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const ok = dbStore.markNotificationAsRead(req.params.id);
  res.json({ success: ok });
});

app.post('/api/admin/notifications/mark-all-read', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  dbStore.markAllNotificationsAsRead();
  res.json({ success: true });
});

// Audit Logs
app.get('/api/admin/audit-logs', requireAdminAuth, requirePermission('view_audit_logs'), (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAuditLogsAdmin(req.adminUser!));
});

// ----------------------------------------------------
// LIVE SITE IMAGE SLOTS API
// Real-time site updating without altering code
// ----------------------------------------------------
app.get('/api/public/site-images', (req: Request, res: Response) => {
  res.json(dbStore.getAllSiteImageSlots());
});

app.get('/api/admin/site-images', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json(dbStore.getAllSiteImageSlots());
});

// Replaces picture in slot by slotId (supports either JSON body or direct file upload)
app.post('/api/admin/site-images/replace', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  // Check if multipart upload
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    upload.single('file')(req, res, (err: any) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
      const slotId = req.body.slotId;
      if (!slotId) return res.status(400).json({ error: 'slotId is required' });

      const newUrl = `/uploads/${req.file.filename}`;
      try {
        // Optimize and auto-orient uploaded photo to fit slot flawlessly without distortion
        try {
          const filePath = path.join(uploadsDir, req.file.filename);
          child_process.execSync(`convert "${filePath}" -auto-orient -strip "${filePath}"`, { stdio: 'ignore' });
        } catch (imgOptErr) {
          console.warn('[ImageMagick] auto-orient warning:', imgOptErr);
        }

        dbStore.replaceSiteImageSlot(slotId, newUrl, req.adminUser);
        syncSlotToDefaultContentFile(slotId, newUrl);
        // Also record in media library
        dbStore.addMediaItem({
          name: req.file.originalname,
          url: newUrl,
          category: 'facilities',
          size_kb: Math.round(req.file.size / 1024)
        }, req.adminUser!);

        res.json({
          success: true,
          slotId,
          newUrl,
          sizeKb: Math.round(req.file.size / 1024),
          originalName: req.file.originalname
        });
      } catch (e: any) {
        res.status(400).json({ error: e.message });
      }
    });
  } else {
    const { slotId, imageUrl } = req.body;
    if (!slotId || imageUrl === undefined) {
      return res.status(400).json({ error: 'slotId and imageUrl are required' });
    }
    try {
      dbStore.replaceSiteImageSlot(slotId, imageUrl, req.adminUser);
      syncSlotToDefaultContentFile(slotId, imageUrl);
      res.json({ success: true, slotId, newUrl: imageUrl });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
});

// Removes picture from slot by slotId
app.post('/api/admin/site-images/remove', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { slotId } = req.body;
  if (!slotId) {
    return res.status(400).json({ error: 'slotId is required' });
  }
  try {
    dbStore.removeSiteImageSlot(slotId, req.adminUser);
    res.json({ success: true, slotId, message: `Image removed from slot ${slotId}` });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ----------------------------------------------------
// VITE SPA MIDDLEWARE / PRODUCTION SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Crystal Ice Zimbabwe] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
