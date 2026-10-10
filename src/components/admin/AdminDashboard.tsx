import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  ShoppingBag,
  FileText,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  AlertCircle,
  Phone,
  Mail,
  Building,
  RefreshCw,
  Eye,
  ArrowLeft,
  Users,
  Layers,
  HelpCircle,
  Star,
  MapPin,
  Bookmark,
  UploadCloud,
  ImageIcon,
  Camera,
  ArrowUpDown,
  RotateCcw,
  Archive,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import {
  Order,
  Quote,
  QuoteStatus,
  MonthlyQuoteRecord,
  ContactMessage,
  Product,
  WebsiteSettings,
  AuditLog,
  AdminUser,
  SystemRole
} from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { UsersTab } from './tabs/UsersTab.tsx';
import { ServicesTab } from './tabs/ServicesTab.tsx';
import { FaqsTab } from './tabs/FaqsTab.tsx';
import { DeliveryAreasTab } from './tabs/DeliveryAreasTab.tsx';
import { TestimonialsTab } from './tabs/TestimonialsTab.tsx';
import { ProcessPortfolioNewsTab } from './tabs/ProcessPortfolioNewsTab.tsx';
import { MediaLibraryTab } from './tabs/MediaLibraryTab.tsx';
import { ExactImageUploadInput } from './ExactImageUploadInput.tsx';
import { LiveImageSlotManagerModal } from './LiveImageSlotManagerModal.tsx';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshData: () => void;
  settings: WebsiteSettings;
  onOpenLiveImageManager?: (slotId?: string) => void;
}

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'quotes'
  | 'messages'
  | 'products'
  | 'services'
  | 'faqs'
  | 'testimonials'
  | 'areas'
  | 'content'
  | 'media'
  | 'users'
  | 'settings'
  | 'audit';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onRefreshData,
  settings: initialSettings
}) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('arcticpure_admin_token'));
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('arcticpure_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Bootstrap state
  const [bootstrapAvailable, setBootstrapAvailable] = useState<boolean | null>(null);
  const [bootstrapName, setBootstrapName] = useState('');
  const [bootstrapEmail, setBootstrapEmail] = useState('');
  const [bootstrapPassword, setBootstrapPassword] = useState('');
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Subtab
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');

  // Exact Image Slot Manager States
  const [isSlotManagerOpen, setIsSlotManagerOpen] = useState(false);
  const [selectedSlotForManager, setSelectedSlotForManager] = useState<string | undefined>(undefined);

  // Data states
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(initialSettings);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // Quote Management, Date Sorting & Monthly Records States
  const [quoteViewMode, setQuoteViewMode] = useState<'active' | 'archived' | 'all'>('active');
  const [quoteSortOrder, setQuoteSortOrder] = useState<'desc' | 'asc'>('desc');
  const [quoteSelectedMonth, setQuoteSelectedMonth] = useState<string>('all');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [quoteSearchQuery, setQuoteSearchQuery] = useState<string>('');
  const [confirmArchiveQuoteId, setConfirmArchiveQuoteId] = useState<string | null>(null);
  const [isProcessingQuoteId, setIsProcessingQuoteId] = useState<string | null>(null);

  // Order Management, Date Sorting & Monthly Records States
  const [orderViewMode, setOrderViewMode] = useState<'active' | 'archived' | 'all'>('active');
  const [orderSortOrder, setOrderSortOrder] = useState<'desc' | 'asc'>('desc');
  const [orderSelectedMonth, setOrderSelectedMonth] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [confirmArchiveOrderId, setConfirmArchiveOrderId] = useState<string | null>(null);
  const [isProcessingOrderId, setIsProcessingOrderId] = useState<string | null>(null);

  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardSuccess, setDashboardSuccess] = useState<string | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);

  // Role permissions
  const userRole: SystemRole = (user?.role as SystemRole) || 'staff';
  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';
  const isEditor = userRole === 'editor';

  const canManageOrders = isAdmin || isStaff;
  const canManageQuotes = isAdmin || isStaff;
  const canManageMessages = isAdmin || isStaff;
  const canManageContent = isAdmin || isEditor;
  const canManageUsers = isAdmin;
  const canManageSettings = isAdmin || isEditor;
  const canViewAudit = isAdmin || isStaff;

  // Check bootstrap status on mount if not authenticated
  useEffect(() => {
    if (!token) {
      api.getBootstrapStatus()
        .then((res) => setBootstrapAvailable(res.bootstrap_available))
        .catch(() => setBootstrapAvailable(false));
    }
  }, [token]);

  // Edit / Add Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Craft Cocktail Ice',
    description: '',
    package_size: 'Pack of 12',
    price: 18,
    price_display: '$18.00',
    min_order_qty: 1,
    availability: 'in_stock',
    dimensions: '2" x 2" x 2"',
    melt_rate: 'Ultra Slow (~40 minutes in 80-proof spirit)',
    image: '/crystal_ice_storefront.jpg',
    is_featured: true,
    features: ['7-stage RO filtered', 'Directional slow-freeze', 'Dense structure']
  });

  // Fetch admin datasets when authenticated
  const loadAdminData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      setDashboardError(null);
      const [ordersRes, quotesRes, messagesRes, productsRes, auditRes] = await Promise.all([
        api.getAdminOrders(),
        api.getAdminQuotes(),
        api.getAdminContactMessages(),
        api.getProducts(),
        api.getAdminAuditLogs()
      ]);
      setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes as any)?.orders || []);
      setQuotes(Array.isArray(quotesRes) ? quotesRes : (quotesRes as any)?.quotes || []);
      setMessages(Array.isArray(messagesRes) ? messagesRes : (messagesRes as any)?.messages || []);
      setProducts(Array.isArray(productsRes) ? productsRes : (productsRes as any)?.products || []);
      setAuditLogs(Array.isArray(auditRes) ? auditRes : (auditRes as any)?.logs || []);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized') || err.message?.includes('token') || err.message?.includes('Session expired')) {
        handleLogout();
      } else {
        setDashboardError(`Sync error: ${err.message || 'Failed to refresh latest records from server'}`);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin(username, password);
      localStorage.setItem('arcticpure_admin_token', res.token);
      localStorage.setItem('arcticpure_admin_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      onRefreshData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setToken(null);
    setUser(null);
  };

  // Canonical Status options as chosen by user:
  // Pending Review, In Review, Quoted, Accepted, and Rejected, plus delivery fulfillment and Archived
  const CANONICAL_STATUS_OPTIONS = [
    'Pending Review',
    'In Review',
    'Quoted',
    'Accepted',
    'Rejected'
  ];

  // Helper to normalize any existing legacy status to canonical display label
  const normalizeOrderStatus = (status: string | undefined): string => {
    if (!status) return 'Pending Review';
    const s = status.trim().toLowerCase();
    if (s === 'pending' || s === 'new' || s === 'pending review') return 'Pending Review';
    if (s === 'reviewed' || s === 'contacted' || s === 'in review' || s === 'in_review') return 'In Review';
    if (s === 'quoted' || s === 'proposal_sent' || s === 'proposal sent') return 'Quoted';
    if (s === 'accepted') return 'Accepted';
    if (s === 'rejected') return 'Rejected';
    if (s === 'archived' || s === 'deleted') return 'Archived';
    if (s === 'confirmed') return 'Confirmed';
    if (s === 'out_for_delivery' || s === 'out for delivery') return 'Out for Delivery';
    if (s === 'delivered' || s === 'completed') return 'Delivered';
    if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
    return status;
  };

  // Order status updater
  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    setIsProcessingOrderId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setDashboardSuccess(`Order status updated to "${newStatus}"`);
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to update order status: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    } finally {
      setIsProcessingOrderId(null);
    }
  };

  // Archive order (acts as delete button but preserves in records)
  const handleArchiveOrder = async (orderId: string) => {
    setIsProcessingOrderId(orderId);
    try {
      await api.archiveOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Archived' as any } : o))
      );
      setConfirmArchiveOrderId(null);
      setDashboardSuccess('Order archived to records successfully');
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to archive order: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    } finally {
      setIsProcessingOrderId(null);
    }
  };

  // Restore order from archived records back to active queue
  const handleRestoreOrder = async (orderId: string) => {
    setIsProcessingOrderId(orderId);
    try {
      await api.restoreOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Pending Review' as any } : o))
      );
      setDashboardSuccess('Order restored to active queue (Pending Review)');
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to restore order: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    } finally {
      setIsProcessingOrderId(null);
    }
  };

  // Canonical Quote Status options as chosen by user:
  // Pending Review, In Review, Quoted, Accepted, and Rejected, plus Archived
  const CANONICAL_QUOTE_STATUSES: QuoteStatus[] = [
    'Pending Review',
    'In Review',
    'Quoted',
    'Accepted',
    'Rejected'
  ];

  // Helper to normalize any existing legacy status to canonical display label
  const normalizeQuoteStatus = (status: string | undefined): QuoteStatus => {
    if (!status) return 'Pending Review';
    const s = status.trim().toLowerCase();
    if (s === 'pending' || s === 'new' || s === 'pending review') return 'Pending Review';
    if (s === 'reviewed' || s === 'contacted' || s === 'in review' || s === 'in_review') return 'In Review';
    if (s === 'quoted' || s === 'proposal_sent' || s === 'proposal sent') return 'Quoted';
    if (s === 'accepted') return 'Accepted';
    if (s === 'rejected') return 'Rejected';
    if (s === 'archived' || s === 'deleted') return 'Archived';
    return (status as QuoteStatus) || 'Pending Review';
  };

  const formatQuoteDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Date unknown';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return (
      d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) +
      ' · ' +
      d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    );
  };

  // Quote status updater
  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    setIsProcessingQuoteId(quoteId);
    try {
      await api.updateQuoteStatus(quoteId, newStatus);
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
      setDashboardSuccess(`Quote status updated to "${newStatus}"`);
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to update quote status: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    } finally {
      setIsProcessingQuoteId(null);
    }
  };

  // Archive quote (acts as delete button but preserves in records)
  const handleArchiveQuote = async (quoteId: string) => {
    setIsProcessingQuoteId(quoteId);
    try {
      await api.archiveQuote(quoteId);
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: 'Archived' } : q))
      );
      setConfirmArchiveQuoteId(null);
      setDashboardSuccess('Quote archived to records successfully');
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to archive quote: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    } finally {
      setIsProcessingQuoteId(null);
    }
  };

  // Restore quote from archived records back to active queue
  const handleRestoreQuote = async (quoteId: string) => {
    setIsProcessingQuoteId(quoteId);
    try {
      await api.restoreQuote(quoteId);
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: 'Pending Review' } : q))
      );
      setDashboardSuccess('Quote restored to active queue (Pending Review)');
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to restore quote: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    } finally {
      setIsProcessingQuoteId(null);
    }
  };

  // Dynamic monthly records calculations using dates quotes requested and amounts per month
  const monthlyQuoteRecords = React.useMemo(() => {
    const map: Record<string, MonthlyQuoteRecord> = {};

    quotes.forEach((q) => {
      let d = new Date(q.created_at);
      if (isNaN(d.getTime())) {
        d = new Date();
      }

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;
      const monthName = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      if (!map[monthKey]) {
        map[monthKey] = {
          monthKey,
          monthName,
          totalQuotes: 0,
          activeCount: 0,
          archivedCount: 0,
          pendingCount: 0,
          inReviewCount: 0,
          quotedCount: 0,
          acceptedCount: 0,
          rejectedCount: 0,
          firstDate: q.created_at,
          lastDate: q.created_at
        };
      }

      const record = map[monthKey];
      record.totalQuotes += 1;

      const norm = normalizeQuoteStatus(q.status);
      if (norm === 'Archived') {
        record.archivedCount += 1;
      } else {
        record.activeCount += 1;
      }

      if (norm === 'Pending Review') record.pendingCount += 1;
      else if (norm === 'In Review') record.inReviewCount += 1;
      else if (norm === 'Quoted') record.quotedCount += 1;
      else if (norm === 'Accepted') record.acceptedCount += 1;
      else if (norm === 'Rejected') record.rejectedCount += 1;

      if (q.created_at && (!record.firstDate || q.created_at < record.firstDate)) {
        record.firstDate = q.created_at;
      }
      if (q.created_at && (!record.lastDate || q.created_at > record.lastDate)) {
        record.lastDate = q.created_at;
      }
    });

    return Object.values(map).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [quotes]);

  // Filtered & sorted quotes
  const displayedQuotes = React.useMemo(() => {
    const list = quotes.filter((q) => {
      const norm = normalizeQuoteStatus(q.status);

      // View mode filter
      if (quoteViewMode === 'active' && norm === 'Archived') return false;
      if (quoteViewMode === 'archived' && norm !== 'Archived') return false;

      // Month filter
      if (quoteSelectedMonth !== 'all') {
        const d = new Date(q.created_at);
        if (!isNaN(d.getTime())) {
          const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (mKey !== quoteSelectedMonth) return false;
        }
      }

      // Status filter
      if (quoteStatusFilter !== 'all') {
        if (norm !== quoteStatusFilter) return false;
      }

      // Search query
      if (quoteSearchQuery.trim()) {
        const query = quoteSearchQuery.toLowerCase();
        const ref = (q.reference_number || '').toLowerCase();
        const name = (q.customer_name || '').toLowerCase();
        const biz = (q.business_name || '').toLowerCase();
        const email = (q.customer_email || '').toLowerCase();
        const phone = (q.customer_phone || '').toLowerCase();
        const service = (q.service_type || '').toLowerCase();
        const loc = (q.delivery_location || '').toLowerCase();
        if (
          !ref.includes(query) &&
          !name.includes(query) &&
          !biz.includes(query) &&
          !email.includes(query) &&
          !phone.includes(query) &&
          !service.includes(query) &&
          !loc.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });

    // Date sorting: newest vs oldest
    list.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime() || 0;
      const timeB = new Date(b.created_at).getTime() || 0;
      return quoteSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [quotes, quoteViewMode, quoteSelectedMonth, quoteStatusFilter, quoteSearchQuery, quoteSortOrder]);

  // Dynamic monthly records calculations for Orders & Inquiries using dates and amounts per month
  const monthlyOrderRecords = React.useMemo(() => {
    const map: Record<string, {
      monthKey: string;
      monthName: string;
      totalOrders: number;
      totalAmount: number;
      activeCount: number;
      archivedCount: number;
      acceptedCount: number;
      pendingCount: number;
    }> = {};

    orders.forEach((o) => {
      let d = new Date(o.created_at || o.preferred_date);
      if (isNaN(d.getTime())) {
        d = new Date();
      }

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;
      const monthName = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      if (!map[monthKey]) {
        map[monthKey] = {
          monthKey,
          monthName,
          totalOrders: 0,
          totalAmount: 0,
          activeCount: 0,
          archivedCount: 0,
          acceptedCount: 0,
          pendingCount: 0
        };
      }

      const record = map[monthKey];
      record.totalOrders += 1;
      record.totalAmount += (o.total_estimated_amount || 0);

      const norm = normalizeOrderStatus(o.status);
      if (norm === 'Archived') {
        record.archivedCount += 1;
      } else {
        record.activeCount += 1;
      }

      if (norm === 'Pending Review') record.pendingCount += 1;
      else if (norm === 'Accepted' || norm === 'Confirmed' || norm === 'Delivered') record.acceptedCount += 1;
    });

    return Object.values(map).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [orders]);

  // Filtered & sorted orders
  const displayedOrders = React.useMemo(() => {
    const list = orders.filter((o) => {
      const norm = normalizeOrderStatus(o.status);

      // View mode filter
      if (orderViewMode === 'active' && norm === 'Archived') return false;
      if (orderViewMode === 'archived' && norm !== 'Archived') return false;

      // Month filter
      if (orderSelectedMonth !== 'all') {
        const d = new Date(o.created_at || o.preferred_date);
        if (!isNaN(d.getTime())) {
          const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (mKey !== orderSelectedMonth) return false;
        }
      }

      // Status filter
      if (orderStatusFilter !== 'all') {
        if (norm !== orderStatusFilter) return false;
      }

      // Search query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const ref = (o.reference_number || '').toLowerCase();
        const name = (o.customer_name || '').toLowerCase();
        const biz = (o.business_name || '').toLowerCase();
        const phone = (o.customer_phone || '').toLowerCase();
        const email = (o.customer_email || '').toLowerCase();
        if (
          !ref.includes(q) &&
          !name.includes(q) &&
          !biz.includes(q) &&
          !phone.includes(q) &&
          !email.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });

    // Date sorting: newest vs oldest
    list.sort((a, b) => {
      const timeA = new Date(a.created_at || a.preferred_date).getTime() || 0;
      const timeB = new Date(b.created_at || b.preferred_date).getTime() || 0;
      return orderSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [orders, orderViewMode, orderSelectedMonth, orderStatusFilter, orderSearchQuery, orderSortOrder]);

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsForm);
      setSettingsSaveSuccess(true);
      setDashboardSuccess('Website settings saved successfully');
      onRefreshData();
      setTimeout(() => {
        setSettingsSaveSuccess(false);
        setDashboardSuccess(null);
      }, 3000);
    } catch (err: any) {
      setDashboardError('Failed to save settings: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        setDashboardSuccess('Product updated successfully');
      } else {
        await api.createProduct(productForm);
        setDashboardSuccess('Product created successfully');
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      loadAdminData();
      onRefreshData();
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to save product: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setConfirmDeleteProductId(null);
      setDashboardSuccess('Product removed successfully');
      onRefreshData();
      setTimeout(() => setDashboardSuccess(null), 3000);
    } catch (err: any) {
      setDashboardError('Failed to delete product: ' + err.message);
      setTimeout(() => setDashboardError(null), 4000);
    }
  };

  // LOGIN & BOOTSTRAP SCREEN
  if (!token) {
    if (bootstrapAvailable === true) {
      return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white text-center border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-cyan-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-['Outfit']">First-Time Master Admin Setup</h2>
              <p className="text-xs text-cyan-300 mt-1">
                Bootstrap Phase: Initialize Primary System Administrator
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Bootstrap Security:</strong> No administrator accounts currently exist. Once this initial master administrator is created, bootstrap initialization will permanently lock.
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoginError('');
                  setIsBootstrapping(true);
                  try {
                    const res = await api.bootstrapFirstAdmin({
                      name: bootstrapName,
                      email: bootstrapEmail,
                      password: bootstrapPassword
                    });
                    setToken(res.token);
                    setUser(res.user);
                    setBootstrapAvailable(false);
                    onRefreshData();
                  } catch (err: any) {
                    setLoginError(err.message || 'Bootstrap initialization failed');
                  } finally {
                    setIsBootstrapping(false);
                  }
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Master Administrator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bootstrapName}
                    onChange={(e) => setBootstrapName(e.target.value)}
                    placeholder="e.g. Lead Plant Operator"
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Email / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={bootstrapEmail}
                    onChange={(e) => setBootstrapEmail(e.target.value)}
                    placeholder="admin"
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Master Password
                  </label>
                  <input
                    type="password"
                    required
                    value={bootstrapPassword}
                    onChange={(e) => setBootstrapPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isBootstrapping}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isBootstrapping ? 'Locking Bootstrap...' : 'Initialize & Lock Admin'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white text-center border-b border-slate-800">
            <div className="flex justify-center mb-3">
              <img
                src="/crystal_ice_logo.png"
                alt="Crystal Ice Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h2 className="text-xl font-bold font-['Outfit']">Crystal Ice Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Waterfalls Plant & Dispatch Operations
            </p>
          </div>

          <div className="p-6">
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username or Email
                </label>
                <input
                  id="admin-username-input"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="admin or admin@crystalice.co.zw"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  id="admin-login-submit"
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex-1 py-3 px-4 bg-[#0265B5] hover:bg-[#004e8c] text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Verifying...' : 'Sign In to Admin Portal'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="text-center pt-2 text-[11px] text-slate-400">
                🔒 Private portal. Hidden on the public website.
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED-IN ADMIN DASHBOARD
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_estimated_amount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const pendingQuotes = quotes.filter((q) => normalizeQuoteStatus(q.status) === 'Pending Review');
  const unreadMessages = messages.filter((m) => !m.is_read);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
            title="Return to Public View"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Website</span>
          </button>
          <div className="h-5 w-px bg-slate-700" />
          <h1 className="text-base font-bold font-['Outfit'] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            Crystal Ice Operations Control
          </h1>
          <div className="flex items-center gap-1.5">
            <span
              className={`hidden md:inline text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                isAdmin
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : isStaff
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}
            >
              {isAdmin ? 'System Admin' : isStaff ? 'Operations Staff' : 'Content Editor'}
            </span>
            <span className="hidden lg:inline text-xs text-slate-400">
              ({user?.name || user?.email})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-exact-image-uploader-top-btn"
            type="button"
            onClick={() => {
              setSelectedSlotForManager(undefined);
              setIsSlotManagerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0265B5] hover:bg-[#005599] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Upload or replace pictures live on the website"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Exact Image Uploader</span>
          </button>

          <button
            onClick={loadAdminData}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-2 md:p-3 shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-1">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
              activeAdminTab === 'overview'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          {canManageOrders && (
            <button
              id="admin-tab-orders"
              onClick={() => setActiveAdminTab('orders')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-colors shrink-0 ${
                activeAdminTab === 'orders'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Orders</span>
              </div>
              {pendingOrders.length > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${activeAdminTab === 'orders' ? 'bg-white text-cyan-800' : 'bg-cyan-600 text-white'}`}>
                  {pendingOrders.length}
                </span>
              )}
            </button>
          )}

          {canManageQuotes && (
            <button
              id="admin-tab-quotes"
              onClick={() => setActiveAdminTab('quotes')}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-colors shrink-0 ${
                activeAdminTab === 'quotes'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Commercial Quotes</span>
              </div>
              {pendingQuotes.length > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${activeAdminTab === 'quotes' ? 'bg-white text-amber-800' : 'bg-amber-500 text-white'}`}>
                  {pendingQuotes.length}
                </span>
              )}
            </button>
          )}

          {canManageMessages && (
            <button
              id="admin-tab-messages"
              onClick={() => setActiveAdminTab('messages')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                activeAdminTab === 'messages'
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries & Messages</span>
              </div>
              {unreadMessages.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500 text-white rounded-full">
                  {unreadMessages.length}
                </span>
              )}
            </button>
          )}

          {canManageContent && (
            <>
              <div className="pt-2 pb-1 px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:block">
                Catalog & Content
              </div>

              <button
                id="admin-tab-products"
                onClick={() => setActiveAdminTab('products')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'products'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Product Catalogue</span>
                </div>
                <span className="text-[10px] text-slate-400">{products.length}</span>
              </button>

              <button
                id="admin-tab-services"
                onClick={() => setActiveAdminTab('services')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'services'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Plant Services</span>
                </div>
              </button>

              <button
                id="admin-tab-faqs"
                onClick={() => setActiveAdminTab('faqs')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'faqs'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>FAQs</span>
                </div>
              </button>

              <button
                id="admin-tab-testimonials"
                onClick={() => setActiveAdminTab('testimonials')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'testimonials'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Client Reviews</span>
                </div>
              </button>

              <button
                id="admin-tab-areas"
                onClick={() => setActiveAdminTab('areas')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'areas'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Zones</span>
                </div>
              </button>

              <button
                id="admin-tab-content"
                onClick={() => setActiveAdminTab('content')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'content'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>Operations & Process</span>
                </div>
              </button>

              <button
                id="admin-tab-media"
                onClick={() => setActiveAdminTab('media')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                  activeAdminTab === 'media'
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#0265B5]" />
                  <span>Exact Media Library</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  Lossless
                </span>
              </button>
            </>
          )}

          <div className="pt-2 pb-1 px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:block">
            Administration
          </div>

          {canManageUsers && (
            <button
              id="admin-tab-users"
              onClick={() => setActiveAdminTab('users')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                activeAdminTab === 'users'
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>User Accounts & Roles</span>
              </div>
            </button>
          )}

          {canManageSettings && (
            <button
              id="admin-tab-settings"
              onClick={() => setActiveAdminTab('settings')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                activeAdminTab === 'settings'
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Site & Company Info</span>
              </div>
            </button>
          )}

          {canViewAudit && (
            <button
              id="admin-tab-audit"
              onClick={() => setActiveAdminTab('audit')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shrink-0 ${
                activeAdminTab === 'audit'
                  ? 'bg-cyan-50 text-cyan-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Audit History</span>
              </div>
            </button>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-50 p-4 sm:p-6 overflow-y-auto">
          {/* ============================================================ */}
          {/* TAB 1: OVERVIEW METRICS */}
          {/* ============================================================ */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                  Dispatch & Sales Snapshot
                </h2>
                <span className="text-xs text-slate-500">Live Cold Logistics State</span>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400 block">Total Active Orders</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-slate-900 font-['Outfit']">
                      {orders.length}
                    </span>
                    <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                      {pendingOrders.length} Pending
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400 block">Commercial Quotes</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-slate-900 font-['Outfit']">
                      {quotes.length}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {pendingQuotes.length} Needs Review
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400 block">Estimated Pipeline</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-emerald-600 font-['Outfit']">
                      ${totalRevenue.toFixed(0)}
                    </span>
                    <span className="text-xs text-slate-400">Recorded orders</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold uppercase text-slate-400 block">Inquiry Queue</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-blue-600 font-['Outfit']">
                      {messages.length}
                    </span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {unreadMessages.length} Unread
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs font-semibold text-cyan-700 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No orders received yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">
                            #{order.reference_number} — {order.customer_name}
                            {order.business_name && (
                              <span className="font-normal text-slate-500"> ({order.business_name})</span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {order.preferred_date} • {order.preferred_time_slot} • {order.items.length} item(s)
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900">
                            ${order.total_estimated_amount.toFixed(2)}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'confirmed'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: ORDERS MANAGEMENT & MONTHLY RECORDS */}
          {/* ============================================================ */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6">
              {/* Quick Tab Switcher between Commercial Quotes and Orders */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('quotes')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Commercial Quotes ({quotes.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('orders')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-white text-cyan-800 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-cyan-600" />
                  <span>Customer Orders ({orders.length})</span>
                </button>
              </div>

              {/* Header & KPI Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-cyan-600" />
                    <span>Customer Ice Orders & Monthly Demand</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological order queue, delete/archival records, and monthly amounts tracking
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs tabular-nums">
                    {orders.length} Total All-Time
                  </span>
                  <button
                    onClick={loadAdminData}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
                    title="Refresh Orders"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Monthly Records & Volume Analytics Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Monthly Records & Revenue Volumes
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Updated dynamically from order dates and total amounts
                  </span>
                </div>

                {monthlyOrderRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No monthly order records recorded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {monthlyOrderRecords.map((m) => {
                      const isSelected = orderSelectedMonth === m.monthKey;
                      return (
                        <div
                          key={m.monthKey}
                          onClick={() => setOrderSelectedMonth(isSelected ? 'all' : m.monthKey)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-50/70 border-cyan-400 shadow-xs ring-1 ring-cyan-400/50'
                              : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 font-['Outfit']">
                              {m.monthName}
                            </span>
                            <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-cyan-800 tabular-nums">
                              {m.totalOrders} {m.totalOrders === 1 ? 'order' : 'orders'}
                            </span>
                          </div>

                          <div className="mt-2 text-sm font-black text-cyan-700 font-['Outfit']">
                            ${m.totalAmount.toFixed(2)}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Active: <strong className="text-slate-800 tabular-nums">{m.activeCount}</strong></span>
                            <span>Archived: <strong className="text-slate-600 tabular-nums">{m.archivedCount}</strong></span>
                            <span>Done: <strong className="text-emerald-700 tabular-nums">{m.acceptedCount}</strong></span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{isSelected ? '✓ Filter Active' : 'Click to filter'}</span>
                            <span className="font-mono">{m.monthKey}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Controls Toolbar: View Mode Tabs, Month Filter, Status Filter, Search, and Date Sort Toggle */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Segmented View Mode Tabs: Active, Archived Records, All */}
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setOrderViewMode('active')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                        orderViewMode === 'active'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Active Orders</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                        {orders.filter((o) => normalizeOrderStatus(o.status) !== 'Archived').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderViewMode('archived')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                        orderViewMode === 'archived'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Archive className="w-3.5 h-3.5 text-slate-500" />
                      <span>Archived Records</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                        {orders.filter((o) => normalizeOrderStatus(o.status) === 'Archived').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderViewMode('all')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                        orderViewMode === 'all'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>All Orders</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                        {orders.length}
                      </span>
                    </button>
                  </div>

                  {/* Date Sort Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setOrderSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                    title="Toggle Date Order"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Order: {orderSortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search orders, clients, phones..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Month Filter Selector */}
                  <div className="relative">
                    <select
                      value={orderSelectedMonth}
                      onChange={(e) => setOrderSelectedMonth(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium text-slate-700"
                    >
                      <option value="all">All Months</option>
                      {monthlyOrderRecords.map((m) => (
                        <option key={m.monthKey} value={m.monthKey}>
                          {m.monthName} ({m.totalOrders} orders · ${m.totalAmount.toFixed(0)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter Selector */}
                  <div className="relative">
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium text-slate-700"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Review">In Review</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              {displayedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No orders match the selected filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedOrders.map((order) => {
                    const normStatus = normalizeOrderStatus(order.status);
                    const isArchived = normStatus === 'Archived';
                    const isProcessing = isProcessingOrderId === order.id;

                    return (
                      <div
                        key={order.id}
                        id={`admin-order-row-${order.id}`}
                        className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                          isArchived
                            ? 'border-slate-200 bg-slate-50/50 opacity-85'
                            : 'border-slate-200 hover:border-cyan-300'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black font-mono text-cyan-700">
                              #{order.reference_number}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {order.customer_name}
                            </span>
                            {order.business_name && (
                              <span className="text-xs text-slate-500 font-medium">
                                • {order.business_name}
                              </span>
                            )}
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Color-coded Status Badge */}
                            <span
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                                normStatus === 'Pending Review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : normStatus === 'In Review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : normStatus === 'Quoted'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : normStatus === 'Accepted' || normStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : normStatus === 'Rejected' || normStatus === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : normStatus === 'Confirmed'
                                  ? 'bg-cyan-100 text-cyan-800'
                                  : normStatus === 'Out for Delivery'
                                  ? 'bg-violet-100 text-violet-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {normStatus}
                            </span>

                            {/* Status Select Controller */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Status:</span>
                              <select
                                value={normStatus}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                disabled={isProcessing}
                                className="p-1.5 text-xs font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-slate-50 cursor-pointer"
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="In Review">In Review</option>
                                <option value="Quoted">Quoted</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                {isArchived && <option value="Archived">Archived</option>}
                              </select>
                            </div>

                            {/* Delete / Archive Button */}
                            {isArchived ? (
                              <button
                                type="button"
                                onClick={() => handleRestoreOrder(order.id)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-xl border border-cyan-200 transition-colors flex items-center gap-1"
                                title="Restore order to active list"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>
                            ) : confirmArchiveOrderId === order.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleArchiveOrder(order.id)}
                                  disabled={isProcessing}
                                  className="px-2.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Confirm Delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmArchiveOrderId(null)}
                                  className="px-2 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmArchiveOrderId(order.id)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                                title="Delete order (archive to historical records)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer & Fulfillment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Info</span>
                            <p className="font-semibold text-slate-800">{order.customer_phone}</p>
                            {order.customer_email && <p className="text-slate-500">{order.customer_email}</p>}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fulfillment</span>
                            <p className="font-semibold text-slate-800 capitalize">{order.delivery_type}</p>
                            <p className="text-slate-500">{order.preferred_date} ({order.preferred_time_slot})</p>
                            {order.delivery_address && (
                              <p className="text-[11px] text-slate-600 truncate mt-0.5">{order.delivery_address}</p>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount Total</span>
                            <p className="text-base font-black text-cyan-700 font-['Outfit']">
                              ${order.total_estimated_amount.toFixed(2)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {order.created_at ? formatQuoteDate(order.created_at) : order.preferred_date}
                            </p>
                          </div>
                        </div>

                        {/* Items breakdown */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Ordered Ice Specifications:
                          </span>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-slate-700">
                                <span>
                                  {item.quantity}× {item.product_name} ({item.package_size})
                                </span>
                                <span className="font-semibold">
                                  ${((item.unit_price || 0) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          {order.notes && (
                            <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                              <strong>Logistics Notes:</strong> {order.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: QUOTES MANAGEMENT & MONTHLY RECORDS */}
          {/* ============================================================ */}
          {activeAdminTab === 'quotes' && (
            <div className="space-y-6">
              {/* Quick Tab Switcher between Commercial Quotes and Orders */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('quotes')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-white text-cyan-800 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Commercial Quotes ({quotes.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('orders')}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <ShoppingBag className="w-4 h-4 text-cyan-600" />
                  <span>Customer Orders ({orders.length})</span>
                </button>
              </div>

              {/* Header & KPI Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    <span>Commercial Quote Proposals & Monthly Records</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological inquiry management, monthly demand volume tracking, and historical archival records
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs tabular-nums">
                    {quotes.length} Total All-Time
                  </span>
                  <button
                    onClick={loadAdminData}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
                    title="Refresh Quotes"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Monthly Quote Records & Volume Analytics Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Monthly Records & Inquiry Volumes
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Updated dynamically from quote request dates
                  </span>
                </div>

                {monthlyQuoteRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No monthly inquiry records recorded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {monthlyQuoteRecords.map((m) => {
                      const isSelected = quoteSelectedMonth === m.monthKey;
                      return (
                        <div
                          key={m.monthKey}
                          onClick={() => setQuoteSelectedMonth(isSelected ? 'all' : m.monthKey)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-50/70 border-cyan-400 shadow-xs ring-1 ring-cyan-400/50'
                              : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 font-['Outfit']">
                              {m.monthName}
                            </span>
                            <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-cyan-800 tabular-nums">
                              {m.totalQuotes} {m.totalQuotes === 1 ? 'quote' : 'quotes'}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Active: <strong className="text-slate-800 tabular-nums">{m.activeCount}</strong></span>
                            <span>Archived: <strong className="text-slate-600 tabular-nums">{m.archivedCount}</strong></span>
                            <span>Accepted: <strong className="text-emerald-700 tabular-nums">{m.acceptedCount}</strong></span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{isSelected ? '✓ Filter Active' : 'Click to filter'}</span>
                            <span className="font-mono">{m.monthKey}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Controls Toolbar: View Mode Tabs, Month Filter, Status Filter, Search, and Date Sort Toggle */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Segmented View Mode Tabs: Active, Archived Records, All */}
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setQuoteViewMode('active')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                        quoteViewMode === 'active'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Active Quotes</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                        {quotes.filter((q) => normalizeQuoteStatus(q.status) !== 'Archived').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuoteViewMode('archived')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                        quoteViewMode === 'archived'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Archive className="w-3.5 h-3.5 text-slate-500" />
                      <span>Archived Records</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                        {quotes.filter((q) => normalizeQuoteStatus(q.status) === 'Archived').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuoteViewMode('all')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                        quoteViewMode === 'all'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>All Inquiries</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 tabular-nums">
                        {quotes.length}
                      </span>
                    </button>
                  </div>

                  {/* Date Sort Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setQuoteSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                    title="Toggle Date Order"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-cyan-600" />
                    <span>
                      Order: {quoteSortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                    </span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* Month Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={quoteSelectedMonth}
                      onChange={(e) => setQuoteSelectedMonth(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-700 font-medium"
                    >
                      <option value="all">Filter by Month: All Recorded Months ({quotes.length})</option>
                      {monthlyQuoteRecords.map((m) => (
                        <option key={m.monthKey} value={m.monthKey}>
                          {m.monthName} ({m.totalQuotes} quotes)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={quoteStatusFilter}
                      onChange={(e) => setQuoteStatusFilter(e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-700 font-medium"
                    >
                      <option value="all">Filter by Status: All Statuses</option>
                      {CANONICAL_QUOTE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                      {quoteViewMode !== 'active' && (
                        <option value="Archived">Archived</option>
                      )}
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search ref, customer, phone, location..."
                      value={quoteSearchQuery}
                      onChange={(e) => setQuoteSearchQuery(e.target.value)}
                      className="w-full text-xs py-2 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-700 font-medium"
                    />
                  </div>
                </div>

                {/* Active Filter Chips / Clear */}
                {(quoteSelectedMonth !== 'all' || quoteStatusFilter !== 'all' || quoteSearchQuery.trim()) && (
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                    <span>Active Filters:</span>
                    {quoteSelectedMonth !== 'all' && (
                      <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        Month: {quoteSelectedMonth}
                      </span>
                    )}
                    {quoteStatusFilter !== 'all' && (
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        Status: {quoteStatusFilter}
                      </span>
                    )}
                    {quoteSearchQuery.trim() && (
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        Search: "{quoteSearchQuery}"
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteSelectedMonth('all');
                        setQuoteStatusFilter('all');
                        setQuoteSearchQuery('');
                      }}
                      className="text-cyan-700 hover:underline font-semibold ml-auto text-[11px]"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Quotes List */}
              {displayedQuotes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700 text-sm">No quote requests found</p>
                  <p className="text-slate-400">
                    {quotes.length === 0
                      ? 'No quote inquiries have been submitted yet.'
                      : 'No quotes match the selected view mode, month filter, or search term.'}
                  </p>
                  {(quoteSelectedMonth !== 'all' || quoteStatusFilter !== 'all' || quoteSearchQuery.trim()) && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteSelectedMonth('all');
                        setQuoteStatusFilter('all');
                        setQuoteSearchQuery('');
                      }}
                      className="mt-2 inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedQuotes.map((quote) => {
                    const normStatus = normalizeQuoteStatus(quote.status);
                    const isArchived = normStatus === 'Archived';
                    const isProcessing = isProcessingQuoteId === quote.id;

                    // Color scheme for status
                    const statusColorMap: Record<QuoteStatus, string> = {
                      'Pending Review': 'bg-amber-50 text-amber-800 border-amber-300',
                      'In Review': 'bg-sky-50 text-sky-800 border-sky-300',
                      'Quoted': 'bg-indigo-50 text-indigo-800 border-indigo-300',
                      'Accepted': 'bg-emerald-50 text-emerald-800 border-emerald-300',
                      'Rejected': 'bg-rose-50 text-rose-800 border-rose-300',
                      'Archived': 'bg-slate-100 text-slate-600 border-slate-300',
                      'New': 'bg-amber-50 text-amber-800 border-amber-300',
                      'Contacted': 'bg-sky-50 text-sky-800 border-sky-300',
                      'pending': 'bg-amber-50 text-amber-800 border-amber-300',
                      'reviewed': 'bg-sky-50 text-sky-800 border-sky-300',
                      'proposal_sent': 'bg-indigo-50 text-indigo-800 border-indigo-300',
                      'accepted': 'bg-emerald-50 text-emerald-800 border-emerald-300',
                      'rejected': 'bg-rose-50 text-rose-800 border-rose-300'
                    };

                    return (
                      <div
                        key={quote.id}
                        className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-colors ${
                          isArchived ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200'
                        }`}
                      >
                        {/* Quote Header Bar: Reference, Name, Request Date, Status & Delete/Archive Action */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black font-mono text-cyan-700">
                                #{quote.reference_number || quote.id}
                              </span>
                              <span className="font-bold text-slate-900 text-xs">
                                {quote.customer_name}
                              </span>
                              {quote.business_name && (
                                <span className="text-xs text-slate-500 font-medium">
                                  • {quote.business_name}
                                </span>
                              )}
                              {isArchived && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                  Archived in Records
                                </span>
                              )}
                            </div>

                            {/* Request Date with Tabular Numerals */}
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className="font-mono tabular-nums">
                                Requested: {formatQuoteDate(quote.created_at)}
                              </span>
                              {quote.updated_at && quote.updated_at !== quote.created_at && (
                                <span className="text-[10px] text-slate-400">
                                  (Updated: {formatQuoteDate(quote.updated_at)})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Dropdown and Action Controls */}
                          <div className="flex items-center gap-2">
                            {/* Live Status Selector */}
                            {!isArchived ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">
                                  Status:
                                </span>
                                <select
                                  value={normStatus}
                                  disabled={isProcessing}
                                  onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value as QuoteStatus)}
                                  className={`p-1.5 text-xs font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer transition-colors ${
                                    statusColorMap[normStatus] || 'bg-slate-50 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  {CANONICAL_QUOTE_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-300">
                                Archived Record
                              </span>
                            )}

                            {/* Delete / Archive Button (for Active quotes) */}
                            {!isArchived ? (
                              confirmArchiveQuoteId === quote.id ? (
                                <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                                  <span className="text-[11px] font-bold text-rose-800 px-1">
                                    Archive?
                                  </span>
                                  <button
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={() => handleArchiveQuote(quote.id)}
                                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmArchiveQuoteId(null)}
                                    className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[11px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmArchiveQuoteId(quote.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                                  title="Archive quote to records"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              )
                            ) : (
                              /* Restore Button (for Archived quotes) */
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleRestoreQuote(quote.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg text-xs font-bold transition-colors"
                                title="Restore quote to active queue"
                              >
                                <RotateCcw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                                <span>Restore to Active</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quote Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Program Requested
                            </span>
                            <p className="font-bold text-slate-900">{quote.service_type || 'Ice Supply Inquiry'}</p>
                            <p className="text-slate-500 capitalize">
                              Frequency: {(quote.delivery_frequency || 'one_time').replace('_', ' ')}
                            </p>
                            {quote.event_date && (
                              <p className="text-slate-500 text-[11px]">
                                Event Date: {quote.event_date}
                              </p>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Volume & Delivery Location
                            </span>
                            <p className="font-semibold text-slate-800">
                              {quote.estimated_volume || 'Unspecified Volume'}
                            </p>
                            <p className="text-slate-500 flex items-start gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{quote.delivery_location || 'Coordinates Pending'}</span>
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Client Contact
                            </span>
                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <a href={`tel:${quote.customer_phone}`} className="hover:text-cyan-700">
                                {quote.customer_phone}
                              </a>
                            </p>
                            <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <a href={`mailto:${quote.customer_email}`} className="hover:text-cyan-700 truncate">
                                {quote.customer_email}
                              </a>
                            </p>
                          </div>
                        </div>

                        {/* Client Notes & Internal Notes */}
                        {quote.notes && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                            <strong className="text-slate-700">Client Inscription:</strong> {quote.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: MESSAGES */}
          {/* ============================================================ */}
          {activeAdminTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                    Contact Form Inquiries
                  </h2>
                  <p className="text-xs text-slate-500">Messages sent via public website contact page</p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-2xl border p-5 shadow-sm space-y-2 ${
                        msg.is_read ? 'border-slate-200' : 'border-cyan-400 bg-cyan-50/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {!msg.is_read && <span className="w-2 h-2 rounded-full bg-cyan-600" />}
                          <span>{msg.name}</span>
                          {msg.business_name && <span className="text-slate-500">({msg.business_name})</span>}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs text-cyan-800 font-semibold">{msg.subject}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{msg.message}</p>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <a href={`mailto:${msg.email}`} className="text-cyan-700 hover:underline">
                            {msg.email}
                          </a>
                          {msg.phone && <span>• {msg.phone}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: PRODUCTS CRUD */}
          {/* ============================================================ */}
          {activeAdminTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                    Ice Products Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add new products, adjust pricing, packaging, and availability
                  </p>
                </div>

                <button
                  id="admin-add-product-btn"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      category: 'Craft Cocktail Ice',
                      description: '',
                      package_size: 'Pack of 12',
                      price: 15,
                      price_display: '$15.00',
                      min_order_qty: 1,
                      availability: 'in_stock',
                      dimensions: '2" x 2" x 2"',
                      melt_rate: 'Ultra slow',
                      image: '/crystal_ice_storefront.jpg',
                      features: ['7-stage RO filtered']
                    });
                    setIsAddingProduct(true);
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Form Modal (when editing or adding) */}
              {(isAddingProduct || editingProduct) && (
                <div className="bg-white rounded-3xl border border-cyan-500 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                      {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Ice Product'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Category</label>
                        <select
                          value={productForm.category || 'Craft Cocktail Ice'}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                        >
                          <option value="Craft Cocktail Ice">Craft Cocktail Ice</option>
                          <option value="Standard Ice Supply">Standard Ice Supply</option>
                          <option value="Display & Beverage Ice">Display & Beverage Ice</option>
                          <option value="Block & Bulk Ice">Block & Bulk Ice</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Package Size</label>
                        <input
                          type="text"
                          value={productForm.package_size || ''}
                          onChange={(e) => setProductForm({ ...productForm, package_size: e.target.value })}
                          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setProductForm({
                              ...productForm,
                              price: val,
                              price_display: `$${val.toFixed(2)}`
                            });
                          }}
                          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                        <select
                          value={productForm.availability || 'in_stock'}
                          onChange={(e) => setProductForm({ ...productForm, availability: e.target.value as any })}
                          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="low_stock">Low Stock</option>
                          <option value="pre_order">Pre-Order</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Dimensions</label>
                        <input
                          type="text"
                          value={productForm.dimensions || ''}
                          onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                          className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                        />
                      </div>

                      <div>
                        <ExactImageUploadInput
                          label="Product Image (Exact Lossless)"
                          value={productForm.image || ''}
                          onChange={(url) => setProductForm({ ...productForm, image: url })}
                          category="products"
                          helperText="Upload original product picture byte-for-byte untouched"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Melt Rate Dynamics</label>
                      <input
                        type="text"
                        value={productForm.melt_rate || ''}
                        onChange={(e) => setProductForm({ ...productForm, melt_rate: e.target.value })}
                        className="w-full p-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-sm"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Packaging</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover border"
                            referrerPolicy="no-referrer"
                          />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-3 text-slate-600">{p.category}</td>
                        <td className="p-3 text-slate-600">{p.package_size}</td>
                        <td className="p-3 font-bold text-cyan-700">{p.price_display}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                            {p.availability.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm(p);
                                setIsAddingProduct(false);
                              }}
                              className="p-1.5 text-slate-600 hover:text-cyan-700 rounded-lg hover:bg-slate-100"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: WEBSITE SETTINGS & CMS */}
          {/* ============================================================ */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                  Company & Website Settings
                </h2>
                <p className="text-xs text-slate-500">
                  Edits made here dynamically update the live public website instantly
                </p>
              </div>

              {settingsSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Settings updated and deployed to public website successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={settingsForm.company_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Primary Dispatch Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone_primary}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp_number}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Same-Day Cutoff Time</label>
                    <input
                      type="text"
                      value={settingsForm.same_day_cutoff_time}
                      onChange={(e) => setSettingsForm({ ...settingsForm, same_day_cutoff_time: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Physical Plant Address</label>
                    <input
                      type="text"
                      value={settingsForm.physical_address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, physical_address: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business & Loading Hours</label>
                    <input
                      type="text"
                      value={settingsForm.business_hours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, business_hours: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Homepage Hero Copy</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hero Badge Text</label>
                      <input
                        type="text"
                        value={settingsForm.hero_badge}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hero_badge: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hero Main Headline</label>
                      <input
                        type="text"
                        value={settingsForm.hero_headline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hero_headline: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hero Subheadline</label>
                      <textarea
                        rows={2}
                        value={settingsForm.hero_subheadline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hero_subheadline: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white"
                      />
                    </div>
                    <div>
                      <ExactImageUploadInput
                        label="Homepage Hero Backdrop Centerpiece Image"
                        value={settingsForm.hero_bg_image || '/crystal_ice_storefront.jpg'}
                        onChange={(url) => setSettingsForm({ ...settingsForm, hero_bg_image: url })}
                        category="branding"
                        helperText="The authentic Crystal Ice building centerpiece displayed on the homepage backdrop untouched."
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, hero_bg_image: '/crystal_ice_storefront.jpg' })}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                        >
                          Reset to Default Storefront Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    id="save-settings-btn"
                    type="submit"
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: PLANT SERVICES */}
          {/* ============================================================ */}
          {activeAdminTab === 'services' && <ServicesTab />}

          {/* ============================================================ */}
          {/* TAB: FAQS */}
          {/* ============================================================ */}
          {activeAdminTab === 'faqs' && <FaqsTab />}

          {/* ============================================================ */}
          {/* TAB: TESTIMONIALS */}
          {/* ============================================================ */}
          {activeAdminTab === 'testimonials' && <TestimonialsTab />}

          {/* ============================================================ */}
          {/* TAB: DELIVERY ZONES */}
          {/* ============================================================ */}
          {activeAdminTab === 'areas' && <DeliveryAreasTab />}

          {/* ============================================================ */}
          {/* TAB: OPERATIONS (PROCESS, PORTFOLIO, NEWS) */}
          {/* ============================================================ */}
          {activeAdminTab === 'content' && <ProcessPortfolioNewsTab />}

          {/* ============================================================ */}
          {/* TAB: EXACT LOSSLESS MEDIA LIBRARY */}
          {/* ============================================================ */}
          {activeAdminTab === 'media' && (
            <MediaLibraryTab
              onOpenLiveSlotManager={() => setIsSlotManagerOpen(true)}
            />
          )}

          {/* ============================================================ */}
          {/* TAB: USER ACCOUNTS & ROLES (ADMIN ONLY) */}
          {/* ============================================================ */}
          {activeAdminTab === 'users' && user && <UsersTab currentUser={user} />}

          {/* ============================================================ */}
          {/* TAB 7: AUDIT LOGS */}
          {/* ============================================================ */}
          {activeAdminTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                  System Audit Logs
                </h2>
                <p className="text-xs text-slate-500">
                  Immutable record of admin actions, status updates, and catalog changes
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity Type</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="p-3 font-bold text-slate-800">{log.user_id}</td>
                        <td className="p-3 font-semibold text-cyan-700">{log.action}</td>
                        <td className="p-3 text-slate-600">{log.entity_type}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Live Image Slot Manager Modal */}
      <LiveImageSlotManagerModal
        isOpen={isSlotManagerOpen}
        onClose={() => setIsSlotManagerOpen(false)}
        onRefreshSiteData={() => {
          loadAdminData();
          onRefreshData();
        }}
        initialSelectedSlotId={selectedSlotForManager}
      />
    </div>
  );
};
