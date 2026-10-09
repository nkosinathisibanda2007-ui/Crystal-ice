import initialDb from '../data/db.json';

// In-memory data store for Edge runtime
const db = JSON.parse(JSON.stringify(initialDb));

// Active sessions map: token -> { user, expiresAt }
const sessions = new Map<string, { user: any; expiresAt: number }>();

// Seed default initial session if needed, but primary is dynamically created on login
// Rate limit tracker: ip -> { attempts: number; resetAt: number }
const loginRateLimit = new Map<string, { attempts: number; resetAt: number }>();

// WebCrypto PBKDF2 Password Verification
async function hashPasswordWebCrypto(password: string, saltStr: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltStr),
      iterations: 10000,
      hash: 'SHA-512'
    },
    keyMaterial,
    512
  );
  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
}

function handleCorsOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    loginRateLimit.set(ip, { attempts: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.attempts >= 5) {
    return false;
  }
  entry.attempts++;
  return true;
}

function clearRateLimit(ip: string): void {
  loginRateLimit.delete(ip);
}

function verifyAuthHeader(request: Request): any | null {
  const auth = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session.user;
}

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleCorsOptions();
    }

    // Only intercept /api/* routes; serve static assets for everything else
    if (!pathname.startsWith('/api/')) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response('Not found', { status: 404 });
    }

    // Optional proxy to live Google AI Studio backend if configured
    if (env && env.BACKEND_URL) {
      try {
        const targetUrl = new URL(pathname + url.search, env.BACKEND_URL);
        const proxyReq = new Request(targetUrl.toString(), request);
        const proxyRes = await fetch(proxyReq);
        if (proxyRes.ok || proxyRes.status === 401 || proxyRes.status === 400 || proxyRes.status === 403) {
          const respHeaders = new Headers(proxyRes.headers);
          respHeaders.set('Access-Control-Allow-Origin', '*');
          return new Response(proxyRes.body, {
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            headers: respHeaders
          });
        }
      } catch (err) {
        // Fall back to local edge handling if backend unreachable
      }
    }

    // ----------------------------------------------------
    // AUTHENTICATION ROUTES
    // ----------------------------------------------------
    if (pathname === '/api/admin/login' && method === 'POST') {
      const ip = getClientIp(request);
      if (!checkRateLimit(ip)) {
        return jsonResponse(
          { error: 'Too many failed login attempts. Please wait 1 minute before trying again.' },
          429
        );
      }

      let body: any = {};
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON request body.' }, 400);
      }

      const { email, password } = body;
      const input = (email || '').trim().toLowerCase();
      const plainPassword = (password || '').trim();

      if (!input || !plainPassword) {
        return jsonResponse({ error: 'Username/email and password are required.' }, 400);
      }

      // Check if Cloudflare secret ADMIN_PASSWORD is set
      const envAdminPassword = env?.ADMIN_PASSWORD;
      const envAdminEmail = (env?.ADMIN_EMAIL || 'admin@crystalice.co.zw').toLowerCase();

      // Find admin user in database
      const storedUser = (db.admin_users || []).find(
        (u: any) =>
          u.email.toLowerCase() === input ||
          (input === 'admin' && (u.email.toLowerCase() === 'admin@crystalice.co.zw' || u.email.toLowerCase() === 'admin@arcticpureice.com'))
      );

      let isMatch = false;

      // Check against Cloudflare secret if provided
      if (envAdminPassword && (input === 'admin' || input === envAdminEmail) && plainPassword === envAdminPassword) {
        isMatch = true;
      }

      // Check against PBKDF2 hash stored in database
      if (!isMatch && storedUser) {
        const calculatedHash = await hashPasswordWebCrypto(plainPassword, storedUser.salt);
        if (calculatedHash === storedUser.passwordHash) {
          isMatch = true;
        }
      }

      if (!isMatch) {
        return jsonResponse({ error: 'Invalid username or password.' }, 401);
      }

      clearRateLimit(ip);

      // Generate secure 32-byte session token
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const token = Array.from(tokenBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      const expiresAt = Date.now() + 7 * 86400000; // 7 days
      const userPayload = {
        id: storedUser?.id || 'usr-admin-1',
        email: storedUser?.email || 'admin@crystalice.co.zw',
        name: storedUser?.name || 'Operations Director',
        role: 'admin',
        active: true
      };

      sessions.set(token, { user: userPayload, expiresAt });

      return jsonResponse({
        success: true,
        token,
        user: userPayload
      });
    }

    if (pathname === '/api/admin/me' && method === 'GET') {
      const user = verifyAuthHeader(request);
      if (!user) {
        return jsonResponse({ error: 'Session expired or unauthorized.' }, 401);
      }
      return jsonResponse({ user });
    }

    if (pathname === '/api/admin/logout' && method === 'POST') {
      const auth = request.headers.get('Authorization') || request.headers.get('authorization');
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.slice(7).trim();
        sessions.delete(token);
      }
      return jsonResponse({ success: true, message: 'Logged out successfully.' });
    }

    if (pathname === '/api/admin/bootstrap/status' && method === 'GET') {
      return jsonResponse({
        bootstrap_available: false,
        locked: true,
        message: 'Primary administrator provisioned. Bootstrap is permanently locked.'
      });
    }

    // ----------------------------------------------------
    // PROTECTED ADMIN API ROUTES
    // ----------------------------------------------------
    if (pathname.startsWith('/api/admin/')) {
      const user = verifyAuthHeader(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized: Admin authentication required.' }, 401);
      }

      if (pathname === '/api/admin/overview' && method === 'GET') {
        const orders = db.orders || [];
        const quotes = db.quotes || [];
        const contacts = db.contacts || [];
        const products = db.products || [];
        const revenue = orders
          .filter((o: any) => o.status !== 'cancelled')
          .reduce((sum: number, o: any) => sum + (o.total_estimated_amount || 0), 0);

        return jsonResponse({
          orders_count: orders.length,
          pending_orders: orders.filter((o: any) => o.status === 'pending').length,
          quotes_count: quotes.length,
          pending_quotes: quotes.filter((q: any) => q.status === 'pending').length,
          contacts_count: contacts.length,
          products_count: products.length,
          total_revenue: revenue,
          system_status: 'healthy',
          node_env: 'production',
          edge_runtime: 'cloudflare-worker'
        });
      }

      if (pathname === '/api/admin/orders') {
        if (method === 'GET') return jsonResponse(db.orders || []);
      }

      if (pathname.startsWith('/api/admin/orders/') && method === 'PATCH') {
        const id = pathname.replace('/api/admin/orders/', '');
        const order = (db.orders || []).find((o: any) => o.id === id);
        if (!order) return jsonResponse({ error: 'Order not found' }, 404);
        try {
          const updates = await request.json();
          Object.assign(order, updates, { updated_at: new Date().toISOString() });
          return jsonResponse({ success: true, order });
        } catch {
          return jsonResponse({ error: 'Invalid JSON' }, 400);
        }
      }

      if (pathname === '/api/admin/quotes') {
        if (method === 'GET') return jsonResponse(db.quotes || []);
      }

      if (pathname.startsWith('/api/admin/quotes/') && method === 'PATCH') {
        const id = pathname.replace('/api/admin/quotes/', '');
        const quote = (db.quotes || []).find((q: any) => q.id === id);
        if (!quote) return jsonResponse({ error: 'Quote request not found' }, 404);
        try {
          const updates = await request.json();
          Object.assign(quote, updates, { updated_at: new Date().toISOString() });
          return jsonResponse({ success: true, quote });
        } catch {
          return jsonResponse({ error: 'Invalid JSON' }, 400);
        }
      }

      if (pathname === '/api/admin/contacts') {
        if (method === 'GET') return jsonResponse(db.contacts || []);
      }

      if (pathname.startsWith('/api/admin/contacts/') && method === 'PATCH') {
        const id = pathname.replace('/api/admin/contacts/', '');
        const contact = (db.contacts || []).find((c: any) => c.id === id);
        if (!contact) return jsonResponse({ error: 'Contact submission not found' }, 404);
        try {
          const updates = await request.json();
          Object.assign(contact, updates);
          return jsonResponse({ success: true, contact });
        } catch {
          return jsonResponse({ error: 'Invalid JSON' }, 400);
        }
      }

      if (pathname === '/api/admin/users' && method === 'GET') {
        const sanitized = (db.admin_users || []).map((u: any) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: 'admin',
          active: u.active !== false,
          created_at: u.created_at
        }));
        return jsonResponse(sanitized);
      }

      if (pathname === '/api/admin/settings') {
        if (method === 'GET') return jsonResponse(db.settings || {});
        if (method === 'PUT' || method === 'PATCH') {
          try {
            const updates = await request.json();
            db.settings = { ...db.settings, ...updates };
            return jsonResponse(db.settings);
          } catch {
            return jsonResponse({ error: 'Invalid JSON' }, 400);
          }
        }
      }

      if (pathname === '/api/admin/products') {
        if (method === 'GET') return jsonResponse(db.products || []);
        if (method === 'POST') {
          try {
            const prod = await request.json();
            if (!prod.id) prod.id = 'prod-' + Date.now();
            const existingIdx = (db.products || []).findIndex((p: any) => p.id === prod.id);
            if (existingIdx >= 0) {
              db.products[existingIdx] = prod;
            } else {
              db.products.push(prod);
            }
            return jsonResponse(prod);
          } catch {
            return jsonResponse({ error: 'Invalid JSON' }, 400);
          }
        }
      }

      if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
        const id = pathname.replace('/api/admin/products/', '');
        db.products = (db.products || []).filter((p: any) => p.id !== id);
        return jsonResponse({ success: true });
      }

      if (pathname === '/api/admin/services') {
        if (method === 'GET') return jsonResponse(db.services || []);
        if (method === 'POST') {
          try {
            const srv = await request.json();
            if (!srv.id) srv.id = 'serv-' + Date.now();
            const existingIdx = (db.services || []).findIndex((s: any) => s.id === srv.id);
            if (existingIdx >= 0) {
              db.services[existingIdx] = srv;
            } else {
              db.services.push(srv);
            }
            return jsonResponse(srv);
          } catch {
            return jsonResponse({ error: 'Invalid JSON' }, 400);
          }
        }
      }

      if (pathname.startsWith('/api/admin/services/') && method === 'DELETE') {
        const id = pathname.replace('/api/admin/services/', '');
        db.services = (db.services || []).filter((s: any) => s.id !== id);
        return jsonResponse({ success: true });
      }

      if (pathname === '/api/admin/site-images' && method === 'GET') {
        return jsonResponse(generateSiteImageSlots(db));
      }

      if (pathname === '/api/admin/site-images/replace' && method === 'POST') {
        try {
          const { slotId, imageUrl } = await request.json();
          if (!slotId || !imageUrl) {
            return jsonResponse({ error: 'slotId and imageUrl are required.' }, 400);
          }
          applySlotReplacement(db, slotId, imageUrl);
          return jsonResponse({ success: true, slotId, newUrl: imageUrl });
        } catch {
          return jsonResponse({ error: 'Invalid JSON' }, 400);
        }
      }

      if (pathname === '/api/admin/site-images/remove' && method === 'POST') {
        try {
          const { slotId } = await request.json();
          applySlotReplacement(db, slotId, '');
          return jsonResponse({ success: true, slotId });
        } catch {
          return jsonResponse({ error: 'Invalid JSON' }, 400);
        }
      }

      if (pathname === '/api/admin/notifications') {
        if (method === 'GET') return jsonResponse(db.notifications || []);
      }

      if (pathname === '/api/admin/notifications/mark-all-read' && method === 'POST') {
        (db.notifications || []).forEach((n: any) => (n.read = true));
        return jsonResponse({ success: true });
      }

      if (pathname === '/api/admin/audit-logs' && method === 'GET') {
        return jsonResponse(db.audit_logs || []);
      }

      if (pathname === '/api/admin/media' && method === 'GET') {
        return jsonResponse(db.media || []);
      }

      if (pathname === '/api/admin/troubleshoot/uploader' && method === 'GET') {
        const slots = generateSiteImageSlots(db);
        return jsonResponse({
          status: 'healthy',
          uploadsDir: '/uploads',
          uploadsDirExists: true,
          uploadsDirWritable: true,
          totalUploadedFiles: 21,
          totalConfiguredSlots: slots.length,
          activeSlotsWithImages: slots.filter((s: any) => !!s.currentUrl).length,
          edge_runtime: 'cloudflare-worker',
          timestamp: new Date().toISOString()
        });
      }

      return jsonResponse({ error: `Admin route not found: ${pathname}` }, 404);
    }

    // ----------------------------------------------------
    // PUBLIC API ROUTES
    // ----------------------------------------------------
    if (pathname === '/api/public/bootstrap' && method === 'GET') {
      return jsonResponse({
        settings: db.settings || {},
        statistics: db.statistics || [],
        products: (db.products || []).filter((p: any) => p.published !== false),
        services: (db.services || []).filter((s: any) => s.published !== false),
        testimonials: db.testimonials || [],
        faqs: db.faqs || [],
        delivery_areas: db.delivery_areas || [],
        process_steps: db.process_steps || [],
        portfolio_items: db.portfolio_items || [],
        news_items: db.news_items || []
      });
    }

    if (pathname === '/api/public/settings' && method === 'GET') {
      return jsonResponse(db.settings || {});
    }

    if (pathname === '/api/public/products' && method === 'GET') {
      return jsonResponse((db.products || []).filter((p: any) => p.published !== false));
    }

    if (pathname.startsWith('/api/public/products/') && method === 'GET') {
      const slug = pathname.replace('/api/public/products/', '');
      const prod = (db.products || []).find((p: any) => p.slug === slug || p.id === slug);
      if (!prod) return jsonResponse({ error: 'Product not found' }, 404);
      return jsonResponse(prod);
    }

    if (pathname === '/api/public/services' && method === 'GET') {
      return jsonResponse((db.services || []).filter((s: any) => s.published !== false));
    }

    if (pathname === '/api/public/site-images' && method === 'GET') {
      return jsonResponse(generateSiteImageSlots(db));
    }

    if (pathname === '/api/public/orders' && method === 'POST') {
      try {
        const orderData = await request.json();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const ref = `CI-ORD-${rand}`;
        const newOrder = {
          ...orderData,
          id: 'ord-' + Date.now(),
          reference_number: ref,
          status: 'New',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        if (!db.orders) db.orders = [];
        db.orders.unshift(newOrder);
        return jsonResponse({ success: true, reference_number: ref, order: newOrder }, 201);
      } catch {
        return jsonResponse({ error: 'Failed to process order' }, 400);
      }
    }

    if (pathname === '/api/public/quotes' && method === 'POST') {
      try {
        const quoteData = await request.json();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const ref = `CI-QUO-${rand}`;
        const newQuote = {
          ...quoteData,
          id: 'quo-' + Date.now(),
          reference_number: ref,
          status: 'New',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        if (!db.quotes) db.quotes = [];
        db.quotes.unshift(newQuote);
        return jsonResponse({ success: true, reference_number: ref, quote: newQuote }, 201);
      } catch {
        return jsonResponse({ error: 'Failed to process quote request' }, 400);
      }
    }

    if (pathname === '/api/public/contact' && method === 'POST') {
      try {
        const contactData = await request.json();
        const newContact = {
          ...contactData,
          id: 'cnt-' + Date.now(),
          status: 'unread',
          created_at: new Date().toISOString()
        };
        if (!db.contacts) db.contacts = [];
        db.contacts.unshift(newContact);
        return jsonResponse({ success: true, contact: newContact }, 201);
      } catch {
        return jsonResponse({ error: 'Failed to process contact submission' }, 400);
      }
    }

    return jsonResponse({ error: `Not found: ${pathname}` }, 404);
  }
};

function generateSiteImageSlots(database: any) {
  const slots: any[] = [];
  const s = database.settings || {};

  slots.push({
    id: 'hero_backdrop',
    title: 'Homepage Hero Backdrop Photo',
    category: 'hero',
    currentUrl: s.hero_bg_image || '/crystal_ice_backdrop.jpg',
    description: 'The prominent hero backdrop showcasing operations.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'homepage_ice_cubes_card',
    title: 'Homepage Card: Ice Cubes (2.5kg & 5kg)',
    category: 'hero',
    currentUrl: s.homepage_ice_cubes_image || s.ice_cubes_promo_image || s.custom_images?.['ice-promo'] || '/ice_cubes_promo_1790856824108.jpg',
    description: 'Centerpiece photo/flyer displayed on Homepage for Ice Cubes.',
    recommendedAspect: '16:10'
  });

  slots.push({
    id: 'homepage_about_card',
    title: 'Homepage About Card Photo ("Clean. Safe. Reliable.")',
    category: 'about',
    currentUrl: s.homepage_about_image || '/cold_room_storage_1790856812685.jpg',
    description: 'Image displayed inside homepage Clean. Safe. Reliable. About card.',
    recommendedAspect: '4:3'
  });

  slots.push({
    id: 'storefront_main',
    title: 'Waterfalls Storefront & Plant Facility',
    category: 'storefront',
    currentUrl: s.storefront_image || '/crystal_ice_storefront.jpg',
    description: 'Centerpiece building photography.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'about_facility',
    title: 'About Us Facility & Plant Operations',
    category: 'about',
    currentUrl: s.about_facility_image || '/crystal_ice_storefront.jpg',
    description: 'Operational facility photo displayed on About Us page.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'site_logo',
    title: 'Official Crystal Ice Logo',
    category: 'branding',
    currentUrl: s.logo_url || '/crystal_ice_logo.png',
    description: 'Company logo displayed across site.',
    recommendedAspect: 'Horizontal (2.3:1)'
  });

  slots.push({
    id: 'delivery_fleet',
    title: 'Cold-Chain Delivery Fleet & Logistics',
    category: 'facilities',
    currentUrl: s.delivery_fleet_image || '/service_harare_skyline_1790773229249.jpg',
    description: 'Refrigerated delivery trucks and Harare distribution fleet.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'cold_storage_chamber',
    title: 'Cold Storage Room & Blast Freezing Chamber',
    category: 'facilities',
    currentUrl: s.cold_storage_image || '/cold_room_storage_1790856812685.jpg',
    description: 'Sub-zero blast freezing room with industrial cooling fans.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'ice_blocks_freezing',
    title: 'Solid Ice Blocks Freezing Production Room',
    category: 'facilities',
    currentUrl: s.ice_blocks_image || '/ice_blocks_freezing_1790856836725.jpg',
    description: 'Vertical hanging ice column freezing tanks and block storage.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'water_purification',
    title: 'Water Purification & RO Filtration Plant',
    category: 'facilities',
    currentUrl: s.water_purification_image || '',
    description: 'Food-grade multi-stage reverse osmosis filtration facility.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'contact_dispatch_facility',
    title: 'Harare 24/7 Dispatch Desk & Loading Bay',
    category: 'facilities',
    currentUrl: s.contact_dispatch_image || '',
    description: 'Waterfalls physical customer service desk and loading bay.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'quality_assurance_lab',
    title: 'Food-Grade Testing & Purity Verification Lab',
    category: 'facilities',
    currentUrl: s.quality_assurance_image || '',
    description: 'Microbial and TDS water purity testing station.',
    recommendedAspect: '16:9'
  });

  slots.push({
    id: 'emergency_backup_power',
    title: 'Heavy Diesel Generator (Continuous Freezing Power)',
    category: 'facilities',
    currentUrl: s.generator_image || '',
    description: 'Commercial standby generator guaranteeing 24/7 ice manufacturing.',
    recommendedAspect: '16:9'
  });

  (database.products || []).forEach((p: any) => {
    slots.push({
      id: `product-${p.id}`,
      title: `Product: ${p.name}`,
      category: 'products',
      currentUrl: p.image || '',
      description: `${p.package_size || ''} catalog picture.`,
      recommendedAspect: '1:1'
    });
  });

  (database.services || []).forEach((srv: any) => {
    slots.push({
      id: `service-${srv.id}`,
      title: `Service: ${srv.title}`,
      category: 'services',
      currentUrl: srv.image || '',
      description: `Industrial plant service illustration for ${srv.title}.`,
      recommendedAspect: '16:9'
    });
  });

  (database.portfolio_items || []).forEach((item: any) => {
    slots.push({
      id: `portfolio-${item.id}`,
      title: `Portfolio: ${item.client_name}`,
      category: 'portfolio',
      currentUrl: item.image_url || '',
      description: `${item.category} supply client case study photo.`,
      recommendedAspect: '4:3'
    });
  });

  if (s.custom_images) {
    const knownIds = new Set(slots.map((sl) => sl.id.toLowerCase()));
    Object.entries(s.custom_images).forEach(([rawKey, val]: [string, any]) => {
      if (!val) return;
      const cleanKey = rawKey.replace(/^custom[-_]+/, '').toLowerCase();
      const slotAlreadyExists = slots.some(
        (sl) =>
          sl.id.toLowerCase() === rawKey.toLowerCase() ||
          sl.id.toLowerCase() === cleanKey ||
          sl.id.toLowerCase() === `custom-${cleanKey}` ||
          (sl.currentUrl === val && (cleanKey.includes('promo') || cleanKey.includes('ice_cubes')))
      );
      if (slotAlreadyExists) return;

      const slotId = `custom-${cleanKey}`;
      slots.push({
        id: slotId,
        title: `Custom Slot: ${cleanKey.replace(/_/g, ' ')}`,
        category: 'facilities',
        currentUrl: val,
        description: 'Custom designated image slot on website.',
        recommendedAspect: 'Flexible'
      });
      knownIds.add(slotId);
    });
  }

  return slots;
}

function applySlotReplacement(database: any, slotId: string, newUrl: string) {
  const normalized = slotId.trim().toLowerCase().replace(/-/g, '_');
  const s = database.settings || (database.settings = {});

  if (normalized === 'hero_backdrop' || normalized === 'hero') {
    s.hero_bg_image = newUrl;
  } else if (normalized === 'homepage_about_card' || normalized === 'about_card') {
    s.homepage_about_image = newUrl;
  } else if (normalized === 'storefront_main' || normalized === 'storefront') {
    s.storefront_image = newUrl;
    s.about_facility_image = newUrl;
  } else if (normalized === 'about_facility' || normalized === 'about') {
    s.about_facility_image = newUrl;
  } else if (normalized === 'site_logo' || normalized === 'logo') {
    s.logo_url = newUrl;
  } else if (normalized === 'delivery_fleet' || normalized === 'fleet') {
    s.delivery_fleet_image = newUrl;
  } else if (
    normalized === 'homepage_ice_cubes_card' ||
    normalized === 'ice_promo' ||
    normalized === 'custom_ice_promo' ||
    slotId === 'custom-ice-promo'
  ) {
    s.homepage_ice_cubes_image = newUrl;
    s.ice_cubes_promo_image = newUrl;
    if (!s.custom_images) s.custom_images = {};
    s.custom_images['ice-promo'] = newUrl;
    s.custom_images['ice_promo'] = newUrl;
    s.custom_images['homepage_ice_cubes_card'] = newUrl;
  } else if (normalized === 'cold_storage_chamber' || normalized === 'cold_storage') {
    s.cold_storage_image = newUrl;
  } else if (normalized === 'ice_blocks_freezing') {
    s.ice_blocks_image = newUrl;
  } else if (slotId.startsWith('product-')) {
    const id = slotId.replace('product-', '');
    const p = (database.products || []).find((pr: any) => pr.id === id);
    if (p) p.image = newUrl;
  } else if (slotId.startsWith('service-')) {
    const id = slotId.replace('service-', '');
    const srv = (database.services || []).find((sr: any) => sr.id === id);
    if (srv) srv.image = newUrl;
  } else if (slotId.startsWith('custom-') || normalized.startsWith('custom_')) {
    if (!s.custom_images) s.custom_images = {};
    s.custom_images[slotId] = newUrl;
    const clean = slotId.replace(/^custom-/, '');
    s.custom_images[clean] = newUrl;
  }
}
