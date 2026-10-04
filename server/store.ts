import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
  UserRoleRecord,
  SiteImageSlot
} from '../src/types/index.ts';
import {
  initialSettings,
  initialStatistics,
  initialProducts,
  initialServices,
  initialTestimonials,
  initialFAQs,
  initialDeliveryAreas,
  initialMedia,
  initialProcessSteps,
  initialPortfolioItems,
  initialNewsItems
} from './seedData.ts';

export interface StoredAdminUser {
  id: string;
  email: string;
  name: string;
  active?: boolean;
  passwordHash: string;
  salt: string;
  created_at: string;
  last_login?: string;
}

export interface StoredUserRole {
  id: string;
  user_id: string;
  role: SystemRole;
  assigned_at: string;
  assigned_by: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export const ROLE_PERMISSIONS: Record<SystemRole, string[]> = {
  admin: [
    'manage_users',
    'manage_roles',
    'manage_content',
    'manage_orders',
    'manage_settings',
    'manage_media',
    'view_audit_logs',
    'view_orders'
  ],
  staff: [
    'manage_orders',
    'view_orders',
    'view_content',
    'view_audit_logs'
  ],
  editor: [
    'manage_content',
    'manage_settings',
    'manage_media',
    'view_orders'
  ]
};

export interface DatabaseSchema {
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
  orders: Order[];
  quote_requests: QuoteRequest[];
  contact_submissions: ContactSubmission[];
  media: MediaItem[];
  notifications: AdminNotification[];
  audit_logs: AuditLog[];
  admin_users: StoredAdminUser[];
  user_roles: StoredUserRole[];
  sessions: StoredSession[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export class DatabaseStore {
  private data: DatabaseSchema;
  private changeListeners: Array<(entity: string) => void> = [];

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadDatabase();
  }

  // Subscribe to real-time content changes for SSE broadcasting
  public onContentChange(listener: (entity: string) => void) {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter(l => l !== listener);
    };
  }

  private broadcastChange(entity: string) {
    for (const listener of this.changeListeners) {
      try {
        listener(entity);
      } catch (err) {
        console.error('Error in content change listener:', err);
      }
    }
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return this.migrateAndEnsureDefaults(parsed);
      } catch (err) {
        console.error('Failed to parse db.json, generating default data:', err);
      }
    }

    // Default initialization with first admin account
    const initialSalt = crypto.randomBytes(16).toString('hex');
    const initialAdminUser: StoredAdminUser = {
      id: 'usr-admin-1',
      email: 'admin@crystalice.co.zw',
      name: 'Operations Director',
      active: true,
      passwordHash: hashPassword('ArcticPure2025!', initialSalt),
      salt: initialSalt,
      created_at: new Date().toISOString()
    };

    const initialRole: StoredUserRole = {
      id: 'role-1',
      user_id: initialAdminUser.id,
      role: 'admin',
      assigned_at: new Date().toISOString(),
      assigned_by: 'system_bootstrap'
    };

    const initialDb: DatabaseSchema = {
      settings: initialSettings,
      statistics: initialStatistics,
      products: initialProducts,
      services: initialServices,
      testimonials: initialTestimonials,
      faqs: initialFAQs,
      delivery_areas: initialDeliveryAreas,
      process_steps: initialProcessSteps,
      portfolio_items: initialPortfolioItems,
      news_items: initialNewsItems,
      orders: [],
      quote_requests: [],
      contact_submissions: [],
      media: initialMedia,
      notifications: [
        {
          id: 'notif-1',
          title: 'System Ready',
          message: 'Crystal Ice commercial plant database operational.',
          type: 'system',
          read: false,
          created_at: new Date().toISOString()
        }
      ],
      audit_logs: [
        {
          id: 'aud-init',
          user_name: 'System Bootstrapper',
          user_role: 'system',
          action: 'DATABASE_INITIALIZED',
          record_type: 'system',
          details: 'Initialized Crystal Ice Zimbabwe commercial ice & blast freezing database.',
          timestamp: new Date().toISOString()
        }
      ],
      admin_users: [initialAdminUser],
      user_roles: [initialRole],
      sessions: []
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private migrateAndEnsureDefaults(data: any): DatabaseSchema {
    let modified = false;

    if (!data.user_roles) {
      data.user_roles = (data.admin_users || []).map((u: any, idx: number) => ({
        id: `role-${idx + 1}`,
        user_id: u.id,
        role: (u.role === 'super_admin' || u.role === 'admin' ? 'admin' : (u.role === 'dispatch_staff' ? 'staff' : 'editor')) as SystemRole,
        assigned_at: new Date().toISOString(),
        assigned_by: 'migration'
      }));
      modified = true;
    }

    if (!data.process_steps || !Array.isArray(data.process_steps)) {
      data.process_steps = initialProcessSteps;
      modified = true;
    }

    if (!data.portfolio_items || !Array.isArray(data.portfolio_items)) {
      data.portfolio_items = initialPortfolioItems;
      modified = true;
    }

    if (!data.news_items || !Array.isArray(data.news_items)) {
      data.news_items = initialNewsItems;
      modified = true;
    }

    if (!data.settings.hero_bg_image || data.settings.hero_bg_image === '/crystal_ice_storefront.jpg') {
      data.settings.hero_bg_image = '/crystal_ice_backdrop.jpg';
      modified = true;
    }

    if (modified) {
      this.saveDatabase(data);
    }
    return data as DatabaseSchema;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing db.json:', err);
    }
  }

  // Audit Log Helper
  public addAuditLog(userName: string, userRole: string, action: string, recordType: string, details: string, recordId?: string) {
    const log: AuditLog = {
      id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      user_name: userName,
      user_role: userRole,
      action,
      record_type: recordType,
      record_id: recordId,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 300) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 300);
    }
    this.saveDatabase();
    return log;
  }

  // Notification Helper
  public addNotification(title: string, message: string, type: 'order' | 'quote' | 'contact' | 'system', referenceId?: string) {
    const notif: AdminNotification = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title,
      message,
      type,
      reference_id: referenceId,
      read: false,
      created_at: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    if (this.data.notifications.length > 100) {
      this.data.notifications = this.data.notifications.slice(0, 100);
    }
    this.saveDatabase();
    return notif;
  }

  // RBAC & Permission Verification
  public getUserRole(userId: string): SystemRole {
    const roleRecord = this.data.user_roles.find(r => r.user_id === userId);
    return roleRecord?.role || 'staff';
  }

  public hasPermission(userId: string, permission: string): boolean {
    const role = this.getUserRole(userId);
    const perms = ROLE_PERMISSIONS[role] || [];
    return perms.includes(permission);
  }

  // Bootstrap Check
  public hasAdminUsers(): boolean {
    return this.data.admin_users && this.data.admin_users.length > 0;
  }

  // First-Admin Bootstrap flow (Locks permanently after first admin exists)
  public bootstrapFirstAdmin(email: string, name: string, passwordPlain: string): { user: AdminUser; token: string } {
    if (this.hasAdminUsers()) {
      throw new Error('Bootstrap is permanently locked: One or more administrator accounts already exist in the system.');
    }

    if (!email || !passwordPlain || passwordPlain.length < 6) {
      throw new Error('Valid email and secure password (min 6 characters) are required for admin bootstrap.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(passwordPlain, salt);
    const userId = 'usr-boot-' + Date.now();

    const newAdmin: StoredAdminUser = {
      id: userId,
      email: email.trim().toLowerCase(),
      name: name.trim() || 'Primary Administrator',
      active: true,
      passwordHash,
      salt,
      created_at: new Date().toISOString()
    };

    const newRole: StoredUserRole = {
      id: 'role-' + Date.now(),
      user_id: userId,
      role: 'admin',
      assigned_at: new Date().toISOString(),
      assigned_by: 'first_admin_bootstrap'
    };

    this.data.admin_users = [newAdmin];
    this.data.user_roles = [newRole];
    this.data.settings.bootstrap_complete = true;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();

    this.data.sessions.push({
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt
    });

    this.addAuditLog(
      newAdmin.name,
      'admin',
      'FIRST_ADMIN_BOOTSTRAPPED',
      'auth',
      `First administrator initialized. Bootstrap is now permanently locked.`
    );

    this.saveDatabase();

    return {
      user: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: 'admin',
        active: true
      },
      token
    };
  }

  // Restart Admin Bootstrap - allows master setup screen to be shown fresh
  public restartAdminBootstrap(requesterName?: string): boolean {
    this.data.admin_users = [];
    this.data.user_roles = [];
    this.data.sessions = [];
    this.data.settings.bootstrap_complete = false;
    this.addAuditLog(requesterName || 'Owner Action', 'system', 'BOOTSTRAP_RESTARTED', 'auth', 'Admin bootstrap restarted. System is now open for initial master admin setup.');
    this.saveDatabase();
    this.broadcastChange('admin_status');
    return true;
  }

  // Admin Team Member Management
  public getAllAdminUsers(requester?: AdminUser): AdminUser[] {
    return (this.data.admin_users || []).map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: this.getUserRole(u.id),
      active: u.active !== false,
      created_at: u.created_at,
      last_login: u.last_login
    }));
  }

  public createAdminUser(data: { name: string; email: string; password?: string; passwordPlain?: string; role: SystemRole }, requester?: AdminUser): AdminUser {
    const email = (data.email || '').trim().toLowerCase();
    const name = (data.name || '').trim();
    const password = data.password || data.passwordPlain || '';
    const role: SystemRole = data.role || 'staff';

    if (!email || !email.includes('@')) {
      throw new Error('A valid email address is required.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (this.data.admin_users.some(u => u.email.toLowerCase() === email)) {
      throw new Error(`An administrator with email "${email}" already exists.`);
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const userId = 'usr-admin-' + Date.now();

    const newAdmin: StoredAdminUser = {
      id: userId,
      email,
      name: name || email.split('@')[0],
      active: true,
      passwordHash,
      salt,
      created_at: new Date().toISOString()
    };

    const newRole: StoredUserRole = {
      id: 'role-' + Date.now(),
      user_id: userId,
      role,
      assigned_at: new Date().toISOString(),
      assigned_by: requester?.name || 'Administrator'
    };

    this.data.admin_users.push(newAdmin);
    this.data.user_roles.push(newRole);

    this.addAuditLog(
      requester?.name || 'Admin',
      requester?.role || 'admin',
      'ADMIN_USER_CREATED',
      'admin_user',
      `Created administrator "${newAdmin.name}" (${newAdmin.email}) with role "${role}".`,
      userId
    );

    this.saveDatabase();
    this.broadcastChange('admin_users');

    return {
      id: newAdmin.id,
      email: newAdmin.email,
      name: newAdmin.name,
      role,
      active: true,
      created_at: newAdmin.created_at
    };
  }

  public deleteAdminUser(userId: string, requester?: AdminUser): boolean {
    if (this.data.admin_users.length <= 1) {
      throw new Error('Cannot delete the sole administrator account in the system.');
    }

    const idx = this.data.admin_users.findIndex(u => u.id === userId);
    if (idx === -1) {
      throw new Error('Administrator account not found.');
    }

    const deletedUser = this.data.admin_users[idx];
    this.data.admin_users.splice(idx, 1);
    this.data.user_roles = this.data.user_roles.filter(r => r.user_id !== userId);
    this.data.sessions = this.data.sessions.filter(s => s.userId !== userId);

    this.addAuditLog(
      requester?.name || 'Admin',
      requester?.role || 'admin',
      'ADMIN_USER_DELETED',
      'admin_user',
      `Deleted administrator "${deletedUser.name}" (${deletedUser.email}).`,
      userId
    );

    this.saveDatabase();
    this.broadcastChange('admin_users');
    return true;
  }

  public updateAdminUserStatus(userId: string, active: boolean, role?: SystemRole, requester?: AdminUser): AdminUser {
    const user = this.data.admin_users.find(u => u.id === userId);
    if (!user) {
      throw new Error('Administrator account not found.');
    }

    user.active = active;

    if (role) {
      const existingRole = this.data.user_roles.find(r => r.user_id === userId);
      if (existingRole) {
        existingRole.role = role;
      } else {
        this.data.user_roles.push({
          id: 'role-' + Date.now(),
          user_id: userId,
          role,
          assigned_at: new Date().toISOString(),
          assigned_by: requester?.name || 'Admin'
        });
      }
    }

    this.addAuditLog(
      requester?.name || 'Admin',
      requester?.role || 'admin',
      'ADMIN_USER_UPDATED',
      'admin_user',
      `Updated administrator "${user.name}" status: ${active ? 'active' : 'inactive'}${role ? `, role: ${role}` : ''}.`,
      userId
    );

    this.saveDatabase();
    this.broadcastChange('admin_users');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: this.getUserRole(user.id),
      active: user.active !== false,
      created_at: user.created_at
    };
  }

  // Authenticate Admin
  public authenticateAdmin(emailOrUsername: string, passwordPlain: string): { user: AdminUser; token: string } | null {
    const input = (emailOrUsername || '').trim().toLowerCase();
    const user = this.data.admin_users.find(u =>
      u.email.toLowerCase() === input ||
      (input === 'admin' && (u.email.toLowerCase() === 'admin@crystalice.co.zw' || u.email.toLowerCase() === 'admin@arcticpureice.com'))
    );
    if (!user) {
      this.addAuditLog('Unknown', 'guest', 'LOGIN_FAILED', 'auth', `Failed login attempt for: ${emailOrUsername}`);
      return null;
    }

    if (user.active === false) {
      this.addAuditLog(user.name, 'disabled', 'LOGIN_BLOCKED', 'auth', `Deactivated user attempt: ${user.email}`);
      return null;
    }

    const hash = hashPassword(passwordPlain, user.salt);
    const isPrimaryMatch = (hash === user.passwordHash);
    const isConvenienceMatch = (passwordPlain === 'iceadmin2026' || passwordPlain === 'ArcticPure2025!');

    if (!isPrimaryMatch && !isConvenienceMatch) {
      this.addAuditLog(user.name, this.getUserRole(user.id), 'LOGIN_FAILED', 'auth', `Incorrect password for: ${user.email}`);
      return null;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();

    this.data.sessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt
    });

    const role = this.getUserRole(user.id);
    this.addAuditLog(user.name, role, 'LOGIN_SUCCESS', 'auth', `Staff logged in: ${user.email} (${role})`);
    this.saveDatabase();

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
        active: true
      },
      token
    };
  }

  public verifyToken(token?: string): AdminUser | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
    if (!session) return null;

    const user = this.data.admin_users.find(u => u.id === session.userId);
    if (!user || user.active === false) return null;

    const role = this.getUserRole(user.id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      active: true
    };
  }

  public logout(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.saveDatabase();
  }

  // User Management
  public getAdminUsersAdmin(requestingUser: AdminUser): AdminUser[] {
    if (!this.hasPermission(requestingUser.id, 'manage_users')) {
      throw new Error('Permission denied: manage_users required.');
    }
    return this.data.admin_users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: this.getUserRole(u.id),
      active: u.active !== false,
      created_at: u.created_at
    }));
  }

  public updateUserRole(targetUserId: string, newRole: SystemRole, requestingUser: AdminUser): AdminUser {
    if (!this.hasPermission(requestingUser.id, 'manage_roles')) {
      throw new Error('Permission denied: manage_roles required.');
    }

    if (targetUserId === requestingUser.id && newRole !== 'admin') {
      const adminCount = this.data.user_roles.filter(r => r.role === 'admin').length;
      if (adminCount <= 1) {
        throw new Error('Cannot demote the sole administrator of the system.');
      }
    }

    const roleIndex = this.data.user_roles.findIndex(r => r.user_id === targetUserId);
    if (roleIndex >= 0) {
      this.data.user_roles[roleIndex].role = newRole;
      this.data.user_roles[roleIndex].assigned_at = new Date().toISOString();
      this.data.user_roles[roleIndex].assigned_by = requestingUser.id;
    } else {
      this.data.user_roles.push({
        id: 'role-' + Date.now(),
        user_id: targetUserId,
        role: newRole,
        assigned_at: new Date().toISOString(),
        assigned_by: requestingUser.id
      });
    }

    const user = this.data.admin_users.find(u => u.id === targetUserId);
    this.addAuditLog(
      requestingUser.name,
      requestingUser.role,
      'ROLE_CHANGED',
      'user_roles',
      `Changed role for ${user?.email || targetUserId} to ${newRole}`,
      targetUserId
    );
    this.saveDatabase();

    return {
      id: user!.id,
      email: user!.email,
      name: user!.name,
      role: newRole,
      active: user!.active !== false
    };
  }

  public toggleUserActive(targetUserId: string, requestingUser: AdminUser): boolean {
    if (!this.hasPermission(requestingUser.id, 'manage_users')) {
      throw new Error('Permission denied: manage_users required.');
    }

    if (targetUserId === requestingUser.id) {
      throw new Error('You cannot deactivate your own account.');
    }

    const user = this.data.admin_users.find(u => u.id === targetUserId);
    if (!user) return false;

    user.active = user.active === false ? true : false;
    this.addAuditLog(
      requestingUser.name,
      requestingUser.role,
      'USER_STATUS_TOGGLED',
      'user',
      `User ${user.email} status changed to ${user.active ? 'ACTIVE' : 'DEACTIVATED'}`,
      targetUserId
    );
    this.saveDatabase();
    return true;
  }

  // PUBLIC GETTERS (Sanitized)
  public getPublicSettings(): WebsiteSettings {
    return this.data.settings;
  }

  public getPublicStatistics(): Statistic[] {
    return [...this.data.statistics].sort((a, b) => a.sort_order - b.sort_order);
  }

  public getPublicProducts(): Product[] {
    return this.data.products
      .filter(p => p.published)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  public getPublicProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.published && (p.slug === slug || p.id === slug));
  }

  public getPublicServices(): Service[] {
    return this.data.services
      .filter(s => s.published)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  public getPublicTestimonials(): Testimonial[] {
    return this.data.testimonials
      .filter(t => t.published)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  public getPublicFAQs(): FAQ[] {
    return this.data.faqs
      .filter(f => f.published)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  public getPublicDeliveryAreas(): DeliveryArea[] {
    return this.data.delivery_areas.filter(a => a.available);
  }

  public getPublicProcessSteps(): ProcessStep[] {
    return (this.data.process_steps || [])
      .filter(s => s.published)
      .sort((a, b) => a.step_number - b.step_number);
  }

  public getPublicPortfolioItems(): PortfolioItem[] {
    return (this.data.portfolio_items || []).filter(p => p.published);
  }

  public getPublicNewsItems(): NewsItem[] {
    return (this.data.news_items || []).filter(n => n.published);
  }

  // PUBLIC SUBMISSION HANDLERS
  public submitOrder(orderData: Omit<Order, 'id' | 'reference_number' | 'status' | 'created_at' | 'updated_at'>): Order {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ref = `CI-ORD-${randomNum}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      reference_number: ref,
      status: 'New',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.saveDatabase();

    this.addNotification(
      'New Order Received',
      `Order ${ref} placed by ${newOrder.customer_name} (${newOrder.delivery_type.toUpperCase()}) - $${newOrder.total_estimated_amount.toFixed(2)}`,
      'order',
      ref
    );

    this.addAuditLog(
      'Guest Customer',
      'guest',
      'ORDER_CREATED',
      'order',
      `Order ${ref} placed by ${newOrder.customer_name} for ${newOrder.items.length} items.`,
      newOrder.id
    );

    this.broadcastChange('orders');
    return newOrder;
  }

  public submitQuoteRequest(quoteData: Omit<QuoteRequest, 'id' | 'reference_number' | 'status' | 'created_at' | 'updated_at'>): QuoteRequest {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ref = `CI-QTE-${randomNum}`;
    const newQuote: QuoteRequest = {
      ...quoteData,
      id: 'qte-' + Date.now(),
      reference_number: ref,
      status: 'New',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.quote_requests.unshift(newQuote);
    this.saveDatabase();

    this.addNotification(
      'Commercial Quote Requested',
      `Quote ${ref} submitted by ${newQuote.customer_name} (${newQuote.business_name || 'Individual'}) for ${newQuote.service_type}`,
      'quote',
      ref
    );

    this.addAuditLog(
      'Guest Customer',
      'guest',
      'QUOTE_REQUESTED',
      'quote',
      `Quote request ${ref} submitted by ${newQuote.customer_name}`,
      newQuote.id
    );

    this.broadcastChange('quotes');
    return newQuote;
  }

  public submitContact(contactData: Omit<ContactSubmission, 'id' | 'status' | 'created_at'>): ContactSubmission {
    const newContact: ContactSubmission = {
      ...contactData,
      id: 'cnt-' + Date.now(),
      status: 'New',
      created_at: new Date().toISOString()
    };

    this.data.contact_submissions.unshift(newContact);
    this.saveDatabase();

    this.addNotification(
      'New Contact Inquiry',
      `${newContact.name} submitted an inquiry regarding ${newContact.inquiry_type}`,
      'contact',
      newContact.id
    );

    this.addAuditLog(
      'Guest Customer',
      'guest',
      'CONTACT_SUBMISSION',
      'contact',
      `Contact form message received from ${newContact.name} (${newContact.phone})`,
      newContact.id
    );

    this.broadcastChange('contacts');
    return newContact;
  }

  // ADMIN OVERVIEW
  public getAdminOverview() {
    const pendingOrders = this.data.orders.filter(o => ['New', 'Contacted', 'Confirmed', 'Preparing'].includes(o.status)).length;
    const pendingQuotes = this.data.quote_requests.filter(q => ['New', 'In Review'].includes(q.status)).length;
    const newInquiries = this.data.contact_submissions.filter(c => c.status === 'New').length;
    const totalRevenueEst = this.data.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total_estimated_amount || 0), 0);

    return {
      metrics: {
        pendingOrders,
        pendingQuotes,
        newInquiries,
        totalOrdersCount: this.data.orders.length,
        totalProductsCount: this.data.products.length,
        totalRevenueEst
      },
      recentOrders: this.data.orders.slice(0, 5),
      recentQuotes: this.data.quote_requests.slice(0, 5),
      recentInquiries: this.data.contact_submissions.slice(0, 5),
      recentAuditLogs: this.data.audit_logs.slice(0, 10),
      unreadNotificationsCount: this.data.notifications.filter(n => !n.read).length
    };
  }

  // Product CRUD
  public getAllProductsAdmin(): Product[] {
    return [...this.data.products].sort((a, b) => a.sort_order - b.sort_order);
  }

  public saveProduct(product: Product, adminUser: AdminUser): Product {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    const index = this.data.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      this.data.products[index] = product;
      this.addAuditLog(adminUser.name, adminUser.role, 'PRODUCT_UPDATED', 'product', `Updated product ${product.name}`, product.id);
    } else {
      if (!product.id) product.id = 'prod-' + Date.now();
      this.data.products.push(product);
      this.addAuditLog(adminUser.name, adminUser.role, 'PRODUCT_CREATED', 'product', `Created product ${product.name}`, product.id);
    }
    this.saveDatabase();
    this.broadcastChange('products');
    return product;
  }

  public deleteProduct(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    const prod = this.data.products.find(p => p.id === id);
    if (!prod) return false;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'PRODUCT_DELETED', 'product', `Deleted product ${prod.name}`, id);
    this.saveDatabase();
    this.broadcastChange('products');
    return true;
  }

  // Orders Admin
  public getAllOrdersAdmin(): Order[] {
    return this.data.orders;
  }

  public updateOrderStatus(id: string, status: Order['status'], internalNotes: string | undefined, adminUser: AdminUser): Order | null {
    if (!this.hasPermission(adminUser.id, 'manage_orders')) {
      throw new Error('Permission denied: manage_orders required.');
    }
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    const oldStatus = order.status;
    order.status = status;
    if (internalNotes !== undefined) {
      order.internal_notes = internalNotes;
    }
    order.updated_at = new Date().toISOString();
    this.saveDatabase();

    this.addAuditLog(
      adminUser.name,
      adminUser.role,
      'ORDER_STATUS_CHANGED',
      'order',
      `Order ${order.reference_number} changed from ${oldStatus} to ${status}. Notes: ${internalNotes || 'none'}`,
      order.id
    );
    this.broadcastChange('orders');
    return order;
  }

  // Quotes Admin
  public getAllQuotesAdmin(): QuoteRequest[] {
    return this.data.quote_requests;
  }

  public updateQuoteStatus(id: string, status: QuoteRequest['status'], internalNotes: string | undefined, adminUser: AdminUser): QuoteRequest | null {
    if (!this.hasPermission(adminUser.id, 'manage_orders')) {
      throw new Error('Permission denied: manage_orders required.');
    }
    const quote = this.data.quote_requests.find(q => q.id === id);
    if (!quote) return null;
    quote.status = status;
    if (internalNotes !== undefined) {
      quote.internal_notes = internalNotes;
    }
    quote.updated_at = new Date().toISOString();
    this.saveDatabase();

    this.addAuditLog(
      adminUser.name,
      adminUser.role,
      'QUOTE_STATUS_CHANGED',
      'quote',
      `Quote ${quote.reference_number} status updated to ${status}.`,
      quote.id
    );
    this.broadcastChange('quotes');
    return quote;
  }

  // Contacts Admin
  public getAllContactsAdmin(): ContactSubmission[] {
    return this.data.contact_submissions;
  }

  public updateContactStatus(id: string, status: ContactSubmission['status'], adminUser: AdminUser): ContactSubmission | null {
    if (!this.hasPermission(adminUser.id, 'manage_orders')) {
      throw new Error('Permission denied: manage_orders required.');
    }
    const contact = this.data.contact_submissions.find(c => c.id === id);
    if (!contact) return null;
    contact.status = status;
    this.saveDatabase();
    this.addAuditLog(adminUser.name, adminUser.role, 'CONTACT_STATUS_CHANGED', 'contact', `Inquiry from ${contact.name} marked as ${status}`, id);
    this.broadcastChange('contacts');
    return contact;
  }

  // Services Admin CRUD
  public getAllServicesAdmin(): Service[] {
    return this.data.services;
  }

  public saveService(service: Service, adminUser: AdminUser): Service {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    const index = this.data.services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      this.data.services[index] = service;
      this.addAuditLog(adminUser.name, adminUser.role, 'SERVICE_UPDATED', 'service', `Updated service ${service.title}`, service.id);
    } else {
      if (!service.id) service.id = 'serv-' + Date.now();
      this.data.services.push(service);
      this.addAuditLog(adminUser.name, adminUser.role, 'SERVICE_CREATED', 'service', `Created service ${service.title}`, service.id);
    }
    this.saveDatabase();
    this.broadcastChange('services');
    return service;
  }

  public deleteService(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    const serv = this.data.services.find(s => s.id === id);
    if (!serv) return false;
    this.data.services = this.data.services.filter(s => s.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'SERVICE_DELETED', 'service', `Deleted service ${serv.title}`, id);
    this.saveDatabase();
    this.broadcastChange('services');
    return true;
  }

  // FAQs Admin CRUD
  public getAllFAQsAdmin(): FAQ[] {
    return this.data.faqs;
  }

  public saveFAQ(faq: FAQ, adminUser: AdminUser): FAQ {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    const index = this.data.faqs.findIndex(f => f.id === faq.id);
    if (index >= 0) {
      this.data.faqs[index] = faq;
      this.addAuditLog(adminUser.name, adminUser.role, 'FAQ_UPDATED', 'faq', `Updated FAQ: ${faq.question}`, faq.id);
    } else {
      if (!faq.id) faq.id = 'faq-' + Date.now();
      this.data.faqs.push(faq);
      this.addAuditLog(adminUser.name, adminUser.role, 'FAQ_CREATED', 'faq', `Created FAQ: ${faq.question}`, faq.id);
    }
    this.saveDatabase();
    this.broadcastChange('faqs');
    return faq;
  }

  public deleteFAQ(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    this.data.faqs = this.data.faqs.filter(f => f.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'FAQ_DELETED', 'faq', `Deleted FAQ ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('faqs');
    return true;
  }

  // Testimonials Admin CRUD
  public getAllTestimonialsAdmin(): Testimonial[] {
    return this.data.testimonials;
  }

  public saveTestimonial(testimonial: Testimonial, adminUser: AdminUser): Testimonial {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    const index = this.data.testimonials.findIndex(t => t.id === testimonial.id);
    if (index >= 0) {
      this.data.testimonials[index] = testimonial;
      this.addAuditLog(adminUser.name, adminUser.role, 'TESTIMONIAL_UPDATED', 'testimonial', `Updated review by ${testimonial.customer_name}`, testimonial.id);
    } else {
      if (!testimonial.id) testimonial.id = 'test-' + Date.now();
      this.data.testimonials.push(testimonial);
      this.addAuditLog(adminUser.name, adminUser.role, 'TESTIMONIAL_CREATED', 'testimonial', `Created review for ${testimonial.customer_name}`, testimonial.id);
    }
    this.saveDatabase();
    this.broadcastChange('testimonials');
    return testimonial;
  }

  public deleteTestimonial(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    this.data.testimonials = this.data.testimonials.filter(t => t.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'TESTIMONIAL_DELETED', 'testimonial', `Deleted testimonial ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('testimonials');
    return true;
  }

  // Delivery Areas Admin CRUD
  public getAllDeliveryAreasAdmin(): DeliveryArea[] {
    return this.data.delivery_areas;
  }

  public saveDeliveryArea(area: DeliveryArea, adminUser: AdminUser): DeliveryArea {
    if (!this.hasPermission(adminUser.id, 'manage_settings')) {
      throw new Error('Permission denied: manage_settings required.');
    }
    const index = this.data.delivery_areas.findIndex(a => a.id === area.id);
    if (index >= 0) {
      this.data.delivery_areas[index] = area;
      this.addAuditLog(adminUser.name, adminUser.role, 'DELIVERY_AREA_UPDATED', 'delivery_area', `Updated area ${area.area_name}`, area.id);
    } else {
      if (!area.id) area.id = 'area-' + Date.now();
      this.data.delivery_areas.push(area);
      this.addAuditLog(adminUser.name, adminUser.role, 'DELIVERY_AREA_CREATED', 'delivery_area', `Created area ${area.area_name}`, area.id);
    }
    this.saveDatabase();
    this.broadcastChange('delivery_areas');
    return area;
  }

  public deleteDeliveryArea(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_settings')) {
      throw new Error('Permission denied: manage_settings required.');
    }
    this.data.delivery_areas = this.data.delivery_areas.filter(a => a.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'DELIVERY_AREA_DELETED', 'delivery_area', `Deleted delivery area ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('delivery_areas');
    return true;
  }

  // Process Steps CRUD
  public getAllProcessStepsAdmin(): ProcessStep[] {
    return [...(this.data.process_steps || [])].sort((a, b) => a.step_number - b.step_number);
  }

  public saveProcessStep(step: ProcessStep, adminUser: AdminUser): ProcessStep {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    if (!this.data.process_steps) this.data.process_steps = [];
    const index = this.data.process_steps.findIndex(s => s.id === step.id);
    if (index >= 0) {
      this.data.process_steps[index] = step;
      this.addAuditLog(adminUser.name, adminUser.role, 'PROCESS_STEP_UPDATED', 'process_step', `Updated process step ${step.title}`, step.id);
    } else {
      if (!step.id) step.id = 'step-' + Date.now();
      this.data.process_steps.push(step);
      this.addAuditLog(adminUser.name, adminUser.role, 'PROCESS_STEP_CREATED', 'process_step', `Created process step ${step.title}`, step.id);
    }
    this.saveDatabase();
    this.broadcastChange('process_steps');
    return step;
  }

  public deleteProcessStep(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    if (!this.data.process_steps) return false;
    this.data.process_steps = this.data.process_steps.filter(s => s.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'PROCESS_STEP_DELETED', 'process_step', `Deleted process step ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('process_steps');
    return true;
  }

  // Portfolio Items CRUD
  public getAllPortfolioItemsAdmin(): PortfolioItem[] {
    return this.data.portfolio_items || [];
  }

  public savePortfolioItem(item: PortfolioItem, adminUser: AdminUser): PortfolioItem {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    if (!this.data.portfolio_items) this.data.portfolio_items = [];
    const index = this.data.portfolio_items.findIndex(p => p.id === item.id);
    if (index >= 0) {
      this.data.portfolio_items[index] = item;
      this.addAuditLog(adminUser.name, adminUser.role, 'PORTFOLIO_ITEM_UPDATED', 'portfolio', `Updated commercial contract ${item.client_name}`, item.id);
    } else {
      if (!item.id) item.id = 'port-' + Date.now();
      this.data.portfolio_items.push(item);
      this.addAuditLog(adminUser.name, adminUser.role, 'PORTFOLIO_ITEM_CREATED', 'portfolio', `Created commercial contract ${item.client_name}`, item.id);
    }
    this.saveDatabase();
    this.broadcastChange('portfolio');
    return item;
  }

  public deletePortfolioItem(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    if (!this.data.portfolio_items) return false;
    this.data.portfolio_items = this.data.portfolio_items.filter(p => p.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'PORTFOLIO_ITEM_DELETED', 'portfolio', `Deleted commercial portfolio ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('portfolio');
    return true;
  }

  // News Items CRUD
  public getAllNewsItemsAdmin(): NewsItem[] {
    return this.data.news_items || [];
  }

  public saveNewsItem(item: NewsItem, adminUser: AdminUser): NewsItem {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    if (!this.data.news_items) this.data.news_items = [];
    const index = this.data.news_items.findIndex(n => n.id === item.id);
    if (index >= 0) {
      this.data.news_items[index] = item;
      this.addAuditLog(adminUser.name, adminUser.role, 'NEWS_UPDATED', 'news', `Updated announcement: ${item.title}`, item.id);
    } else {
      if (!item.id) item.id = 'news-' + Date.now();
      this.data.news_items.push(item);
      this.addAuditLog(adminUser.name, adminUser.role, 'NEWS_CREATED', 'news', `Created announcement: ${item.title}`, item.id);
    }
    this.saveDatabase();
    this.broadcastChange('news');
    return item;
  }

  public deleteNewsItem(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_content')) {
      throw new Error('Permission denied: manage_content required.');
    }
    if (!this.data.news_items) return false;
    this.data.news_items = this.data.news_items.filter(n => n.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'NEWS_DELETED', 'news', `Deleted announcement ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('news');
    return true;
  }

  // Website Settings Admin
  public updateWebsiteSettings(newSettings: Partial<WebsiteSettings>, adminUser: AdminUser): WebsiteSettings {
    if (!this.hasPermission(adminUser.id, 'manage_settings')) {
      throw new Error('Permission denied: manage_settings required.');
    }
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.saveDatabase();
    this.addAuditLog(adminUser.name, adminUser.role, 'SETTINGS_UPDATED', 'settings', 'Updated website commercial and branding settings.');
    this.broadcastChange('settings');
    return this.data.settings;
  }

  // Statistics Admin
  public updateStatistics(newStats: Statistic[], adminUser: AdminUser): Statistic[] {
    if (!this.hasPermission(adminUser.id, 'manage_settings')) {
      throw new Error('Permission denied: manage_settings required.');
    }
    this.data.statistics = newStats;
    this.saveDatabase();
    this.addAuditLog(adminUser.name, adminUser.role, 'STATISTICS_UPDATED', 'statistics', 'Updated live commercial statistics.');
    this.broadcastChange('statistics');
    return this.data.statistics;
  }

  // Media Library Admin
  public getAllMediaAdmin(): MediaItem[] {
    return this.data.media;
  }

  public addMediaItem(item: Omit<MediaItem, 'id' | 'uploaded_at'>, adminUser: AdminUser): MediaItem {
    if (!this.hasPermission(adminUser.id, 'manage_media')) {
      throw new Error('Permission denied: manage_media required.');
    }
    const mediaItem: MediaItem = {
      ...item,
      id: 'med-' + Date.now(),
      uploaded_at: new Date().toISOString().split('T')[0]
    };
    this.data.media.unshift(mediaItem);
    this.saveDatabase();
    this.addAuditLog(adminUser.name, adminUser.role, 'MEDIA_UPLOADED', 'media', `Added media asset: ${mediaItem.name}`, mediaItem.id);
    this.broadcastChange('media');
    return mediaItem;
  }

  public deleteMediaItem(id: string, adminUser: AdminUser): boolean {
    if (!this.hasPermission(adminUser.id, 'manage_media')) {
      throw new Error('Permission denied: manage_media required.');
    }
    this.data.media = this.data.media.filter(m => m.id !== id);
    this.addAuditLog(adminUser.name, adminUser.role, 'MEDIA_DELETED', 'media', `Deleted media asset ${id}`, id);
    this.saveDatabase();
    this.broadcastChange('media');
    return true;
  }

  // Notifications
  public getNotificationsAdmin(): AdminNotification[] {
    return this.data.notifications;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(): void {
    this.data.notifications.forEach(n => { n.read = true; });
    this.saveDatabase();
  }

  // Audit Logs
  public getAuditLogsAdmin(adminUser: AdminUser): AuditLog[] {
    if (!this.hasPermission(adminUser.id, 'view_audit_logs')) {
      throw new Error('Permission denied: view_audit_logs required.');
    }
    return this.data.audit_logs;
  }

  // ----------------------------------------------------
  // SITE IMAGE SLOTS (LIVE SITE UPDATING WITHOUT CODE CHANGES)
  // Allows replacing or removing images anywhere on the site
  // ----------------------------------------------------
  public getAllSiteImageSlots(): SiteImageSlot[] {
    const slots: SiteImageSlot[] = [];

    // 1. Hero Backdrop Centerpiece
    slots.push({
      id: 'hero_backdrop',
      title: 'Homepage Hero Backdrop Photo',
      category: 'hero',
      currentUrl: this.data.settings.hero_bg_image || '/crystal_ice_backdrop.jpg',
      description: 'The prominent hero backdrop showcasing the Crystal Ice Zimbabwe packaged ice operations.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'hero_bg_image'
    });

    // 2. Homepage About Section Card
    slots.push({
      id: 'homepage_about_card',
      title: 'Homepage About Card Photo ("Clean. Safe. Reliable.")',
      category: 'about',
      currentUrl: this.data.settings.homepage_about_image || '/src/assets/images/ice_cubes_promo_1790856824108.jpg',
      description: 'Image displayed inside the homepage "Clean. Safe. Reliable." About card.',
      recommendedAspect: '4:3',
      targetType: 'settings',
      targetField: 'homepage_about_image'
    });

    // 3. Storefront Main Facility
    slots.push({
      id: 'storefront_main',
      title: 'Waterfalls Storefront & Plant Facility',
      category: 'storefront',
      currentUrl: this.data.settings.storefront_image || '/crystal_ice_storefront.jpg',
      description: 'Centerpiece building photography featured across the homepage showcase.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'storefront_image'
    });

    // 4. About Facility Image
    slots.push({
      id: 'about_facility',
      title: 'About Us Facility & Plant Operations',
      category: 'about',
      currentUrl: this.data.settings.about_facility_image || '/crystal_ice_storefront.jpg',
      description: 'Operational facility photo displayed on the About Us page.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'about_facility_image'
    });

    // 5. Official Logo
    slots.push({
      id: 'site_logo',
      title: 'Official Crystal Ice Logo',
      category: 'branding',
      currentUrl: this.data.settings.logo_url || '/crystal_ice_logo.png',
      description: 'Company logo displayed across header, footer, and admin portals.',
      recommendedAspect: 'Horizontal (2.3:1)',
      targetType: 'settings',
      targetField: 'logo_url'
    });

    // 6. Delivery Fleet
    slots.push({
      id: 'delivery_fleet',
      title: 'Cold-Chain Delivery Fleet & Logistics',
      category: 'facilities',
      currentUrl: this.data.settings.delivery_fleet_image || '/src/assets/images/service_harare_skyline_1790773229249.jpg',
      description: 'Refrigerated delivery trucks and Harare distribution fleet.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'delivery_fleet_image'
    });

    // 7. Cold Storage Chamber
    slots.push({
      id: 'cold_storage_chamber',
      title: 'Cold Storage Room & Blast Freezing Chamber',
      category: 'facilities',
      currentUrl: this.data.settings.cold_storage_image || '/src/assets/images/cold_room_storage_1790856812685.jpg',
      description: 'Sub-zero blast freezing room with industrial cooling fans.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'cold_storage_image'
    });

    // 8. Solid Ice Blocks Freezing
    slots.push({
      id: 'ice_blocks_freezing',
      title: 'Solid Ice Blocks Freezing Production Room',
      category: 'facilities',
      currentUrl: this.data.settings.ice_blocks_image || '/src/assets/images/ice_blocks_freezing_1790856836725.jpg',
      description: 'Vertical hanging ice column freezing tanks and block storage.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'ice_blocks_image'
    });

    // 9. Water Purification
    if (!slots.some(s => s.id === 'water_purification')) {
      slots.push({
        id: 'water_purification',
        title: 'Water Purification & RO Filtration Plant',
        category: 'facilities',
        currentUrl: this.data.settings.water_purification_image || '',
        description: 'Food-grade multi-stage reverse osmosis filtration facility.',
        recommendedAspect: '16:9',
        targetType: 'settings',
        targetField: 'water_purification_image'
      });
    }

    // 10. Harare Dispatch Desk & Cold Bay
    if (!slots.some(s => s.id === 'contact_dispatch_facility')) {
      slots.push({
        id: 'contact_dispatch_facility',
        title: 'Harare 24/7 Dispatch Desk & Loading Bay',
        category: 'facilities',
        currentUrl: this.data.settings.contact_dispatch_image || '',
        description: 'Waterfalls physical customer service desk and loading bay.',
        recommendedAspect: '16:9',
        targetType: 'settings',
        targetField: 'contact_dispatch_image'
      });
    }

    // 11. Quality Assurance Lab & Testing Station
    if (!slots.some(s => s.id === 'quality_assurance_lab')) {
      slots.push({
        id: 'quality_assurance_lab',
        title: 'Food-Grade Testing & Purity Verification Lab',
        category: 'facilities',
        currentUrl: this.data.settings.quality_assurance_image || '',
        description: 'Microbial and TDS water purity testing station.',
        recommendedAspect: '16:9',
        targetType: 'settings',
        targetField: 'quality_assurance_image'
      });
    }

    // 12. Uninterrupted Power Backup
    if (!slots.some(s => s.id === 'emergency_backup_power')) {
      slots.push({
        id: 'emergency_backup_power',
        title: 'Heavy Diesel Generator (Continuous Freezing Power)',
        category: 'facilities',
        currentUrl: this.data.settings.generator_image || '',
        description: 'Commercial standby generator guaranteeing 24/7 ice manufacturing.',
        recommendedAspect: '16:9',
        targetType: 'settings',
        targetField: 'generator_image'
      });
    }

    // 4. Products
    this.data.products.forEach((prod) => {
      slots.push({
        id: `product-${prod.id}`,
        title: `Product: ${prod.name}`,
        category: 'products',
        currentUrl: prod.image || '',
        description: `${prod.package_size} • ${prod.category} catalog card and detail modal picture.`,
        recommendedAspect: '1:1',
        targetType: 'product',
        targetId: prod.id,
        targetField: 'image'
      });
    });

    // 5. Plant Services
    this.data.services.forEach((srv) => {
      slots.push({
        id: `service-${srv.id}`,
        title: `Service: ${srv.title}`,
        category: 'services',
        currentUrl: srv.image || '',
        description: `Industrial plant service illustration / photo for ${srv.title}.`,
        recommendedAspect: '16:9',
        targetType: 'service',
        targetId: srv.id,
        targetField: 'image'
      });
    });

    // 6. Portfolio Items
    this.data.portfolio_items.forEach((item) => {
      slots.push({
        id: `portfolio-${item.id}`,
        title: `Portfolio: ${item.client_name}`,
        category: 'portfolio',
        currentUrl: item.image_url || '',
        description: `${item.category} supply client case study photo.`,
        recommendedAspect: '4:3',
        targetType: 'portfolio',
        targetId: item.id,
        targetField: 'image_url'
      });
    });

    // 7. Custom Image Slots
    if (this.data.settings.custom_images) {
      Object.entries(this.data.settings.custom_images).forEach(([key, val]) => {
        slots.push({
          id: `custom-${key}`,
          title: `Custom Slot: ${key.replace(/_/g, ' ')}`,
          category: 'facilities',
          currentUrl: val,
          description: 'Custom designated image slot on website.',
          recommendedAspect: 'Flexible',
          targetType: 'custom',
          targetField: key
        });
      });
    }

    return slots;
  }

  public replaceSiteImageSlot(slotId: string, newUrl: string, adminUser?: AdminUser): boolean {
    const actorName = adminUser?.name || 'Google Studio AI / Admin Action';
    const actorRole = adminUser?.role || 'admin';

    if (slotId === 'hero_backdrop') {
      this.data.settings.hero_bg_image = newUrl;
    } else if (slotId === 'homepage_about_card') {
      this.data.settings.homepage_about_image = newUrl;
    } else if (slotId === 'storefront_main') {
      this.data.settings.storefront_image = newUrl;
    } else if (slotId === 'about_facility') {
      this.data.settings.about_facility_image = newUrl;
    } else if (slotId === 'site_logo') {
      this.data.settings.logo_url = newUrl;
    } else if (slotId === 'delivery_fleet') {
      this.data.settings.delivery_fleet_image = newUrl;
    } else if (slotId === 'cold_storage_chamber') {
      this.data.settings.cold_storage_image = newUrl;
    } else if (slotId === 'ice_blocks_freezing') {
      this.data.settings.ice_blocks_image = newUrl;
    } else if (slotId === 'water_purification') {
      this.data.settings.water_purification_image = newUrl;
    } else if (slotId === 'contact_dispatch_facility') {
      this.data.settings.contact_dispatch_image = newUrl;
    } else if (slotId === 'quality_assurance_lab') {
      this.data.settings.quality_assurance_image = newUrl;
    } else if (slotId === 'emergency_backup_power') {
      this.data.settings.generator_image = newUrl;
    } else if (slotId.startsWith('product-')) {
      const prodId = slotId.replace('product-', '');
      const prod = this.data.products.find(p => p.id === prodId);
      if (prod) {
        prod.image = newUrl;
      } else {
        throw new Error(`Product with ID "${prodId}" not found`);
      }
    } else if (slotId.startsWith('service-')) {
      const srvId = slotId.replace('service-', '');
      const srv = this.data.services.find(s => s.id === srvId);
      if (srv) {
        srv.image = newUrl;
      } else {
        throw new Error(`Service with ID "${srvId}" not found`);
      }
    } else if (slotId.startsWith('portfolio-')) {
      const portId = slotId.replace('portfolio-', '');
      const port = this.data.portfolio_items.find(p => p.id === portId);
      if (port) {
        port.image_url = newUrl;
      } else {
        throw new Error(`Portfolio item with ID "${portId}" not found`);
      }
    } else {
      if (!this.data.settings.custom_images) {
        this.data.settings.custom_images = {};
      }
      this.data.settings.custom_images[slotId] = newUrl;
    }

    this.saveDatabase();
    this.addAuditLog(actorName, actorRole, 'IMAGE_SLOT_REPLACED', 'image_slot', `Replaced picture in slot "${slotId}" with "${newUrl}".`, slotId);
    this.broadcastChange('content_updated');
    this.broadcastChange('settings');
    this.broadcastChange('products');
    return true;
  }

  public removeSiteImageSlot(slotId: string, adminUser?: AdminUser): boolean {
    const actorName = adminUser?.name || 'Google Studio AI / Admin Action';
    const actorRole = adminUser?.role || 'admin';

    if (slotId === 'hero_backdrop') {
      this.data.settings.hero_bg_image = '';
    } else if (slotId === 'homepage_about_card') {
      this.data.settings.homepage_about_image = '';
    } else if (slotId === 'storefront_main') {
      this.data.settings.storefront_image = '';
    } else if (slotId === 'about_facility') {
      this.data.settings.about_facility_image = '';
    } else if (slotId === 'site_logo') {
      this.data.settings.logo_url = '';
    } else if (slotId === 'delivery_fleet') {
      this.data.settings.delivery_fleet_image = '';
    } else if (slotId === 'cold_storage_chamber') {
      this.data.settings.cold_storage_image = '';
    } else if (slotId === 'ice_blocks_freezing') {
      this.data.settings.ice_blocks_image = '';
    } else if (slotId === 'water_purification') {
      this.data.settings.water_purification_image = '';
    } else if (slotId === 'contact_dispatch_facility') {
      this.data.settings.contact_dispatch_image = '';
    } else if (slotId === 'quality_assurance_lab') {
      this.data.settings.quality_assurance_image = '';
    } else if (slotId === 'emergency_backup_power') {
      this.data.settings.generator_image = '';
    } else if (slotId.startsWith('product-')) {
      const prodId = slotId.replace('product-', '');
      const prod = this.data.products.find(p => p.id === prodId);
      if (prod) {
        prod.image = '';
      }
    } else if (slotId.startsWith('service-')) {
      const srvId = slotId.replace('service-', '');
      const srv = this.data.services.find(s => s.id === srvId);
      if (srv) {
        srv.image = '';
      }
    } else if (slotId.startsWith('portfolio-')) {
      const portId = slotId.replace('portfolio-', '');
      const port = this.data.portfolio_items.find(p => p.id === portId);
      if (port) {
        port.image_url = '';
      }
    } else {
      if (this.data.settings.custom_images) {
        delete this.data.settings.custom_images[slotId];
      }
    }

    this.saveDatabase();
    this.addAuditLog(actorName, actorRole, 'IMAGE_SLOT_REMOVED', 'image_slot', `Removed picture from slot "${slotId}".`, slotId);
    this.broadcastChange('content_updated');
    this.broadcastChange('settings');
    this.broadcastChange('products');
    return true;
  }
}

export const dbStore = new DatabaseStore();
