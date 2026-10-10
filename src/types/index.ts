export type OrderStatus =
  | 'New'
  | 'Contacted'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type QuoteStatus =
  | 'Pending Review'
  | 'In Review'
  | 'Quoted'
  | 'Accepted'
  | 'Rejected'
  | 'Archived'
  | 'New'
  | 'Contacted'
  | 'pending'
  | 'reviewed'
  | 'proposal_sent'
  | 'accepted'
  | 'rejected';

export interface MonthlyQuoteRecord {
  monthKey: string;      // e.g. "2026-10"
  monthName: string;     // e.g. "October 2026"
  totalQuotes: number;
  activeCount: number;
  archivedCount: number;
  pendingCount: number;
  inReviewCount: number;
  quotedCount: number;
  acceptedCount: number;
  rejectedCount: number;
  firstDate?: string;
  lastDate?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  package_size: string;
  price: number | null; // null if "Request Pricing"
  price_display: string;
  availability: 'in_stock' | 'limited' | 'bulk_only' | 'out_of_stock';
  featured: boolean;
  published: boolean;
  sort_order: number;
  min_order_qty?: number;
  dimensions?: string;
  melt_rate?: string;
  ideal_for?: string[];
  features?: string[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  icon: string;
  features: string[];
  image: string;
  sort_order: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  business_name: string;
  rating: number;
  testimonial: string;
  avatar_url?: string;
  featured: boolean;
  published: boolean;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Ordering' | 'Delivery' | 'Commercial';
  sort_order: number;
  published: boolean;
}

export type FAQItem = FAQ;
export type Quote = QuoteRequest;
export type ContactMessage = ContactSubmission;

export interface DeliveryArea {
  id: string;
  area_name: string;
  zone_code: string;
  available: boolean;
  delivery_fee: number;
  min_order: number;
  minimum_order_amount?: number;
  same_day_available: boolean;
  delivery_window: string;
  estimated_delivery_time?: string;
  notes: string;
  description?: string;
  zip_codes?: string[];
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  package_size: string;
  unit_price: number | null;
}

export interface Order {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  business_name?: string;
  delivery_type: 'delivery' | 'pickup';
  delivery_area_id?: string;
  delivery_address?: string;
  preferred_date: string;
  preferred_time_slot: string;
  items: OrderItem[];
  total_estimated_amount: number;
  notes?: string;
  status: OrderStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id: string;
  reference_number: string;
  customer_name: string;
  business_name?: string;
  customer_phone: string;
  customer_email: string;
  service_type: string;
  estimated_volume: string;
  delivery_frequency: 'one_time' | 'daily' | 'weekly' | 'bi_weekly' | 'custom';
  event_date?: string;
  delivery_location: string;
  notes: string;
  status: QuoteStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  inquiry_type: 'General' | 'Commercial Supply' | 'Event Booking' | 'Emergency Delivery' | 'Partnership';
  message: string;
  status: 'New' | 'Contacted' | 'Resolved';
  created_at: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  step_number: number;
  icon: string;
  published: boolean;
}

export interface PortfolioItem {
  id: string;
  client_name: string;
  category: string;
  description: string;
  volume_supplied: string;
  image_url?: string;
  featured: boolean;
  published: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Operational Alert' | 'Capacity Expansion' | 'Supply Notice' | 'Holiday Hours';
  summary: string;
  date: string;
  published: boolean;
}

export interface WebsiteSettings {
  company_name: string;
  tagline: string;
  phone_primary: string;
  phone_secondary?: string;
  whatsapp_number: string;
  whatsapp_prefilled_message: string;
  email: string;
  physical_address: string;
  business_hours: string;
  emergency_supply_text?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  google_business_url?: string;
  hero_badge: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_bg_image?: string;
  storefront_image?: string;
  logo_url?: string;
  about_facility_image?: string;
  homepage_about_image?: string;
  homepage_ice_cubes_image?: string;
  delivery_fleet_image?: string;
  cold_storage_image?: string;
  ice_blocks_image?: string;
  water_purification_image?: string;
  ice_cubes_card_image?: string;
  ice_cubes_promo_image?: string;
  chicken_blast_image?: string;
  beef_blast_image?: string;
  packaged_ice_5kg_image?: string;
  ice_blocks_storage_image?: string;
  meat_blast_card_image?: string;
  contact_dispatch_image?: string;
  quality_assurance_image?: string;
  generator_image?: string;
  bootstrap_complete?: boolean;
  custom_images?: Record<string, string>;
  about_story?: string;
  about_mission?: string;
  about_purity_standard?: string;
  service_radius_miles?: number;
  same_day_cutoff_time: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface SiteImageSlot {
  id: string;
  title: string;
  category: 'hero' | 'storefront' | 'products' | 'facilities' | 'services' | 'portfolio' | 'about' | 'branding';
  currentUrl: string;
  description: string;
  recommendedAspect: string;
  targetType: 'settings' | 'product' | 'service' | 'portfolio' | 'custom';
  targetId?: string;
  targetField?: string;
}

export type SystemRole = 'admin' | 'staff' | 'editor';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: SystemRole;
  assigned_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: SystemRole;
  active?: boolean;
  token?: string;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  user_name?: string;
  user_role?: string;
  user_id?: string;
  action: string;
  record_type?: string;
  entity_type?: string;
  record_id?: string;
  details: any;
  timestamp?: string;
  created_at?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'quote' | 'contact' | 'system';
  reference_id?: string;
  read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'products' | 'facilities' | 'delivery' | 'events' | 'branding';
  size_kb: number;
  uploaded_at: string;
}
