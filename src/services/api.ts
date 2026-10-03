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
  // Public Data Retrieval
  async getBootstrapData(): Promise<BootstrapData> {
    const res = await fetch('/api/public/bootstrap');
    if (!res.ok) throw new Error('Failed to load website catalog data');
    return res.json();
  },

  async getSettings(): Promise<WebsiteSettings> {
    const data = await this.getBootstrapData();
    return data.settings;
  },

  async getProducts(): Promise<Product[]> {
    const data = await this.getBootstrapData();
    return data.products;
  },

  async getServices(): Promise<Service[]> {
    const data = await this.getBootstrapData();
    return data.services;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const data = await this.getBootstrapData();
    return data.testimonials;
  },

  async getFAQs(): Promise<FAQ[]> {
    const data = await this.getBootstrapData();
    return data.faqs;
  },

  async getDeliveryAreas(): Promise<DeliveryArea[]> {
    const data = await this.getBootstrapData();
    return data.delivery_areas;
  },

  async getStatistics(): Promise<Statistic[]> {
    const data = await this.getBootstrapData();
    return data.statistics;
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

  // Exact Lossless Image Upload
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || `Upload failed with status ${res.status}`);
    }

    return res.json();
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
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/upload/multiple', {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Batch upload failed' }));
      throw new Error(err.error || `Upload failed with status ${res.status}`);
    }

    return res.json();
  },

  // ----------------------------------------------------
  // SITE IMAGE SLOTS API (LIVE IN-PLACE UPDATING)
  // ----------------------------------------------------
  async getSiteImageSlots(): Promise<SiteImageSlot[]> {
    const res = await fetch('/api/public/site-images');
    if (!res.ok) throw new Error('Failed to load site image slots');
    return res.json();
  },

  async replaceSiteImageSlot(slotId: string, imageOrFile: string | File): Promise<{
    success: boolean;
    slotId: string;
    newUrl: string;
  }> {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (imageOrFile instanceof File) {
      const formData = new FormData();
      formData.append('file', imageOrFile);
      formData.append('slotId', slotId);

      const res = await fetch('/api/admin/site-images/replace', {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Replace failed' }));
        throw new Error(err.error || 'Failed to replace image slot');
      }
      return res.json();
    } else {
      headers['Content-Type'] = 'application/json';
      const res = await fetch('/api/admin/site-images/replace', {
        method: 'POST',
        headers,
        body: JSON.stringify({ slotId, imageUrl: imageOrFile })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Replace failed' }));
        throw new Error(err.error || 'Failed to replace image slot');
      }
      return res.json();
    }
  },

  async removeSiteImageSlot(slotId: string): Promise<{
    success: boolean;
    slotId: string;
  }> {
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch('/api/admin/site-images/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ slotId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Remove failed' }));
      throw new Error(err.error || 'Failed to remove image slot');
    }
    return res.json();
  }
};
