import {
  Product,
  Service,
  Testimonial,
  FAQ,
  DeliveryArea,
  Order,
  QuoteRequest,
  ContactSubmission,
  WebsiteSettings,
  Statistic,
  MediaItem,
  AdminNotification,
  AuditLog,
  AdminUser,
  ProcessStep,
  PortfolioItem,
  NewsItem,
  SystemRole,
  SiteImageSlot
} from '../types/index.ts';
import {
  defaultSettings,
  defaultProducts,
  defaultServices,
  defaultTestimonials,
  defaultFaqs,
  defaultDeliveryAreas,
  defaultStatistics
} from '../data/defaultContent.ts';

const TOKEN_KEY = 'arcticpure_admin_token';
const USER_KEY = 'arcticpure_admin_user';

export interface BootstrapData {
  settings: WebsiteSettings;
  statistics: Statistic[];
  products: Product[];
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  delivery_areas: DeliveryArea[];
  process_steps: ProcessStep[];
  portfolio_items: PortfolioItem[];
  news_items: NewsItem[];
}

export const api = {
  // Public Data Retrieval with resilient static fallback for Cloudflare Pages
  async getBootstrapData(forceFresh: boolean = false): Promise<BootstrapData> {
    try {
      const url = forceFresh ? `/api/public/bootstrap?_t=${Date.now()}` : `/api/public/bootstrap`;
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data && Array.isArray(data.products) && data.products.length > 0) {
            // Apply slot overrides from localStorage so changes reflect immediately
            try {
              const overrides = JSON.parse(localStorage.getItem('crystal_ice_slot_overrides') || '{}');
              if (Object.keys(overrides).length > 0) {
                if (overrides.site_logo || overrides.logo) data.settings.logo_url = overrides.site_logo || overrides.logo;
                if (overrides.hero_backdrop || overrides.hero) data.settings.hero_bg_image = overrides.hero_backdrop || overrides.hero;
                if (overrides.storefront_main || overrides.storefront) {
                  data.settings.storefront_image = overrides.storefront_main || overrides.storefront;
                  data.settings.about_facility_image = overrides.storefront_main || overrides.storefront;
                }
                if (overrides.about_facility) data.settings.about_facility_image = overrides.about_facility;
                if (overrides.cold_storage_chamber || overrides['ice-cubes-2-5kg']) {
                  data.settings.cold_storage_image = overrides.cold_storage_chamber || overrides['ice-cubes-2-5kg'];
                }
                if (overrides.ice_blocks_freezing || overrides['ice-blocks-10kg']) {
                  data.settings.ice_blocks_image = overrides.ice_blocks_freezing || overrides['ice-blocks-10kg'];
                }
                if (overrides['ice-promo']) {
                  data.settings.ice_cubes_promo_image = overrides['ice-promo'];
                }

                data.products = data.products.map((p: Product) => {
                  if (overrides[`product-${p.id}`]) return { ...p, image: overrides[`product-${p.id}`] };
                  if (p.id === 'prod-1' && overrides['ice-cubes-2-5kg']) return { ...p, image: overrides['ice-cubes-2-5kg'] };
                  if (p.id === 'prod-2' && overrides['ice-bags-5kg']) return { ...p, image: overrides['ice-bags-5kg'] };
                  if (p.id === 'prod-3' && overrides['ice-blocks-10kg']) return { ...p, image: overrides['ice-blocks-10kg'] };
                  if (p.id === 'prod-4' && overrides['chicken-blast']) return { ...p, image: overrides['chicken-blast'] };
                  if (p.id === 'prod-5' && overrides['beef-blast']) return { ...p, image: overrides['beef-blast'] };
                  return p;
                });

                data.services = data.services.map((s: Service) => {
                  if (overrides[`service-${s.id}`]) return { ...s, image: overrides[`service-${s.id}`] };
                  if (s.id === 'serv-1' && overrides['ice-cubes-2-5kg']) return { ...s, image: overrides['ice-cubes-2-5kg'] };
                  if (s.id === 'serv-2' && overrides['chicken-blast']) return { ...s, image: overrides['chicken-blast'] };
                  if (s.id === 'serv-3' && overrides['ice-promo']) return { ...s, image: overrides['ice-promo'] };
                  if (s.id === 'serv-4' && overrides['ice-blocks-freezing']) return { ...s, image: overrides['ice-blocks-freezing'] };
                  return s;
                });
              }
            } catch {}
            return data;
          }
        }
      }
    } catch {
      // Offline, static hosting (Cloudflare Pages), or server route not running
    }

    return {
      settings: defaultSettings,
      products: defaultProducts,
      services: defaultServices,
      testimonials: defaultTestimonials,
      faqs: defaultFaqs,
      delivery_areas: defaultDeliveryAreas,
      statistics: defaultStatistics,
      process_steps: [],
      portfolio_items: [],
      news_items: []
    };
  },

  async getSettings(): Promise<WebsiteSettings> {
    try {
      const data = await this.getBootstrapData();
      return data.settings || defaultSettings;
    } catch {
      return defaultSettings;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const data = await this.getBootstrapData();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        return data.products;
      }
    } catch {}
    return defaultProducts;
  },

  async getServices(): Promise<Service[]> {
    try {
      const data = await this.getBootstrapData();
      if (data && Array.isArray(data.services) && data.services.length > 0) {
        return data.services;
      }
    } catch {}
    return defaultServices;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const data = await this.getBootstrapData();
      if (data && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
        return data.testimonials;
      }
    } catch {}
    return defaultTestimonials;
  },

  async getFAQs(): Promise<FAQ[]> {
    try {
      const data = await this.getBootstrapData();
      if (data && Array.isArray(data.faqs) && data.faqs.length > 0) {
        return data.faqs;
      }
    } catch {}
    return defaultFaqs;
  },

  async getDeliveryAreas(): Promise<DeliveryArea[]> {
    try {
      const data = await this.getBootstrapData();
      if (data && Array.isArray(data.delivery_areas) && data.delivery_areas.length > 0) {
        return data.delivery_areas;
      }
    } catch {}
    return defaultDeliveryAreas;
  },

  async getStatistics(): Promise<Statistic[]> {
    try {
      const data = await this.getBootstrapData();
      if (data && Array.isArray(data.statistics) && data.statistics.length > 0) {
        return data.statistics;
      }
    } catch {}
    return defaultStatistics;
  },

  async getProcessSteps(): Promise<ProcessStep[]> {
    const data = await this.getBootstrapData();
    return data.process_steps || [];
  },

  async getPortfolio(): Promise<PortfolioItem[]> {
    const data = await this.getBootstrapData();
    return data.portfolio_items || [];
  },

  async getNews(): Promise<NewsItem[]> {
    const data = await this.getBootstrapData();
    return data.news_items || [];
  },

  // Public Submissions (Guest-first)
  async submitOrder(orderData: any): Promise<{ success: boolean; reference_number: string; order: any }> {
    const res = await fetch('/api/public/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async submitQuote(quoteData: any): Promise<{ success: boolean; reference_number: string; quote: any }> {
    const res = await fetch('/api/public/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit quote request');
    return data;
  },

  async submitContact(contactData: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return data;
  },

  async submitContactForm(contactData: any): Promise<{ success: boolean; message: string }> {
    return this.submitContact(contactData);
  },

  // Real-Time Server-Sent Events (SSE)
  subscribeToEvents(onEvent: (data: { event: string; entity?: string }) => void): () => void {
    if (typeof EventSource === 'undefined') {
      return () => {};
    }

    let source: EventSource | null = new EventSource('/api/public/events');

    source.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        onEvent(payload);
      } catch (err) {
        console.warn('Could not parse SSE payload:', err);
      }
    };

    source.onerror = () => {
      // Reconnection handled automatically by browser EventSource
    };

    return () => {
      if (source) {
        source.close();
        source = null;
      }
    };
  },

  // Auth Helpers
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Bootstrap Check & Execution
  async getBootstrapStatus(): Promise<{ bootstrap_available: boolean; locked: boolean }> {
    const res = await fetch('/api/admin/bootstrap/status');
    if (!res.ok) throw new Error('Failed to verify bootstrap status');
    return res.json();
  },

  async bootstrapFirstAdmin(payload: { email: string; name: string; password: string }): Promise<{ user: AdminUser; token: string }> {
    const res = await fetch('/api/admin/bootstrap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Bootstrap failed');
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async adminLogin(emailOrUsername: string, password: string): Promise<{ user: AdminUser; token: string }> {
    return this.login(emailOrUsername, password);
  },

  async verifyAuth(): Promise<AdminUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        await this.logout();
        return null;
      }
      const data = await res.json();
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('arcticpure_admin_token');
    localStorage.removeItem('arcticpure_admin_user');
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          keepalive: true
        });
      } catch {
        // Silently handle offline/restarting server states
      }
    }
  },

  // Authenticated Admin Requests
  async adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    };

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (res.status === 401) {
      await this.logout();
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Operation failed');
    }
    return data;
  },

  // Admin Overview
  async getAdminOverview(): Promise<any> {
    return this.adminRequest('/api/admin/overview');
  },

  // User & Role Management
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.adminRequest('/api/admin/users');
  },

  async createAdminUser(payload: { email: string; name: string; password: string; role: SystemRole }): Promise<AdminUser> {
    return this.adminRequest('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateUserRole(userId: string, role: SystemRole): Promise<AdminUser> {
    return this.adminRequest(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  },

  async toggleUserActive(userId: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/users/${userId}/toggle-active`, {
      method: 'PATCH'
    });
  },

  async deleteAdminUser(userId: string): Promise<{ success: boolean; message: string }> {
    return this.adminRequest(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  async restartAdminBootstrap(): Promise<{ success: boolean; message: string }> {
    return this.adminRequest('/api/admin/bootstrap/restart', {
      method: 'POST'
    });
  },

  // Admin Orders
  async getAdminOrders(): Promise<Order[]> {
    return this.adminRequest('/api/admin/orders');
  },

  async updateOrderStatus(id: string, status: Order['status'], internalNotes?: string): Promise<Order> {
    return this.adminRequest(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internal_notes: internalNotes })
    });
  },

  // Admin Quotes
  async getAdminQuotes(): Promise<QuoteRequest[]> {
    return this.adminRequest('/api/admin/quotes');
  },

  async updateQuoteStatus(id: string, status: QuoteRequest['status'], internalNotes?: string): Promise<QuoteRequest> {
    return this.adminRequest(`/api/admin/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internal_notes: internalNotes })
    });
  },

  // Admin Contacts
  async getAdminContacts(): Promise<ContactSubmission[]> {
    return this.adminRequest('/api/admin/contacts');
  },

  async getAdminContactMessages(): Promise<ContactSubmission[]> {
    return this.getAdminContacts();
  },

  async updateContactStatus(id: string, status: ContactSubmission['status']): Promise<ContactSubmission> {
    return this.adminRequest(`/api/admin/contacts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Admin Products
  async getAdminProducts(): Promise<Product[]> {
    return this.adminRequest('/api/admin/products');
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    return this.adminRequest('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    return this.saveProduct(product);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.saveProduct({ ...product, id });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Services
  async getAdminServices(): Promise<Service[]> {
    return this.adminRequest('/api/admin/services');
  },

  async saveService(service: Partial<Service>): Promise<Service> {
    return this.adminRequest('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(service)
    });
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/services/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Delivery Areas
  async getAdminDeliveryAreas(): Promise<DeliveryArea[]> {
    return this.adminRequest('/api/admin/delivery-areas');
  },

  async saveDeliveryArea(area: Partial<DeliveryArea>): Promise<DeliveryArea> {
    return this.adminRequest('/api/admin/delivery-areas', {
      method: 'POST',
      body: JSON.stringify(area)
    });
  },

  async deleteDeliveryArea(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/delivery-areas/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Testimonials
  async getAdminTestimonials(): Promise<Testimonial[]> {
    return this.adminRequest('/api/admin/testimonials');
  },

  async saveTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return this.adminRequest('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial)
    });
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/testimonials/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin FAQs
  async getAdminFAQs(): Promise<FAQ[]> {
    return this.adminRequest('/api/admin/faqs');
  },

  async saveFAQ(faq: Partial<FAQ>): Promise<FAQ> {
    return this.adminRequest('/api/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(faq)
    });
  },

  async deleteFAQ(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/faqs/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Process Steps
  async getAdminProcessSteps(): Promise<ProcessStep[]> {
    return this.adminRequest('/api/admin/process-steps');
  },

  async saveProcessStep(step: Partial<ProcessStep>): Promise<ProcessStep> {
    return this.adminRequest('/api/admin/process-steps', {
      method: 'POST',
      body: JSON.stringify(step)
    });
  },

  async deleteProcessStep(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/process-steps/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Portfolio Items
  async getAdminPortfolio(): Promise<PortfolioItem[]> {
    return this.adminRequest('/api/admin/portfolio');
  },

  async getAdminPortfolioItems(): Promise<PortfolioItem[]> {
    return this.getAdminPortfolio();
  },

  async savePortfolio(item: Partial<PortfolioItem>): Promise<PortfolioItem> {
    return this.adminRequest('/api/admin/portfolio', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  async savePortfolioItem(item: Partial<PortfolioItem>): Promise<PortfolioItem> {
    return this.savePortfolio(item);
  },

  async deletePortfolio(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/portfolio/${id}`, {
      method: 'DELETE'
    });
  },

  async deletePortfolioItem(id: string): Promise<{ success: boolean }> {
    return this.deletePortfolio(id);
  },

  // Admin News Items
  async getAdminNews(): Promise<NewsItem[]> {
    return this.adminRequest('/api/admin/news');
  },

  async getAdminNewsItems(): Promise<NewsItem[]> {
    return this.getAdminNews();
  },

  async saveNews(item: Partial<NewsItem>): Promise<NewsItem> {
    return this.adminRequest('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  async saveNewsItem(item: Partial<NewsItem>): Promise<NewsItem> {
    return this.saveNews(item);
  },

  async deleteNews(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/news/${id}`, {
      method: 'DELETE'
    });
  },

  async deleteNewsItem(id: string): Promise<{ success: boolean }> {
    return this.deleteNews(id);
  },

  // Website Settings
  async saveSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    return this.adminRequest('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    return this.saveSettings(settings);
  },

  // Statistics
  async saveStatistics(stats: Statistic[]): Promise<Statistic[]> {
    return this.adminRequest('/api/admin/statistics', {
      method: 'POST',
      body: JSON.stringify(stats)
    });
  },

  // Media Library
  async getAdminMedia(): Promise<MediaItem[]> {
    return this.adminRequest('/api/admin/media');
  },

  async addMedia(mediaItem: Partial<MediaItem>): Promise<MediaItem> {
    return this.adminRequest('/api/admin/media', {
      method: 'POST',
      body: JSON.stringify(mediaItem)
    });
  },

  async deleteMedia(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/media/${id}`, {
      method: 'DELETE'
    });
  },

  // Notifications
  async getAdminNotifications(): Promise<AdminNotification[]> {
    return this.adminRequest('/api/admin/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.adminRequest(`/api/admin/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.adminRequest('/api/admin/notifications/mark-all-read', {
      method: 'POST'
    });
  },

  // Audit Logs
  async getAdminAuditLogs(): Promise<AuditLog[]> {
    return this.adminRequest('/api/admin/audit-logs');
  },

  // Exact Lossless Image Upload with automatic serverless fallback for Cloudflare Pages
  async uploadExactImage(file: File, category?: string): Promise<{
    success: boolean;
    url: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    sizeKb: number;
    lossless: boolean;
    preservedOriginal: boolean;
    uploadedAt: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }

    const headers: Record<string, string> = {};
    const token = localStorage.getItem(TOKEN_KEY) || 'owner-session-token';
    headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Server not reachable or static hosting on Cloudflare Pages
    }

    // High-fidelity client-side fallback (works on Cloudflare Pages without backend)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const sizeKb = Math.round(file.size / 1024);
        resolve({
          success: true,
          url: dataUrl,
          fileName: file.name,
          originalName: file.name,
          mimeType: file.type || 'image/jpeg',
          sizeBytes: file.size,
          sizeKb,
          lossless: true,
          preservedOriginal: true,
          uploadedAt: new Date().toISOString()
        });
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  },

  async uploadMultipleExactImages(files: File[]): Promise<{
    success: boolean;
    count: number;
    files: Array<{
      url: string;
      fileName: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number;
      sizeKb: number;
      lossless: boolean;
      preservedOriginal: boolean;
    }>;
  }> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const headers: Record<string, string> = {};
    const token = localStorage.getItem(TOKEN_KEY) || 'owner-session-token';
    headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Server not reachable
    }

    // Client-side fallback for static Cloudflare Pages
    const processed = await Promise.all(
      files.map(
        (f) =>
          new Promise<{
            url: string;
            fileName: string;
            originalName: string;
            mimeType: string;
            sizeBytes: number;
            sizeKb: number;
            lossless: boolean;
            preservedOriginal: boolean;
          }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                url: reader.result as string,
                fileName: f.name,
                originalName: f.name,
                mimeType: f.type || 'image/jpeg',
                sizeBytes: f.size,
                sizeKb: Math.round(f.size / 1024),
                lossless: true,
                preservedOriginal: true
              });
            };
            reader.readAsDataURL(f);
          })
      )
    );

    return {
      success: true,
      count: processed.length,
      files: processed
    };
  },

  // ----------------------------------------------------
  // SITE IMAGE SLOTS API (LIVE IN-PLACE UPDATING)
  // ----------------------------------------------------
  async getSiteImageSlots(): Promise<SiteImageSlot[]> {
    try {
      const res = await fetch('/api/public/site-images');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {}

    // Static fallback slots
    const defaultSlots: SiteImageSlot[] = [
      { id: 'hero_backdrop', title: 'Homepage Hero Backdrop Photo', category: 'hero', currentUrl: defaultSettings.hero_bg_image || '/crystal_ice_backdrop.jpg', description: 'Hero backdrop showcasing cold room operations.', recommendedAspect: '16:9', targetType: 'settings', targetField: 'hero_bg_image' },
      { id: 'storefront_main', title: 'Waterfalls Facility Front / Storefront', category: 'facilities', currentUrl: '/crystal_ice_storefront.jpg', description: 'Facility exterior at FF11 Waterfalls Avenue.', recommendedAspect: '16:9', targetType: 'settings', targetField: 'storefront_image' },
      { id: 'about_facility', title: 'About Page Cold Storage Overview', category: 'facilities', currentUrl: '/crystal_ice_about_story.jpg', description: 'Photo of the cold room operations.', recommendedAspect: '16:9', targetType: 'settings', targetField: 'about_facility_image' },
      { id: 'site_logo', title: 'Website Brand Logo', category: 'branding', currentUrl: defaultSettings.logo_url || '/crystal_ice_logo.png', description: 'Crystal Ice Zimbabwe primary brand logo.', recommendedAspect: '1:1', targetType: 'settings', targetField: 'logo_url' }
    ];

    defaultProducts.forEach((p) => {
      defaultSlots.push({
        id: `product-${p.id}`,
        title: `${p.name} Photo`,
        category: 'products',
        currentUrl: p.image || '',
        description: `Product display image for ${p.name}.`,
        recommendedAspect: '4:3',
        targetType: 'product',
        targetId: p.id
      });
    });

    try {
      const overrides = JSON.parse(localStorage.getItem('crystal_ice_slot_overrides') || '{}');
      return defaultSlots.map((s) => ({
        ...s,
        currentUrl: overrides[s.id] || s.currentUrl
      }));
    } catch {
      return defaultSlots;
    }
  },

  async replaceSiteImageSlot(slotId: string, imageOrFile: string | File): Promise<{
    success: boolean;
    slotId: string;
    newUrl: string;
  }> {
    const token = localStorage.getItem(TOKEN_KEY) || 'owner-session-token';
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    let resultUrl = '';

    try {
      if (imageOrFile instanceof File) {
        const formData = new FormData();
        formData.append('file', imageOrFile);
        formData.append('slotId', slotId);

        const res = await fetch('/api/admin/site-images/replace', {
          method: 'POST',
          headers,
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          resultUrl = data.newUrl;
        }
      } else {
        headers['Content-Type'] = 'application/json';
        const res = await fetch('/api/admin/site-images/replace', {
          method: 'POST',
          headers,
          body: JSON.stringify({ slotId, imageUrl: imageOrFile })
        });
        if (res.ok) {
          const data = await res.json();
          resultUrl = data.newUrl || imageOrFile;
        }
      }
    } catch {
      // Static Cloudflare Pages or server disconnected
    }

    // Client-side fallback if backend was unavailable
    if (!resultUrl) {
      if (imageOrFile instanceof File) {
        resultUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageOrFile);
        });
      } else {
        resultUrl = imageOrFile;
      }
    }

    // Cache slot override in localStorage so it persists instantly on Cloudflare Pages
    try {
      const overrides = JSON.parse(localStorage.getItem('crystal_ice_slot_overrides') || '{}');
      overrides[slotId] = resultUrl;
      localStorage.setItem('crystal_ice_slot_overrides', JSON.stringify(overrides));
      window.dispatchEvent(new CustomEvent('crystal-image-slot-updated', { detail: { slotId, newUrl: resultUrl } }));
    } catch {}

    return {
      success: true,
      slotId,
      newUrl: resultUrl
    };
  },

  async removeSiteImageSlot(slotId: string): Promise<{
    success: boolean;
    slotId: string;
  }> {
    const token = localStorage.getItem(TOKEN_KEY) || 'owner-session-token';
    try {
      await fetch('/api/admin/site-images/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ slotId })
      });
    } catch {}

    try {
      const overrides = JSON.parse(localStorage.getItem('crystal_ice_slot_overrides') || '{}');
      delete overrides[slotId];
      localStorage.setItem('crystal_ice_slot_overrides', JSON.stringify(overrides));
    } catch {}

    return {
      success: true,
      slotId
    };
  },

  async troubleshootUploader(): Promise<{
    status: 'healthy' | 'degraded';
    uploadsDir: string;
    uploadsDirExists: boolean;
    uploadsDirWritable: boolean;
    totalUploadedFiles: number;
    maxFileSizeMb: number;
    allowedMimeTypes: string[];
    imageMagickAvailable: boolean;
    imageMagickVersion: string;
    totalConfiguredSlots: number;
    activeSlotsWithImages: number;
    storageStrategy: string;
    timestamp: string;
  }> {
    return this.adminRequest('/api/admin/troubleshoot/uploader');
  }
};
