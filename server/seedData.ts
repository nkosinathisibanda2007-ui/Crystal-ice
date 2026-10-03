import { Product, Service, Testimonial, FAQ, DeliveryArea, WebsiteSettings, Statistic, MediaItem } from '../src/types/index.ts';

export const initialSettings: WebsiteSettings = {
  company_name: "Crystal Ice Zimbabwe",
  tagline: "Quality Ice Cubes, Solid Ice Blocks & Meat Blast Freezing in Harare",
  phone_primary: "+263 774 213 817",
  phone_secondary: "+263 774 213 817",
  whatsapp_number: "+263774213817",
  whatsapp_prefilled_message: "Hello Crystal Ice Zimbabwe, I would like to place an order / inquire about restaurant ice supply or blast freezing.",
  email: "sales@crystalice.co.zw",
  physical_address: "FF11 Waterfalls Avenue, 2194 Mainway Meadows, Waterfalls, Harare, Zimbabwe",
  business_hours: "Monday – Thursday: 7:30 AM – 4:45 PM | Friday: 7:00 AM – 4:15 PM (Delivery to restaurants active daily)",
  emergency_supply_text: "Direct WhatsApp & telephone dispatch for Harare restaurants, clubs, and weekend events.",
  hero_badge: "Supplying Harare's Top Restaurants & Butcheries",
  hero_headline: "Harare's Trusted Ice Manufacturer & Blast Freezing Facility",
  hero_subheadline: "Supplying high-purity 2.5kg & 5kg ice cubes, 10kg slow-melt solid ice blocks, and industrial-grade meat blast freezing to local restaurants, bars, butcheries, and event caterers.",
  hero_cta_primary: "Order Ice Cubes ($0.75/bag)",
  hero_cta_secondary: "Meat Blast Freezing Rates",
  about_story: "Based in Waterfalls, Harare, Crystal Ice (Pvt) Ltd has grown into one of Zimbabwe's leading ice manufacturing and cold preservation specialists. We combine multi-stage water filtration with heavy-duty freezing chambers to deliver crystal-clear, food-safe ice and industrial meat blast freezing services.",
  about_mission: "To keep Zimbabwe's hospitality, retail, and agricultural cold-chains unbroken with dependable daily ice delivery, hygienic food-grade production, and accessible blast-freezing infrastructure.",
  about_purity_standard: "Manufactured using rigorous multi-barrier water filtration, UV sanitation, and hygienic automated packaging. Certified safe for consumption in drinks, cocktails, food displays, and meat preservation.",
  service_radius_miles: 30,
  same_day_cutoff_time: "2:00 PM Daily",
  facebook_url: "https://www.facebook.com/crystalicezim",
  instagram_url: "https://www.instagram.com/crystalicezim?stkn=MTVkODRobXRpc2hqaw==",
  twitter_url: "https://x.com/crystalicezim",
  google_business_url: "https://www.google.com/search?kgmid=%2Fg%2F11q40rdy9f&hl=en-ZW&q=Crystal%20Ice%20Zimbabwe&shem=epsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm1%2F4&kgs=73ff328e81c3f7ff",
  seo_keywords: "Crystal Ice Zimbabwe, ice supplier Harare, ice cubes Zimbabwe, 2.5kg ice bag, 5kg ice bag, 10kg ice block Harare, meat blast freezing Zimbabwe, chicken blast freezing Waterfalls Harare, restaurant ice delivery Harare"
};

export const initialStatistics: Statistic[] = [
  {
    id: "stat-1",
    label: "Daily Ice Capacity",
    value: 12,
    prefix: "",
    suffix: " Tonnes/Day",
    description: "Continuous crystal-clear tube, cube & block freezing",
    sort_order: 1
  },
  {
    id: "stat-2",
    label: "Blast Freezing Capacity",
    value: 15,
    prefix: "",
    suffix: " Tonnes/24h",
    description: "Rapid sub-zero blast freezing for chicken, beef & pork",
    sort_order: 2
  },
  {
    id: "stat-3",
    label: "Harare Venues Supplied",
    value: 120,
    prefix: "",
    suffix: "+ Restaurants",
    description: "Trusted supplier to restaurants, bars, clubs & butcheries",
    sort_order: 3
  },
  {
    id: "stat-4",
    label: "Wholesale Rate",
    value: 0.75,
    prefix: "$",
    suffix: " / 2.5kg",
    description: "MOQ 100 packs with delivery ($1.00 for <100 packs)",
    sort_order: 4
  }
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "2.5kg Packaged Ice Cubes",
    slug: "2-5kg-packaged-ice-cubes",
    description: "Our signature retail and restaurant pack. Crystal-clear, slow-diluting food-grade ice cubes in heavy-duty polyethylene bags with built-in carry handles. $1.00 per bag for small orders; special wholesale price of $0.75 per bag for orders of 100 packs minimum with refrigerated delivery across Harare included.",
    image: "/cold_room_storage_1790856812685.jpg",
    category: "Packaged Ice Cubes",
    package_size: "2.5kg Bag with Handle",
    price: 1.0,
    price_display: "$1.00 / bag ($0.75 for 100+ packs with Delivery)",
    availability: "in_stock",
    featured: true,
    published: true,
    sort_order: 1,
    min_order_qty: 1,
    dimensions: "Standard 2.5kg Bag (approx. 25 × 40 cm)",
    melt_rate: "Slow melt crystalline density",
    ideal_for: ["Restaurants & Cafes", "Sports Bars & Nightclubs", "Bottle Stores & Supermarkets", "Weddings & Private Braais"],
    features: [
      "Retail Price: $1.00 per bag (< 100 packs)",
      "Wholesale Special: $0.75 per bag (MOQ 100 packs includes Harare delivery)",
      "Food-grade purified water, 100% taste-free",
      "Convenient carry handle design"
    ]
  },
  {
    id: "prod-2",
    name: "5kg Commercial Ice Bags",
    slug: "5kg-commercial-ice-bags",
    description: "High-volume 5kg ice bags designed specifically for busy restaurant bar wells, high-turnover cocktail stations, corporate catering events, and liquor retailers. Packed tightly with clear, non-clumping ice cubes.",
    image: "/packaged_ice_5kg_1790856872454.jpg",
    category: "Packaged Ice Cubes",
    package_size: "5kg Heavy Duty Bag",
    price: 1.50,
    price_display: "$1.50 / bag (Volume discounts for daily accounts)",
    availability: "in_stock",
    featured: true,
    published: true,
    sort_order: 2,
    min_order_qty: 5,
    dimensions: "5kg Heavy-gauge bag",
    melt_rate: "Dense formulation resists fast dilution",
    ideal_for: ["Cocktail Bars & Lounges", "High-Volume Kitchens", "Catering & Buffets", "Service Stations & Bottle Stores"],
    features: [
      "Sealed hygienic food-safe packaging",
      "Puncture-resistant industrial bag",
      "Clear cylindrical & cube formation",
      "Easy stacking in commercial chest freezers"
    ]
  },
  {
    id: "prod-3",
    name: "10kg Solid Ice Blocks",
    slug: "10kg-solid-ice-blocks",
    description: "Heavy-duty, high-density solid ice blocks frozen slowly in our industrial freezing cells. Ideal for cooler boxes, butcheries, fishmongers, and large outdoor functions requiring long-lasting sub-zero cooling without quick melting.",
    image: "/ice_blocks_storage_1790856885832.jpg",
    category: "Solid Ice Blocks",
    package_size: "10kg Solid Block",
    price: 2.00,
    price_display: "$2.00 / block",
    availability: "in_stock",
    featured: true,
    published: true,
    sort_order: 3,
    min_order_qty: 2,
    dimensions: "Solid frozen block (approx. 10kg)",
    melt_rate: "Lasts up to 24–48 hours inside insulated cool boxes",
    ideal_for: ["Butcheries & Cold Storage Backups", "Outdoor Events & Festivals", "Fisheries & Meat Transport", "Camping & Braai Cooler Boxes"],
    features: [
      "Solid core with extreme thermal mass",
      "Special rate: $2.00 per 10kg block",
      "Melt rate far superior to ordinary crushed ice",
      "Hygienically wrapped for easy handling",
      "Reliable temperature holding during power outages"
    ]
  },
  {
    id: "prod-4",
    name: "Chickens Blast Freezing Service",
    slug: "chickens-blast-freezing",
    description: "Industrial rapid blast freezing service for poultry farmers, abattoirs, and meat wholesalers. Locks in cellular moisture, prevents freezer burn, and extends shelf life. Minimum batch 1 tonne, capacity up to 10 tonnes per 24 hours.",
    image: "/chicken_blast_freeze_1790856846432.jpg",
    category: "Meat Blast Freezing",
    package_size: "Per Bird (Min 1 Tonne)",
    price: 0.25,
    price_display: "$0.25 per bird (Min 1 Tonne / Max 10 Tonnes per 24h)",
    availability: "in_stock",
    featured: true,
    published: true,
    sort_order: 4,
    min_order_qty: 1,
    dimensions: "Batch capacity up to 10 tonnes/day",
    melt_rate: "Deep core freeze to -18°C or below",
    ideal_for: ["Poultry Farmers", "Commercial Abattoirs", "Supermarket Meat Departments", "Chicken Wholesalers"],
    features: [
      "Only $0.25 per bird",
      "Minimum batch: 1 tonne",
      "Maximum capacity: 10 tonnes per 24 hours",
      "Preserves weight, texture, and nutritional value",
      "Clean, inspected facility in Waterfalls, Harare"
    ]
  },
  {
    id: "prod-5",
    name: "Beef, Pork & Other Meat Blast Freezing",
    slug: "beef-pork-meat-blast-freezing",
    description: "High-capacity blast freezing for beef quarters, carcasses, primal cuts, pork, goat, and processed meat products. Rapid deep chilling preserves meat bloom, prevents microbial proliferation, and ensures export-quality freezing standards.",
    image: "/beef_blast_freeze_1790856859754.jpg",
    category: "Meat Blast Freezing",
    package_size: "Per Kilogram (Min 1 Tonne)",
    price: 0.20,
    price_display: "$0.20 per kg (Min 1 Tonne / Max 15 Tonnes per 24h)",
    availability: "in_stock",
    featured: true,
    published: true,
    sort_order: 5,
    min_order_qty: 1,
    dimensions: "Batch capacity up to 15 tonnes/day",
    melt_rate: "Commercial deep blast freeze",
    ideal_for: ["Beef Processors & Butcheries", "Pork Producers", "Feedlots & Livestock Farmers", "Meat Exporters & Wholesalers"],
    features: [
      "Affordable rate: $0.20 per kg",
      "Minimum batch: 1 tonne",
      "Maximum capacity: 15 tonnes per 24 hours",
      "Rapid temperature pull-down",
      "Spacious loading dock at FF11 Waterfalls Avenue"
    ]
  },
  {
    id: "prod-6",
    name: "Recurring Restaurant Supply Contract",
    slug: "recurring-restaurant-supply",
    description: "Custom scheduled ice supply contracts for Harare restaurants, clubs, cafes, and catering venues. Guaranteed morning or afternoon drops, priority route scheduling, and emergency backup stock on busy weekends.",
    image: "/ice_cubes_promo_1790856824108.jpg",
    category: "Commercial Contracts",
    package_size: "Custom Weekly / Daily Volume",
    price: null,
    price_display: "Custom Contract Pricing (MOQ 100 bags for free delivery)",
    availability: "bulk_only",
    featured: true,
    published: true,
    sort_order: 6,
    min_order_qty: 100,
    dimensions: "Daily / Weekly scheduled supply",
    melt_rate: "Continuous fresh supply",
    ideal_for: ["Local Restaurants & Eateries", "Braai Lounges & Grills", "Hotels & Conference Centres", "Event Planners & Venues"],
    features: [
      "Scheduled recurring delivery slots",
      "Dedicated account manager",
      "Flexible payment: USD Cash, EcoCash, USD Bank Transfer",
      "Freezers provided for eligible high-volume accounts"
    ]
  }
];

export const initialServices: Service[] = [
  {
    id: "serv-1",
    title: "Daily & Weekly Restaurant Ice Supply",
    slug: "restaurant-ice-supply",
    short_description: "Reliable scheduled ice deliveries directly to Harare restaurants, bars, and lounges.",
    description: "Never run short of ice during a busy Friday dinner rush or weekend lunch service. Crystal Ice supplies leading dining spots, cocktail lounges, braai centres, and cafes across Harare with fresh 2.5kg and 5kg bags delivered directly into your freezers.",
    icon: "Truck",
    features: [
      "Scheduled morning and afternoon delivery windows",
      "Special offer 2.5kg bags at $0.75 (MOQ 100 with free delivery)",
      "Uninterrupted supply even during peak holiday seasons",
      "Cash on delivery, EcoCash, or monthly account billing"
    ],
    image: "/crystal_ice_storefront.jpg",
    sort_order: 1,
    published: true
  },
  {
    id: "serv-2",
    title: "Industrial Meat Blast Freezing",
    slug: "meat-blast-freezing",
    short_description: "Advanced blast freezing for chickens ($0.25/bird) and beef/pork ($0.20/kg) in Waterfalls.",
    description: "Our high-tech blast freezing facility at FF11 Waterfalls Avenue rapidly lowers meat core temperatures, arresting bacterial growth and locking in cell structure. We handle up to 10 tonnes of poultry and 15 tonnes of beef, pork, and game per 24 hours.",
    icon: "ShieldCheck",
    features: [
      "Chickens: $0.25 per bird (Min 1 tonne, Max 10 tonnes/24h)",
      "Beef & Pork: $0.20 per kg (Min 1 tonne, Max 15 tonnes/24h)",
      "Fast turn-around time for farmers & wholesalers",
      "Maintains meat texture, natural moisture, and red bloom"
    ],
    image: "/crystal_ice_storefront.jpg",
    sort_order: 2,
    published: true
  },
  {
    id: "serv-3",
    title: "Events, Weddings & Festival Supply",
    slug: "events-wedding-supply",
    short_description: "Bulk ice cubes and 10kg blocks delivered directly to event venues and wedding gardens.",
    description: "Whether you are hosting a 500-guest wedding in Borrowdale, an outdoor music festival, or a corporate golf day, Crystal Ice delivers ice in bulk on your exact schedule. We provide durable ice blocks and bags that keep drinks ice-cold all day.",
    icon: "CalendarCheck",
    features: [
      "Bulk volume orders delivered directly to your venue",
      "Combination of 2.5kg/5kg cubes and 10kg solid blocks",
      "Flexible delivery timing to match your bar setup",
      "Weekend event delivery pre-booking"
    ],
    image: "/crystal_ice_storefront.jpg",
    sort_order: 3,
    published: true
  },
  {
    id: "serv-4",
    title: "Butcheries & Cold Storage Support",
    slug: "butchery-cold-storage",
    short_description: "10kg solid ice blocks and crushed ice to safeguard meat and poultry fresh displays.",
    description: "Power cuts and cooling equipment failures can cost thousands in spoiled inventory. Crystal Ice provides dense 10kg solid ice blocks that keep butchery display counters, walk-in cold rooms, and fish crates below safe thresholds for days.",
    icon: "Boxes",
    features: [
      "Ultra-dense 10kg solid blocks at $2.00 each",
      "Protects meat during load-shedding and equipment maintenance",
      "Rapid dispatch across Harare industrial and suburban butcheries",
      "Bulk pallet pricing available"
    ],
    image: "/crystal_ice_storefront.jpg",
    sort_order: 4,
    published: true
  },
  {
    id: "serv-5",
    title: "Freezer Placement for Retailers",
    slug: "freezer-placement-retail",
    short_description: "Branded commercial chest freezers placed at partner service stations and bottle stores.",
    description: "Boost your store's beverage and party revenue without investing in refrigeration capital. We supply branded, energy-efficient commercial chest freezers to high-traffic service stations, bottle stores, and supermarkets across Harare with automated stock replenishment.",
    icon: "ClockAlert",
    features: [
      "Free branded chest freezer installation for qualifying outlets",
      "Regular weekly restocking by our delivery team",
      "Attractive high-margin product for bottle stores & garages",
      "Maintenance and servicing handled by our technicians"
    ],
    image: "/crystal_ice_storefront.jpg",
    sort_order: 5,
    published: true
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    customer_name: "Tinashe Moyo",
    business_name: "The Terrace Bar & Grill, Avondale",
    rating: 5,
    testimonial: "We switched our restaurant to Crystal Ice Zimbabwe early last year and haven't looked back. Their 2.5kg bags with handles make restocking our bar wells seamless, and at $0.75 with delivery it is the best value in Harare. Unfailingly reliable deliveries every single week.",
    avatar_url: "",
    featured: true,
    published: true,
    date: "2025-01-14"
  },
  {
    id: "test-2",
    customer_name: "Tendai Chiweshe",
    business_name: "Highland Prime Meats & Poultry",
    rating: 5,
    testimonial: "We blast freeze over 3 tonnes of broilers weekly through Crystal Ice's Waterfalls facility. The $0.25 per bird rate is transparent and our chickens freeze rock solid with zero ice crystallization or weight loss. The team is professional and efficient.",
    avatar_url: "",
    featured: true,
    published: true,
    date: "2025-02-02"
  },
  {
    id: "test-3",
    customer_name: "Chipo Marufu",
    business_name: "Prestige Weddings & Event Catering, Borrowdale",
    rating: 5,
    testimonial: "For our large weddings with 300+ guests, ice melting halfway through the reception used to be a nightmare. Crystal Ice supplied us with their 10kg solid blocks and 5kg bags. Everything stayed chilled until the last toast. Their delivery driver arrived right on time.",
    avatar_url: "",
    featured: true,
    published: true,
    date: "2025-02-18"
  },
  {
    id: "test-4",
    customer_name: "Farai Nyandoro",
    business_name: "Eastlea Sports Club & Bar",
    rating: 5,
    testimonial: "During big rugby and soccer weekend games, our beer tubs go through hundreds of kilograms of ice. A quick WhatsApp to Crystal Ice and our order arrives packed neatly into our chest freezer before the crowd arrives. Outstanding service!",
    avatar_url: "",
    featured: false,
    published: true,
    date: "2025-01-02"
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: "faq-1",
    question: "Where is Crystal Ice Zimbabwe located and what are your operating hours?",
    answer: "Our main production plant and cold storage facility is located at FF11 Waterfalls Avenue (2194 Mainway Meadows), Waterfalls, Harare. We are open Monday to Thursday from 7:30 AM to 4:45 PM, and Friday from 7:00 AM to 4:15 PM. Scheduled deliveries for registered restaurants and pre-booked event orders are fulfilled throughout Harare.",
    category: "General",
    sort_order: 1,
    published: true
  },
  {
    id: "faq-2",
    question: "What are the details of the $0.75 per bag 2.5kg ice special offer?",
    answer: "Our 2.5kg ice cube bag is on special offer for just $0.75 per bag when ordering a minimum quantity (MOQ) of 100 packets, which includes free delivery right to your restaurant, club, bottle store, or event venue anywhere within our primary Harare delivery grid.",
    category: "Ordering",
    sort_order: 2,
    published: true
  },
  {
    id: "faq-3",
    question: "How does your meat blast freezing service work and what are the rates?",
    answer: "We offer high-capacity commercial blast freezing at our Waterfalls plant: for chickens, the rate is $0.25 per bird (minimum batch 1 tonne, up to 10 tonnes per 24 hours). For beef, pork, and other red meats, the rate is $0.20 per kg (minimum batch 1 tonne, up to 15 tonnes per 24 hours). We recommend contacting our sales desk (+263 774 213 817) in advance to reserve chamber capacity.",
    category: "Commercial",
    sort_order: 3,
    published: true
  },
  {
    id: "faq-4",
    question: "Which areas in Harare do you deliver to?",
    answer: "We deliver across all Harare zones including Waterfalls, Mainway Meadows, Parktown, Hatfield, Harare CBD, Graniteside, Southerton, Workington, Eastlea, Belvedere, Avondale, Borrowdale, Newlands, Highlands, Mount Pleasant, Msasa, and Chitungwiza.",
    category: "Delivery",
    sort_order: 4,
    published: true
  },
  {
    id: "faq-5",
    question: "Can I collect ice directly from your factory in Waterfalls?",
    answer: "Yes! Customers and businesses are welcome to collect 2.5kg bags, 5kg bags, or 10kg solid blocks directly from our dispatch dock at FF11 Waterfalls Avenue during regular business hours.",
    category: "Ordering",
    sort_order: 5,
    published: true
  },
  {
    id: "faq-6",
    question: "What payment methods do you accept?",
    answer: "We accept United States Dollars (USD Cash), EcoCash, and USD Bank Transfer / Nostro. Commercial accounts on regular weekly supply can also apply for structured invoicing terms.",
    category: "General",
    sort_order: 6,
    published: true
  }
];

export const initialDeliveryAreas: DeliveryArea[] = [
  {
    id: "area-1",
    area_name: "Zone 1: Waterfalls, Mainway Meadows, Parktown & Hatfield",
    zone_code: "ZONE-1",
    available: true,
    delivery_fee: 0,
    min_order: 30,
    same_day_available: true,
    delivery_window: "1 - 2 Hours (Plant Zone)",
    notes: "Free delivery on orders over $50 or MOQ 100 bags of 2.5kg ice."
  },
  {
    id: "area-2",
    area_name: "Zone 2: Harare CBD, Graniteside, Southerton & Workington",
    zone_code: "ZONE-2",
    available: true,
    delivery_fee: 3,
    min_order: 40,
    same_day_available: true,
    delivery_window: "Morning (8:30-11:00 AM) & Afternoon (1:30-4:00 PM)",
    notes: "Dedicated restaurant & commercial delivery route."
  },
  {
    id: "area-3",
    area_name: "Zone 3: Borrowdale, Newlands, Avondale, Highlands & Mt Pleasant",
    zone_code: "ZONE-3",
    available: true,
    delivery_fee: 5,
    min_order: 50,
    same_day_available: true,
    delivery_window: "Daily Scheduled Drops (Morning & Midday)",
    notes: "Free delivery on orders of 100+ bags. High-frequency supply to restaurants & clubs."
  },
  {
    id: "area-4",
    area_name: "Zone 4: Chitungwiza, Ruwa, Msasa & Greater Harare",
    zone_code: "ZONE-4",
    available: true,
    delivery_fee: 8,
    min_order: 75,
    same_day_available: false,
    delivery_window: "Next-Day Scheduled Staging or 24hr Notice",
    notes: "Ideal for weekend weddings, large church functions, and butcheries."
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: "med-1",
    name: "Crystal Ice 2.5kg and 5kg Bagged Ice Cold Storage",
    url: "/crystal_ice_storefront.jpg",
    category: "facilities",
    size_kb: 420,
    uploaded_at: "2025-01-10"
  },
  {
    id: "med-2",
    name: "Clear Ice Cubes for Cocktail and Beverage Supply",
    url: "/crystal_ice_storefront.jpg",
    category: "products",
    size_kb: 390,
    uploaded_at: "2025-01-11"
  },
  {
    id: "med-3",
    name: "Industrial Meat Blast Freezing in Waterfalls Harare",
    url: "/crystal_ice_storefront.jpg",
    category: "facilities",
    size_kb: 512,
    uploaded_at: "2025-01-15"
  },
  {
    id: "med-4",
    name: "Solid Ice Blocks for Coolers and Butcheries",
    url: "/crystal_ice_storefront.jpg",
    category: "products",
    size_kb: 640,
    uploaded_at: "2025-01-20"
  },
  {
    id: "med-5",
    name: "Harare Restaurant Table Beverage Service",
    url: "/crystal_ice_storefront.jpg",
    category: "delivery",
    size_kb: 480,
    uploaded_at: "2025-02-01"
  }
];

export const initialProcessSteps = [
  {
    id: "step-1",
    step_number: 1,
    title: "Multi-Stage Deep Filtration & RO Purification",
    description: "Source water undergoes clinical sediment filtration, carbon bed deodorization, reverse osmosis, and intense UV sterilization to reach absolute crystal clarity.",
    icon: "ShieldCheck",
    published: true
  },
  {
    id: "step-2",
    step_number: 2,
    title: "Sub-Zero Agitated Freezing & Ice Block Extraction",
    description: "Pure water is frozen with constant flow circulation to eliminate air bubbles and dissolved gases, creating diamond-clear ice tubes and high-density 10kg blocks.",
    icon: "ThermometerSnowflake",
    published: true
  },
  {
    id: "step-3",
    step_number: 3,
    title: "Automated Hygienic Bagging & Heat-Sealing",
    description: "Cubes are weighed into sturdy 2.5kg and 5kg food-grade poly bags with integrated comfort carry handles, untouched by human hands.",
    icon: "Package",
    published: true
  },
  {
    id: "step-4",
    step_number: 4,
    title: "Refrigerated Fleet Dispatch Across Greater Harare",
    description: "Insulated delivery trucks depart daily from our Waterfalls loading dock, guaranteeing zero melt loss right to your bar or cold storage.",
    icon: "Truck",
    published: true
  }
];

export const initialPortfolioItems = [
  {
    id: "port-1",
    client_name: "The Terrace Bar & Grill, Avondale",
    category: "Hospitality & Bars",
    description: "Dedicated weekly recurring ice contract delivering 120 bags of 2.5kg cubes and 10 solid blocks every Friday afternoon.",
    volume_supplied: "150 Bags / Week",
    image_url: "/crystal_ice_storefront.jpg",
    featured: true,
    published: true
  },
  {
    id: "port-2",
    client_name: "Zambezi River Commercial Broiler Intake",
    category: "Agricultural Blast Freezing",
    description: "Rapid -20°C core blast freezing of 3,500 whole dressed chickens per week, packaged into clean export-standard crates.",
    volume_supplied: "4.5 Tonnes / Week",
    image_url: "/crystal_ice_storefront.jpg",
    featured: true,
    published: true
  },
  {
    id: "port-3",
    client_name: "Harare International Food & Music Festival",
    category: "Large Events & Catering",
    description: "Emergency high-volume ice delivery of 400 x 2.5kg bags and 25 x 10kg blocks with temperature-controlled onsite replenishment trailer.",
    volume_supplied: "2.5 Tonnes Event Total",
    image_url: "/crystal_ice_storefront.jpg",
    featured: true,
    published: true
  }
];

export const initialNewsItems = [
  {
    id: "news-1",
    title: "Summer Daily Ice Production Scaled to 35-Tonnes",
    category: "Capacity Expansion" as const,
    summary: "Crystal Ice has commissioned upgraded automated cube freezing lines at our Waterfalls plant to meet peak summer demand for bars and restaurants across Harare.",
    date: "2026-09-01",
    published: true
  },
  {
    id: "news-2",
    title: "Commercial Meat Blast Freezing Intake Slots Open",
    category: "Operational Alert" as const,
    summary: "Harare poultry farmers and butcheries can now reserve scheduled 24-hour blast freezing batches at our standard $0.25/bird and $0.20/kg rates.",
    date: "2026-09-05",
    published: true
  }
];
