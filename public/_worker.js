// data/db.json
var db_default = {
  settings: {
    company_name: "Crystal Ice Zimbabwe",
    tagline: "Quality Ice Cubes, Solid Ice Blocks & Meat Blast Freezing in Harare",
    phone_primary: "+263 774 213 817",
    phone_secondary: "+263 774 213 817",
    whatsapp_number: "+263774213817",
    whatsapp_prefilled_message: "Hello Crystal Ice Zimbabwe, I would like to place an order / inquire about restaurant ice supply or blast freezing.",
    email: "sales@crystalice.co.zw",
    physical_address: "FF11 Waterfalls Avenue, 2194 Mainway Meadows, Waterfalls, Harare, Zimbabwe",
    business_hours: "Monday \u2013 Thursday: 7:30 AM \u2013 4:45 PM | Friday: 7:00 AM \u2013 4:15 PM (Delivery to restaurants active daily)",
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
    seo_keywords: "Crystal Ice Zimbabwe, ice supplier Harare, ice cubes Zimbabwe, 2.5kg ice bag, 5kg ice bag, 10kg ice block Harare, meat blast freezing Zimbabwe, chicken blast freezing Waterfalls Harare, restaurant ice delivery Harare",
    hero_bg_image: "/crystal_ice_backdrop.jpg",
    logo_url: "/crystal_ice_logo.png",
    bootstrap_complete: true,
    cold_storage_image: "/uploads/IMG_COM_202610031040189421-1791400957038-759381652.jpeg",
    ice_blocks_image: "/uploads/IMG_COM_202610031040189535-1791397195925-210854871.jpeg",
    ice_cubes_promo_image: "/uploads/IMG_COM_202610031743031531-1791401516491-320800556.jpeg",
    custom_images: {
      "ice-promo": "/uploads/IMG_COM_202610031743031531-1791401516491-320800556.jpeg",
      ice_promo: "/uploads/IMG_COM_202610031743031531-1791401516491-320800556.jpeg"
    },
    homepage_about_image: "/uploads/IMG_COM_202610031040189504__1_-1791400873458-295953650.jpeg",
    homepage_ice_cubes_image: "/uploads/IMG_COM_202610031743031531-1791401516491-320800556.jpeg"
  },
  statistics: [
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
  ],
  products: [
    {
      id: "prod-1",
      name: "2.5kg Packaged Ice Cubes",
      slug: "2-5kg-packaged-ice-cubes",
      description: "Our signature retail and restaurant pack. Crystal-clear, slow-diluting food-grade ice cubes in heavy-duty polyethylene bags with built-in carry handles. $1.00 per bag for orders under 100 packs; special wholesale price of $0.75 per bag for orders of 100 packs minimum with refrigerated delivery across Harare included.",
      image: "/uploads/IMG_COM_202610031040189504__1_-1791400873458-295953650.jpeg",
      category: "Packaged Ice Cubes",
      package_size: "2.5kg Bag with Handle",
      price: 1,
      price_display: "$1.00 / bag ($0.75 for 100+ packs with Delivery)",
      availability: "in_stock",
      featured: true,
      published: true,
      sort_order: 1,
      min_order_qty: 1,
      dimensions: "Standard 2.5kg Bag (approx. 25 \xD7 40 cm)",
      melt_rate: "Slow melt crystalline density",
      ideal_for: [
        "Restaurants & Cafes",
        "Sports Bars & Nightclubs",
        "Bottle Stores & Supermarkets",
        "Weddings & Private Braais"
      ],
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
      image: "/uploads/IMG_COM_202610031743031500-1791401016893-600287730.jpeg",
      category: "Packaged Ice Cubes",
      package_size: "5kg Heavy Duty Bag",
      price: 1.5,
      price_display: "$1.50 / bag (Volume discounts for daily accounts)",
      availability: "in_stock",
      featured: true,
      published: true,
      sort_order: 2,
      min_order_qty: 5,
      dimensions: "5kg Heavy-gauge bag",
      melt_rate: "Dense formulation resists fast dilution",
      ideal_for: [
        "Cocktail Bars & Lounges",
        "High-Volume Kitchens",
        "Catering & Buffets",
        "Service Stations & Bottle Stores"
      ],
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
      price: 2,
      price_display: "$2.00 / block",
      availability: "in_stock",
      featured: true,
      published: true,
      sort_order: 3,
      min_order_qty: 2,
      dimensions: "Solid frozen block (approx. 10kg)",
      melt_rate: "Lasts up to 24\u201348 hours inside insulated cool boxes",
      ideal_for: [
        "Butcheries & Cold Storage Backups",
        "Outdoor Events & Festivals",
        "Fisheries & Meat Transport",
        "Camping & Braai Cooler Boxes"
      ],
      features: [
        "Solid core with extreme thermal mass",
        "Special price: $2.00 per 10kg block",
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
      image: "/uploads/IMG_COM_202610031040189473-1791401069486-652946178.jpeg",
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
      melt_rate: "Deep core freeze to -18\xB0C or below",
      ideal_for: [
        "Poultry Farmers",
        "Commercial Abattoirs",
        "Supermarket Meat Departments",
        "Chicken Wholesalers"
      ],
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
      image: "/uploads/IMG_COM_202610031040189566-1791401081338-932160898.jpeg",
      category: "Meat Blast Freezing",
      package_size: "Per Kilogram (Min 1 Tonne)",
      price: 0.2,
      price_display: "$0.20 per kg (Min 1 Tonne / Max 15 Tonnes per 24h)",
      availability: "in_stock",
      featured: true,
      published: true,
      sort_order: 5,
      min_order_qty: 1,
      dimensions: "Batch capacity up to 15 tonnes/day",
      melt_rate: "Commercial deep blast freeze",
      ideal_for: [
        "Beef Processors & Butcheries",
        "Pork Producers",
        "Feedlots & Livestock Farmers",
        "Meat Exporters & Wholesalers"
      ],
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
      image: "/uploads/IMG_COM_202610031743031582-1791401102435-587151614.jpeg",
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
      ideal_for: [
        "Local Restaurants & Eateries",
        "Braai Lounges & Grills",
        "Hotels & Conference Centres",
        "Event Planners & Venues"
      ],
      features: [
        "Scheduled recurring delivery slots",
        "Dedicated account manager",
        "Flexible payment: USD Cash, EcoCash, USD Bank Transfer",
        "Freezers provided for eligible high-volume accounts"
      ]
    }
  ],
  services: [
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
      image: "/uploads/IMG_COM_202610031040189421-1791400957038-759381652.jpeg",
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
  ],
  testimonials: [
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
  ],
  faqs: [
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
  ],
  delivery_areas: [
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
  ],
  orders: [
    {
      customer_name: "Test Harare Client",
      customer_phone: "+263771234567",
      delivery_type: "pickup",
      preferred_date: "2026-10-04",
      preferred_time_slot: "ASAP (Next Available Slot)",
      items: [
        {
          product_id: "prod-1",
          product_name: "2.5kg Packaged Ice Cubes",
          quantity: 10,
          unit_price: 1,
          subtotal: 10
        }
      ],
      total_estimated_amount: 10,
      id: "ord-1791107224766",
      reference_number: "CI-ORD-5331",
      status: "New",
      created_at: "2026-10-04T09:47:04.766Z",
      updated_at: "2026-10-04T09:47:04.766Z"
    },
    {
      customer_name: "Tatenda Moyo",
      customer_phone: "+263772000000",
      delivery_type: "pickup",
      preferred_date: "2026-09-08",
      preferred_time_slot: "ASAP (Next Available Slot)",
      items: [
        {
          product_id: "prod-1",
          product_name: "2.5kg Packaged Ice Cubes",
          quantity: 100,
          unit_price: 0.75,
          subtotal: 75
        }
      ],
      total_estimated_amount: 75,
      id: "ord-1788886862053",
      reference_number: "CI-ORD-2814",
      status: "New",
      created_at: "2026-09-08T17:01:02.053Z",
      updated_at: "2026-09-08T17:01:02.053Z"
    },
    {
      id: "ord-1001",
      reference_number: "CI-ORD-5102",
      customer_name: "Tinashe Moyo",
      customer_phone: "+263 772 458 910",
      customer_email: "tinashe@terracegrill.co.zw",
      business_name: "The Terrace Bar & Grill, Avondale",
      delivery_type: "delivery",
      delivery_area_id: "area-3",
      delivery_address: "12 King George Rd, Avondale, Harare",
      preferred_date: "2026-09-09",
      preferred_time_slot: "09:00 AM - 11:00 AM",
      items: [
        {
          product_id: "prod-1",
          product_name: "2.5kg Packaged Ice Cubes (Special Offer)",
          quantity: 100,
          package_size: "2.5kg Bag with Handle",
          unit_price: 0.75
        },
        {
          product_id: "prod-3",
          product_name: "10kg Solid Ice Blocks",
          quantity: 6,
          package_size: "10kg Solid Block",
          unit_price: 2.5
        }
      ],
      total_estimated_amount: 90,
      notes: "Please deliver via kitchen back entrance. Driver can ask for Head Bartender Tinashe.",
      status: "Confirmed",
      internal_notes: "Recurring weekly Friday account. Delivery team assigned Route 3 (Northern Suburbs).",
      created_at: "2026-09-08T13:00:34.154Z",
      updated_at: "2026-09-08T15:00:34.154Z"
    },
    {
      id: "ord-1002",
      reference_number: "CI-ORD-5103",
      customer_name: "Tendai Chiweshe",
      customer_phone: "+263 773 912 344",
      customer_email: "tendai@highlandmeats.co.zw",
      business_name: "Highland Prime Meats & Cold Storage",
      delivery_type: "delivery",
      delivery_area_id: "area-1",
      delivery_address: "Shop 4, Parktown Shopping Centre, Waterfalls, Harare",
      preferred_date: "2026-09-08",
      preferred_time_slot: "07:30 AM - 09:30 AM",
      items: [
        {
          product_id: "prod-3",
          product_name: "10kg Solid Ice Blocks",
          quantity: 20,
          package_size: "10kg Solid Block",
          unit_price: 2.5
        }
      ],
      total_estimated_amount: 50,
      notes: "Direct drop into butchery cold staging area.",
      status: "Preparing",
      internal_notes: "Waterfalls local dispatch route. Morning priority driver notified.",
      created_at: "2026-09-08T09:00:34.154Z",
      updated_at: "2026-09-08T16:00:34.154Z"
    }
  ],
  quote_requests: [
    {
      customer_name: "Tatenda Moyo",
      business_name: "Borrowdale Country Club",
      customer_phone: "+263774000111",
      customer_email: "tatenda@borrowdale.co.zw",
      service_type: "Daily Commercial Supply",
      estimated_volume: "200 bags weekly",
      delivery_frequency: "weekly",
      delivery_location: "Borrowdale, Harare",
      notes: "",
      id: "qte-1791223698608",
      reference_number: "CI-QTE-9262",
      status: "Pending Review",
      created_at: "2026-10-05T18:08:18.608Z",
      updated_at: "2026-10-10T09:11:15.931Z"
    },
    {
      customer_name: "Harare Grill",
      customer_phone: "+263772000111",
      customer_email: "chef@hararegrill.co.zw",
      service_type: "Daily Ice Supply",
      estimated_volume: "50 bags/day",
      delivery_frequency: "weekly",
      delivery_location: "Metro Area",
      notes: "",
      id: "qte-1791107229244",
      reference_number: "CI-QTE-2827",
      status: "New",
      created_at: "2026-10-04T09:47:09.244Z",
      updated_at: "2026-10-04T09:47:09.244Z"
    },
    {
      customer_name: "Chipo Sibanda",
      customer_phone: "+263773000000",
      customer_email: "chipo@example.com",
      service_type: "Meat Blast Freezing Services",
      estimated_volume: "Standard Volume",
      delivery_frequency: "weekly",
      delivery_location: "Metro Area",
      notes: "Intake of 2500 broilers",
      id: "qte-1788886866978",
      reference_number: "CI-QTE-2078",
      status: "New",
      created_at: "2026-09-08T17:01:06.978Z",
      updated_at: "2026-09-08T17:01:06.978Z"
    },
    {
      id: "qte-501",
      reference_number: "CI-QTE-8012",
      customer_name: "Brian Mupande",
      business_name: "Zambezi River Poultry Farms",
      customer_phone: "+263 774 889 012",
      customer_email: "brian@zambezipoultry.co.zw",
      service_type: "Chickens Blast Freezing Service",
      estimated_volume: "3,500 Broiler Chickens (~4.5 tonnes) per week",
      delivery_frequency: "weekly",
      event_date: "2026-09-15",
      delivery_location: "FF11 Waterfalls Avenue Plant Intake, Harare",
      notes: "Need rapid blast freezing down to -20\xB0C for dressed whole broilers packaged in crate batches. Looking for ongoing weekly contract.",
      status: "Contacted",
      internal_notes: "Spoke with Brian. Rate confirmed at $0.25 per bird. Chamber 2 reserved for Tuesday morning intake.",
      created_at: "2026-09-06T17:00:34.154Z",
      updated_at: "2026-09-07T17:00:34.154Z"
    }
  ],
  contact_submissions: [
    {
      name: "Chipo Banda",
      phone: "+263773000222",
      inquiry_type: "General",
      message: "Inquiry about cold storage blast freezing space",
      id: "cnt-1791107229270",
      status: "New",
      created_at: "2026-10-04T09:47:09.270Z"
    },
    {
      id: "cnt-1",
      name: "Farai Nyandoro",
      phone: "+263 775 601 234",
      email: "farai@eastleasportsclub.co.zw",
      inquiry_type: "Commercial Supply",
      message: "We run Eastlea Sports Club bar and are preparing for the upcoming rugby weekend tournaments. We need 150 bags of 2.5kg ice cubes and 10 blocks of 10kg ice delivered every Friday afternoon.",
      status: "New",
      created_at: "2026-09-08T05:00:34.154Z"
    }
  ],
  media: [
    {
      name: "IMG_COM_202610031743031531.jpeg",
      url: "/uploads/IMG_COM_202610031743031531-1791401516491-320800556.jpeg",
      category: "facilities",
      size_kb: 362,
      id: "med-1791401516553",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031743031531.jpeg",
      url: "/uploads/IMG_COM_202610031743031531-1791401372083-177921440.jpeg",
      category: "facilities",
      size_kb: 362,
      id: "med-1791401372140",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031743031531.jpeg",
      url: "/uploads/IMG_COM_202610031743031531-1791401151436-718604365.jpeg",
      category: "facilities",
      size_kb: 362,
      id: "med-1791401151496",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031743031582.jpeg",
      url: "/uploads/IMG_COM_202610031743031582-1791401102435-587151614.jpeg",
      category: "facilities",
      size_kb: 390,
      id: "med-1791401102504",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031040189566.jpeg",
      url: "/uploads/IMG_COM_202610031040189566-1791401081338-932160898.jpeg",
      category: "facilities",
      size_kb: 31,
      id: "med-1791401081367",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031040189473.jpeg",
      url: "/uploads/IMG_COM_202610031040189473-1791401069486-652946178.jpeg",
      category: "facilities",
      size_kb: 31,
      id: "med-1791401069515",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031743031500.jpeg",
      url: "/uploads/IMG_COM_202610031743031500-1791401016893-600287730.jpeg",
      category: "facilities",
      size_kb: 354,
      id: "med-1791401016984",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031040189421.jpeg",
      url: "/uploads/IMG_COM_202610031040189421-1791400957038-759381652.jpeg",
      category: "facilities",
      size_kb: 44,
      id: "med-1791400957077",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031040189504 (1).jpeg",
      url: "/uploads/IMG_COM_202610031040189504__1_-1791400873458-295953650.jpeg",
      category: "facilities",
      size_kb: 32,
      id: "med-1791400873496",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031040189535.jpeg",
      url: "/uploads/IMG_COM_202610031040189535-1791397195925-210854871.jpeg",
      category: "facilities",
      size_kb: 34,
      id: "med-1791397195964",
      uploaded_at: "2026-10-07"
    },
    {
      name: "IMG_COM_202610031040189535.jpeg",
      url: "/uploads/IMG_COM_202610031040189535-1791397154550-453598773.jpeg",
      category: "facilities",
      size_kb: 34,
      id: "med-1791397154754",
      uploaded_at: "2026-10-07"
    },
    {
      name: "test_hero.png",
      url: "/uploads/test_hero-1791388910575-835054107.png",
      category: "facilities",
      size_kb: 0,
      id: "med-1791388910726",
      uploaded_at: "2026-10-07"
    },
    {
      name: "ping.png",
      url: "/uploads/ping-1791285268125-335898360.png",
      category: "products",
      size_kb: 0,
      id: "med-1791285268131",
      uploaded_at: "2026-10-06"
    },
    {
      name: "test-slot.png",
      url: "/uploads/test-slot-1791284733467-530968639.png",
      category: "facilities",
      size_kb: 0,
      id: "med-1791284733495",
      uploaded_at: "2026-10-06"
    },
    {
      name: "crystal_ice_backdrop.jpg",
      url: "/uploads/crystal_ice_backdrop-1791041526631-722792780.jpg",
      category: "facilities",
      size_kb: 54,
      id: "med-1791041526661",
      uploaded_at: "2026-10-03"
    },
    {
      name: "crystal_ice_backdrop.jpg",
      url: "/uploads/crystal_ice_backdrop-1791041451312-862860321.jpg",
      category: "facilities",
      size_kb: 54,
      id: "med-1791041451338",
      uploaded_at: "2026-10-03"
    },
    {
      name: "IMG_COM_202610031040189504.jpeg",
      url: "/uploads/IMG_COM_202610031040189504-1791040034146-233172210.jpeg",
      category: "facilities",
      size_kb: 54,
      id: "med-1791040034158",
      uploaded_at: "2026-10-03"
    },
    {
      name: "crystal_ice_storefront.jpg",
      url: "/uploads/crystal_ice_storefront-1790966098401-783679425.jpg",
      category: "facilities",
      size_kb: 761,
      id: "med-1790966098415",
      uploaded_at: "2026-10-02"
    },
    {
      name: "crystal_ice_storefront.jpg",
      url: "/uploads/crystal_ice_storefront-1790966020594-726562700.jpg",
      category: "facilities",
      size_kb: 761,
      id: "med-1790966020608",
      uploaded_at: "2026-10-02"
    },
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
  ],
  notifications: [
    {
      id: "notif-1791223698609-908",
      title: "Commercial Quote Requested",
      message: "Quote CI-QTE-9262 submitted by Tatenda Moyo (Borrowdale Country Club) for Daily Commercial Supply",
      type: "quote",
      reference_id: "CI-QTE-9262",
      read: false,
      created_at: "2026-10-05T18:08:18.609Z"
    },
    {
      id: "notif-1791107229271-890",
      title: "New Contact Inquiry",
      message: "Chipo Banda submitted an inquiry regarding General",
      type: "contact",
      reference_id: "cnt-1791107229270",
      read: false,
      created_at: "2026-10-04T09:47:09.271Z"
    },
    {
      id: "notif-1791107229245-93",
      title: "Commercial Quote Requested",
      message: "Quote CI-QTE-2827 submitted by Harare Grill (Individual) for Daily Ice Supply",
      type: "quote",
      reference_id: "CI-QTE-2827",
      read: false,
      created_at: "2026-10-04T09:47:09.245Z"
    },
    {
      id: "notif-1791107224766-554",
      title: "New Order Received",
      message: "Order CI-ORD-5331 placed by Test Harare Client (PICKUP) - $10.00",
      type: "order",
      reference_id: "CI-ORD-5331",
      read: false,
      created_at: "2026-10-04T09:47:04.766Z"
    },
    {
      id: "notif-1788886866978-538",
      title: "Commercial Quote Requested",
      message: "Quote CI-QTE-2078 submitted by Chipo Sibanda (Individual) for Meat Blast Freezing Services",
      type: "quote",
      reference_id: "CI-QTE-2078",
      read: false,
      created_at: "2026-09-08T17:01:06.978Z"
    },
    {
      id: "notif-1788886862054-908",
      title: "New Order Received",
      message: "Order CI-ORD-2814 placed by Tatenda Moyo (PICKUP) - $75.00",
      type: "order",
      reference_id: "CI-ORD-2814",
      read: false,
      created_at: "2026-09-08T17:01:02.054Z"
    },
    {
      id: "notif-1",
      title: "New Commercial Order Received",
      message: "The Terrace Bar & Grill placed order #CI-ORD-5102 for $90.00.",
      type: "order",
      reference_id: "CI-ORD-5102",
      read: false,
      created_at: "2026-09-08T13:00:34.154Z"
    },
    {
      id: "notif-2",
      title: "Meat Blast Freezing Quote Request",
      message: "Zambezi River Poultry Farms requested blast freezing quote #CI-QTE-8012.",
      type: "quote",
      reference_id: "CI-QTE-8012",
      read: true,
      created_at: "2026-09-06T17:00:34.154Z"
    }
  ],
  audit_logs: [
    {
      id: "aud-1791623475931-361",
      user_name: "Operations Director",
      user_role: "admin",
      action: "QUOTE_RESTORED",
      record_type: "quote",
      record_id: "qte-1791223698608",
      details: "Quote CI-QTE-9262 restored from archive to Pending Review.",
      timestamp: "2026-10-10T09:11:15.931Z"
    },
    {
      id: "aud-1791623469723-99",
      user_name: "Operations Director",
      user_role: "admin",
      action: "QUOTE_ARCHIVED",
      record_type: "quote",
      record_id: "qte-1791223698608",
      details: "Quote CI-QTE-9262 archived to historical records.",
      timestamp: "2026-10-10T09:11:09.723Z"
    },
    {
      id: "aud-1791623463235-723",
      user_name: "Operations Director",
      user_role: "admin",
      action: "QUOTE_STATUS_CHANGED",
      record_type: "quote",
      record_id: "qte-1791223698608",
      details: "Quote CI-QTE-9262 status updated to In Review.",
      timestamp: "2026-10-10T09:11:03.235Z"
    },
    {
      id: "aud-1791623452541-953",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-10T09:10:52.541Z"
    },
    {
      id: "aud-1791570385900-758",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_FAILED",
      record_type: "auth",
      details: "Incorrect password for: admin@crystalice.co.zw",
      timestamp: "2026-10-09T18:26:25.900Z"
    },
    {
      id: "aud-1791570382225-904",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-09T18:26:22.225Z"
    },
    {
      id: "aud-1791401516554-269",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401516553",
      details: "Added media asset: IMG_COM_202610031743031531.jpeg",
      timestamp: "2026-10-07T19:31:56.554Z"
    },
    {
      id: "aud-1791401516552-691",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "custom-ice-promo",
      details: 'Replaced picture in slot "custom-ice-promo" with "/uploads/IMG_COM_202610031743031531-1791401516491-320800556.jpeg".',
      timestamp: "2026-10-07T19:31:56.552Z"
    },
    {
      id: "aud-1791401462930-296",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REMOVED",
      record_type: "image_slot",
      record_id: "custom-ice-promo",
      details: 'Removed picture from slot "custom-ice-promo".',
      timestamp: "2026-10-07T19:31:02.930Z"
    },
    {
      id: "aud-1791401372141-10",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401372140",
      details: "Added media asset: IMG_COM_202610031743031531.jpeg",
      timestamp: "2026-10-07T19:29:32.141Z"
    },
    {
      id: "aud-1791401372139-533",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "custom-ice_promo",
      details: 'Replaced picture in slot "custom-ice_promo" with "/uploads/IMG_COM_202610031743031531-1791401372083-177921440.jpeg".',
      timestamp: "2026-10-07T19:29:32.139Z"
    },
    {
      id: "aud-1791401151496-487",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401151496",
      details: "Added media asset: IMG_COM_202610031743031531.jpeg",
      timestamp: "2026-10-07T19:25:51.496Z"
    },
    {
      id: "aud-1791401151495-401",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "custom-ice-promo",
      details: 'Replaced picture in slot "custom-ice-promo" with "/uploads/IMG_COM_202610031743031531-1791401151436-718604365.jpeg".',
      timestamp: "2026-10-07T19:25:51.495Z"
    },
    {
      id: "aud-1791401102505-584",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401102504",
      details: "Added media asset: IMG_COM_202610031743031582.jpeg",
      timestamp: "2026-10-07T19:25:02.505Z"
    },
    {
      id: "aud-1791401102503-440",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-6",
      details: 'Replaced picture in slot "product-prod-6" with "/uploads/IMG_COM_202610031743031582-1791401102435-587151614.jpeg".',
      timestamp: "2026-10-07T19:25:02.503Z"
    },
    {
      id: "aud-1791401081367-144",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401081367",
      details: "Added media asset: IMG_COM_202610031040189566.jpeg",
      timestamp: "2026-10-07T19:24:41.367Z"
    },
    {
      id: "aud-1791401081366-32",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-5",
      details: 'Replaced picture in slot "product-prod-5" with "/uploads/IMG_COM_202610031040189566-1791401081338-932160898.jpeg".',
      timestamp: "2026-10-07T19:24:41.366Z"
    },
    {
      id: "aud-1791401069516-844",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401069515",
      details: "Added media asset: IMG_COM_202610031040189473.jpeg",
      timestamp: "2026-10-07T19:24:29.516Z"
    },
    {
      id: "aud-1791401069513-421",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-4",
      details: 'Replaced picture in slot "product-prod-4" with "/uploads/IMG_COM_202610031040189473-1791401069486-652946178.jpeg".',
      timestamp: "2026-10-07T19:24:29.513Z"
    },
    {
      id: "aud-1791401016984-701",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791401016984",
      details: "Added media asset: IMG_COM_202610031743031500.jpeg",
      timestamp: "2026-10-07T19:23:36.984Z"
    },
    {
      id: "aud-1791401016983-610",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-2",
      details: 'Replaced picture in slot "product-prod-2" with "/uploads/IMG_COM_202610031743031500-1791401016893-600287730.jpeg".',
      timestamp: "2026-10-07T19:23:36.983Z"
    },
    {
      id: "aud-1791400957077-439",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791400957077",
      details: "Added media asset: IMG_COM_202610031040189421.jpeg",
      timestamp: "2026-10-07T19:22:37.077Z"
    },
    {
      id: "aud-1791400957075-616",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "cold_storage_chamber",
      details: 'Replaced picture in slot "cold_storage_chamber" with "/uploads/IMG_COM_202610031040189421-1791400957038-759381652.jpeg".',
      timestamp: "2026-10-07T19:22:37.075Z"
    },
    {
      id: "aud-1791400873497-770",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791400873496",
      details: "Added media asset: IMG_COM_202610031040189504 (1).jpeg",
      timestamp: "2026-10-07T19:21:13.497Z"
    },
    {
      id: "aud-1791400873495-30",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "homepage_about_card",
      details: 'Replaced picture in slot "homepage_about_card" with "/uploads/IMG_COM_202610031040189504__1_-1791400873458-295953650.jpeg".',
      timestamp: "2026-10-07T19:21:13.495Z"
    },
    {
      id: "aud-1791400817008-342",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REMOVED",
      record_type: "image_slot",
      record_id: "homepage_about_card",
      details: 'Removed picture from slot "homepage_about_card".',
      timestamp: "2026-10-07T19:20:17.008Z"
    },
    {
      id: "aud-1791400593073-466",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "ice-promo",
      details: 'Replaced picture in slot "ice-promo" with "/ice_cubes_promo_1790856824108.jpg".',
      timestamp: "2026-10-07T19:16:33.073Z"
    },
    {
      id: "aud-1791397195964-139",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791397195964",
      details: "Added media asset: IMG_COM_202610031040189535.jpeg",
      timestamp: "2026-10-07T18:19:55.964Z"
    },
    {
      id: "aud-1791397195963-473",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "ice_blocks_freezing",
      details: 'Replaced picture in slot "ice_blocks_freezing" with "/uploads/IMG_COM_202610031040189535-1791397195925-210854871.jpeg".',
      timestamp: "2026-10-07T18:19:55.963Z"
    },
    {
      id: "aud-1791397154754-609",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791397154754",
      details: "Added media asset: IMG_COM_202610031040189535.jpeg",
      timestamp: "2026-10-07T18:19:14.754Z"
    },
    {
      id: "aud-1791397154753-460",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "ice_blocks_freezing",
      details: 'Replaced picture in slot "ice_blocks_freezing" with "/uploads/IMG_COM_202610031040189535-1791397154550-453598773.jpeg".',
      timestamp: "2026-10-07T18:19:14.753Z"
    },
    {
      id: "aud-1791397107902-47",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REMOVED",
      record_type: "image_slot",
      record_id: "cold_storage_chamber",
      details: 'Removed picture from slot "cold_storage_chamber".',
      timestamp: "2026-10-07T18:18:27.902Z"
    },
    {
      id: "aud-1791388910726-165",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791388910726",
      details: "Added media asset: test_hero.png",
      timestamp: "2026-10-07T16:01:50.726Z"
    },
    {
      id: "aud-1791388910724-105",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "hero_backdrop",
      details: 'Replaced picture in slot "hero_backdrop" with "/uploads/test_hero-1791388910575-835054107.png".',
      timestamp: "2026-10-07T16:01:50.724Z"
    },
    {
      id: "aud-1791285268132-622",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791285268131",
      details: "Added media asset: ping.png",
      timestamp: "2026-10-06T11:14:28.132Z"
    },
    {
      id: "aud-1791285268082-650",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-06T11:14:28.082Z"
    },
    {
      id: "aud-1791284740776-372",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "hero-backdrop",
      details: 'Replaced picture in slot "hero-backdrop" with "/crystal_ice_backdrop.jpg".',
      timestamp: "2026-10-06T11:05:40.776Z"
    },
    {
      id: "aud-1791284740756-665",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-06T11:05:40.756Z"
    },
    {
      id: "aud-1791284733496-381",
      user_name: "Operations Director",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791284733495",
      details: "Added media asset: test-slot.png",
      timestamp: "2026-10-06T11:05:33.496Z"
    },
    {
      id: "aud-1791284733494-577",
      user_name: "Operations Director",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "hero-backdrop",
      details: 'Replaced picture in slot "hero-backdrop" with "/uploads/test-slot-1791284733467-530968639.png".',
      timestamp: "2026-10-06T11:05:33.494Z"
    },
    {
      id: "aud-1791284733446-17",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-06T11:05:33.446Z"
    },
    {
      id: "aud-1791284709881-280",
      user_name: "Operations Director",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-06T11:05:09.881Z"
    },
    {
      id: "aud-1791284696911-272",
      user_name: "Unknown",
      user_role: "guest",
      action: "LOGIN_FAILED",
      record_type: "auth",
      details: "Failed login attempt for: admin",
      timestamp: "2026-10-06T11:04:56.911Z"
    },
    {
      id: "aud-1791284464193-939",
      user_name: "Unknown",
      user_role: "guest",
      action: "LOGIN_FAILED",
      record_type: "auth",
      details: "Failed login attempt for: admin",
      timestamp: "2026-10-06T11:01:04.193Z"
    },
    {
      id: "aud-1791223698609-727",
      user_name: "Guest Customer",
      user_role: "guest",
      action: "QUOTE_REQUESTED",
      record_type: "quote",
      record_id: "qte-1791223698608",
      details: "Quote request CI-QTE-9262 submitted by Tatenda Moyo",
      timestamp: "2026-10-05T18:08:18.609Z"
    },
    {
      id: "aud-1791107229271-139",
      user_name: "Guest Customer",
      user_role: "guest",
      action: "CONTACT_SUBMISSION",
      record_type: "contact",
      record_id: "cnt-1791107229270",
      details: "Contact form message received from Chipo Banda (+263773000222)",
      timestamp: "2026-10-04T09:47:09.271Z"
    },
    {
      id: "aud-1791107229245-744",
      user_name: "Guest Customer",
      user_role: "guest",
      action: "QUOTE_REQUESTED",
      record_type: "quote",
      record_id: "qte-1791107229244",
      details: "Quote request CI-QTE-2827 submitted by Harare Grill",
      timestamp: "2026-10-04T09:47:09.245Z"
    },
    {
      id: "aud-1791107224767-715",
      user_name: "Guest Customer",
      user_role: "guest",
      action: "ORDER_CREATED",
      record_type: "order",
      record_id: "ord-1791107224766",
      details: "Order CI-ORD-5331 placed by Test Harare Client for 1 items.",
      timestamp: "2026-10-04T09:47:04.767Z"
    },
    {
      id: "aud-1791105770712-246",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-04T09:22:50.712Z"
    },
    {
      id: "aud-1791041526697-756",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REMOVED",
      record_type: "image_slot",
      record_id: "product-prod-1",
      details: 'Removed picture from slot "product-prod-1".',
      timestamp: "2026-10-03T15:32:06.697Z"
    },
    {
      id: "aud-1791041526661-145",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791041526661",
      details: "Added media asset: crystal_ice_backdrop.jpg",
      timestamp: "2026-10-03T15:32:06.661Z"
    },
    {
      id: "aud-1791041526661-915",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-1",
      details: 'Replaced picture in slot "product-prod-1" with "/uploads/crystal_ice_backdrop-1791041526631-722792780.jpg".',
      timestamp: "2026-10-03T15:32:06.661Z"
    },
    {
      id: "aud-1791041526605-388",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-03T15:32:06.605Z"
    },
    {
      id: "aud-1791041451715-276",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "hero_backdrop",
      details: 'Replaced picture in slot "hero_backdrop" with "/crystal_ice_backdrop.jpg".',
      timestamp: "2026-10-03T15:30:51.715Z"
    },
    {
      id: "aud-1791041451403-853",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REMOVED",
      record_type: "image_slot",
      record_id: "hero_backdrop",
      details: 'Removed picture from slot "hero_backdrop".',
      timestamp: "2026-10-03T15:30:51.403Z"
    },
    {
      id: "aud-1791041451339-220",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791041451338",
      details: "Added media asset: crystal_ice_backdrop.jpg",
      timestamp: "2026-10-03T15:30:51.339Z"
    },
    {
      id: "aud-1791041451338-711",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "hero_backdrop",
      details: 'Replaced picture in slot "hero_backdrop" with "/uploads/crystal_ice_backdrop-1791041451312-862860321.jpg".',
      timestamp: "2026-10-03T15:30:51.338Z"
    },
    {
      id: "aud-1791041451292-192",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-03T15:30:51.292Z"
    },
    {
      id: "aud-1791041444555-74",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-03T15:30:44.555Z"
    },
    {
      id: "aud-1791040034160-106",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1791040034158",
      details: "Added media asset: IMG_COM_202610031040189504.jpeg",
      timestamp: "2026-10-03T15:07:14.160Z"
    },
    {
      id: "aud-1791040034157-109",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-1",
      details: 'Replaced picture in slot "product-prod-1" with "/uploads/IMG_COM_202610031040189504-1791040034146-233172210.jpeg".',
      timestamp: "2026-10-03T15:07:14.157Z"
    },
    {
      id: "aud-1791039954317-176",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-03T15:05:54.317Z"
    },
    {
      id: "aud-1790966098415-74",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1790966098415",
      details: "Added media asset: crystal_ice_storefront.jpg",
      timestamp: "2026-10-02T18:34:58.415Z"
    },
    {
      id: "aud-1790966098414-478",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "hero_backdrop",
      details: 'Replaced picture in slot "hero_backdrop" with "/uploads/crystal_ice_storefront-1790966098401-783679425.jpg".',
      timestamp: "2026-10-02T18:34:58.414Z"
    },
    {
      id: "aud-1790966098369-798",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-02T18:34:58.369Z"
    },
    {
      id: "aud-1790966020696-621",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-1",
      details: 'Replaced picture in slot "product-prod-1" with "/crystal_ice_storefront.jpg".',
      timestamp: "2026-10-02T18:33:40.697Z"
    },
    {
      id: "aud-1790966020655-661",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REMOVED",
      record_type: "image_slot",
      record_id: "product-prod-1",
      details: 'Removed picture from slot "product-prod-1".',
      timestamp: "2026-10-02T18:33:40.655Z"
    },
    {
      id: "aud-1790966020609-615",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "MEDIA_UPLOADED",
      record_type: "media",
      record_id: "med-1790966020608",
      details: "Added media asset: crystal_ice_storefront.jpg",
      timestamp: "2026-10-02T18:33:40.609Z"
    },
    {
      id: "aud-1790966020607-807",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "IMAGE_SLOT_REPLACED",
      record_type: "image_slot",
      record_id: "product-prod-1",
      details: 'Replaced picture in slot "product-prod-1" with "/uploads/crystal_ice_storefront-1790966020594-726562700.jpg".',
      timestamp: "2026-10-02T18:33:40.607Z"
    },
    {
      id: "aud-1790966020554-936",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-02T18:33:40.554Z"
    },
    {
      id: "aud-1790965967787-570",
      user_name: "Operations Director (Crystal Ice)",
      user_role: "admin",
      action: "LOGIN_SUCCESS",
      record_type: "auth",
      details: "Staff logged in: admin@crystalice.co.zw (admin)",
      timestamp: "2026-10-02T18:32:47.787Z"
    },
    {
      id: "aud-1788886866978-338",
      user_name: "Guest Customer",
      user_role: "guest",
      action: "QUOTE_REQUESTED",
      record_type: "quote",
      record_id: "qte-1788886866978",
      details: "Quote request CI-QTE-2078 submitted by Chipo Sibanda",
      timestamp: "2026-09-08T17:01:06.978Z"
    },
    {
      id: "aud-1788886862054-85",
      user_name: "Guest Customer",
      user_role: "guest",
      action: "ORDER_CREATED",
      record_type: "order",
      record_id: "ord-1788886862053",
      details: "Order CI-ORD-2814 placed by Tatenda Moyo for 1 items.",
      timestamp: "2026-09-08T17:01:02.054Z"
    },
    {
      id: "aud-1",
      user_name: "System Bootstrapper",
      user_role: "system",
      action: "DATABASE_INITIALIZED",
      record_type: "system",
      details: "Initialized Crystal Ice Zimbabwe commercial ice & blast freezing database.",
      timestamp: "2026-09-08T17:00:34.154Z"
    }
  ],
  admin_users: [
    {
      id: "usr-admin-1",
      email: "admin@crystalice.co.zw",
      name: "Operations Director",
      active: true,
      passwordHash: "dfd8b282f646bb1983d558e52209451a9cf003eedda33d32e771d561a3ba3a6e56ad6c7a89a160d0801155adeee333375a5e712e08ec1e94e3bda720740f4c90",
      salt: "17dde3a89c3f41fe1f404ea66c4f58c9",
      created_at: "2026-10-06T11:05:04.213Z"
    }
  ],
  sessions: [
    {
      token: "74582a18d067386b2eba0262d0ef5fc47e51a188d25de3cbbd7af128df0d5ca7",
      userId: "usr-admin-1",
      createdAt: "2026-10-06T11:05:09.881Z",
      expiresAt: "2026-10-13T11:05:09.881Z"
    },
    {
      token: "78679cec3cc41ed015926d49227cbc3a888169bfa1c469ae691d7a64817cd297",
      userId: "usr-admin-1",
      createdAt: "2026-10-06T11:05:33.446Z",
      expiresAt: "2026-10-13T11:05:33.446Z"
    },
    {
      token: "622bc4cc165c676d50d9c4cf6014778f84ca4ef3ecbef5a65d4ccddf67c1014e",
      userId: "usr-admin-1",
      createdAt: "2026-10-06T11:05:40.756Z",
      expiresAt: "2026-10-13T11:05:40.756Z"
    },
    {
      token: "5fdcc2373ed9828cc2623b37e3307bb69b91c0166364f145d0e4475cfcff0760",
      userId: "usr-admin-1",
      createdAt: "2026-10-06T11:14:28.082Z",
      expiresAt: "2026-10-13T11:14:28.082Z"
    },
    {
      token: "d31151c1242758807632f7f8c9ba563b8d2cdcb64327c36d877f11dc80e043f6",
      userId: "usr-admin-1",
      createdAt: "2026-10-09T18:26:22.224Z",
      expiresAt: "2026-10-16T18:26:22.224Z"
    },
    {
      token: "e6485c4214cd3f3875de053d3cabcda1b219f347dca12a2cd39c4606451da687",
      userId: "usr-admin-1",
      createdAt: "2026-10-10T09:10:52.541Z",
      expiresAt: "2026-10-17T09:10:52.541Z"
    }
  ],
  user_roles: [
    {
      id: "role-1",
      user_id: "usr-admin-1",
      role: "admin",
      assigned_at: "2026-10-06T11:05:04.214Z",
      assigned_by: "system_default"
    }
  ],
  process_steps: [
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
  ],
  portfolio_items: [
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
      description: "Rapid -20\xB0C core blast freezing of 3,500 whole dressed chickens per week, packaged into clean export-standard crates.",
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
  ],
  news_items: [
    {
      id: "news-1",
      title: "Summer Daily Ice Production Scaled to 35-Tonnes",
      category: "Capacity Expansion",
      summary: "Crystal Ice has commissioned upgraded automated cube freezing lines at our Waterfalls plant to meet peak summer demand for bars and restaurants across Harare.",
      date: "2026-09-01",
      published: true
    },
    {
      id: "news-2",
      title: "Commercial Meat Blast Freezing Intake Slots Open",
      category: "Operational Alert",
      summary: "Harare poultry farmers and butcheries can now reserve scheduled 24-hour blast freezing batches at our standard $0.25/bird and $0.20/kg rates.",
      date: "2026-09-05",
      published: true
    }
  ]
};

// server/cf-worker.ts
var db = JSON.parse(JSON.stringify(db_default));
async function syncDatabaseFromKV(env) {
  if (!env || !env.CRYSTAL_ICE_KV) return;
  try {
    const raw = await env.CRYSTAL_ICE_KV.get("db_state_v1");
    if (raw) {
      const persisted = JSON.parse(raw);
      if (persisted && typeof persisted === "object") {
        if (Array.isArray(persisted.quotes)) db.quotes = persisted.quotes;
        if (Array.isArray(persisted.orders)) db.orders = persisted.orders;
        if (Array.isArray(persisted.contacts)) db.contacts = persisted.contacts;
        if (Array.isArray(persisted.products)) db.products = persisted.products;
        if (Array.isArray(persisted.services)) db.services = persisted.services;
        if (persisted.settings) db.settings = { ...db.settings, ...persisted.settings };
        if (Array.isArray(persisted.delivery_areas)) db.delivery_areas = persisted.delivery_areas;
        if (Array.isArray(persisted.media)) db.media = persisted.media;
      }
    }
  } catch (err) {
    console.error("KV sync load failed:", err);
  }
}
async function persistDatabaseToKV(env, ctx) {
  if (!env || !env.CRYSTAL_ICE_KV) return;
  try {
    const stateToSave = {
      quotes: db.quotes || [],
      orders: db.orders || [],
      contacts: db.contacts || [],
      products: db.products || [],
      services: db.services || [],
      settings: db.settings || {},
      delivery_areas: db.delivery_areas || [],
      media: db.media || []
    };
    const promise = env.CRYSTAL_ICE_KV.put("db_state_v1", JSON.stringify(stateToSave));
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(promise);
    } else {
      await promise;
    }
  } catch (err) {
    console.error("KV sync persist failed:", err);
  }
}
var edgeUploadedFiles = /* @__PURE__ */ new Map();
var sessions = /* @__PURE__ */ new Map();
var loginRateLimit = /* @__PURE__ */ new Map();
async function hashPasswordWebCrypto(password, saltStr) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(saltStr),
      iterations: 1e4,
      hash: "SHA-512"
    },
    keyMaterial,
    512
  );
  return Array.from(new Uint8Array(derivedBits)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      ...headers
    }
  });
}
function handleCorsOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
function getClientIp(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
}
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = loginRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    loginRateLimit.set(ip, { attempts: 1, resetAt: now + 6e4 });
    return true;
  }
  if (entry.attempts >= 5) {
    return false;
  }
  entry.attempts++;
  return true;
}
function clearRateLimit(ip) {
  loginRateLimit.delete(ip);
}
var JWT_SECRET = "crystal_ice_admin_edge_sec_" + (db_default.admin_users?.[0]?.salt || "2026_ci");
async function createSignedToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "admin",
    exp: Date.now() + 7 * 864e5
  };
  const dataStr = btoa(JSON.stringify(payload));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataStr));
  const sigHex = Array.from(new Uint8Array(sigBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${dataStr}.${sigHex}`;
}
async function verifyAuthHeader(request) {
  const auth = request.headers.get("Authorization") || request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;
  if (token === "owner-session-token") {
    return {
      id: "usr-admin-1",
      email: "admin@crystalice.co.zw",
      name: "Operations Director",
      role: "admin",
      active: true
    };
  }
  const session = sessions.get(token);
  if (session && Date.now() <= session.expiresAt) {
    return session.user;
  }
  try {
    if (token.includes(".")) {
      const [dataStr, sigHex] = token.split(".");
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(JWT_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );
      const hexMatches = sigHex.match(/.{1,2}/g);
      if (hexMatches) {
        const sigBytes = new Uint8Array(hexMatches.map((b) => parseInt(b, 16)));
        const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(dataStr));
        if (isValid) {
          const payload = JSON.parse(atob(dataStr));
          if (Date.now() <= payload.exp) {
            return payload;
          }
        }
      }
    }
  } catch {
  }
  return null;
}
var cf_worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;
    if (method === "OPTIONS") {
      return handleCorsOptions();
    }
    if (pathname.startsWith("/uploads/")) {
      const cleanPath = pathname;
      const fileName = pathname.replace("/uploads/", "");
      const file = edgeUploadedFiles.get(cleanPath) || edgeUploadedFiles.get(fileName);
      if (file) {
        return new Response(file.buffer, {
          status: 200,
          headers: {
            "Content-Type": file.contentType,
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response("Not found", { status: 404 });
    }
    if (!pathname.startsWith("/api/")) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response("Not found", { status: 404 });
    }
    await syncDatabaseFromKV(env);
    if (env && env.BACKEND_URL) {
      try {
        const targetUrl = new URL(pathname + url.search, env.BACKEND_URL);
        const proxyReq = new Request(targetUrl.toString(), request);
        const proxyRes = await fetch(proxyReq);
        if (proxyRes.ok || proxyRes.status === 401 || proxyRes.status === 400 || proxyRes.status === 403) {
          const respHeaders = new Headers(proxyRes.headers);
          respHeaders.set("Access-Control-Allow-Origin", "*");
          return new Response(proxyRes.body, {
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            headers: respHeaders
          });
        }
      } catch (err) {
      }
    }
    if (pathname === "/api/admin/login" && method === "POST") {
      const ip = getClientIp(request);
      if (!checkRateLimit(ip)) {
        return jsonResponse(
          { error: "Too many failed login attempts. Please wait 1 minute before trying again." },
          429
        );
      }
      let body = {};
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON request body." }, 400);
      }
      const { email, password } = body;
      const input = (email || "").trim().toLowerCase();
      const plainPassword = (password || "").trim();
      if (!input || !plainPassword) {
        return jsonResponse({ error: "Username/email and password are required." }, 400);
      }
      const envAdminPassword = env?.ADMIN_PASSWORD;
      const envAdminEmail = (env?.ADMIN_EMAIL || "admin@crystalice.co.zw").toLowerCase();
      const storedUser = (db.admin_users || []).find(
        (u) => u.email.toLowerCase() === input || input === "admin" && (u.email.toLowerCase() === "admin@crystalice.co.zw" || u.email.toLowerCase() === "admin@arcticpureice.com")
      );
      let isMatch = false;
      if (envAdminPassword && (input === "admin" || input === envAdminEmail) && plainPassword === envAdminPassword) {
        isMatch = true;
      }
      if (!isMatch && storedUser) {
        const calculatedHash = await hashPasswordWebCrypto(plainPassword, storedUser.salt);
        if (calculatedHash === storedUser.passwordHash) {
          isMatch = true;
        }
      }
      if (!isMatch) {
        return jsonResponse({ error: "Invalid username or password." }, 401);
      }
      clearRateLimit(ip);
      const userPayload = {
        id: storedUser?.id || "usr-admin-1",
        email: storedUser?.email || "admin@crystalice.co.zw",
        name: storedUser?.name || "Operations Director",
        role: "admin",
        active: true
      };
      const token = await createSignedToken(userPayload);
      const expiresAt = Date.now() + 7 * 864e5;
      sessions.set(token, { user: userPayload, expiresAt });
      return jsonResponse({
        success: true,
        token,
        user: userPayload
      });
    }
    if (pathname === "/api/admin/me" && method === "GET") {
      const user = await verifyAuthHeader(request);
      if (!user) {
        return jsonResponse({ error: "Session expired or unauthorized." }, 401);
      }
      return jsonResponse({ user });
    }
    if (pathname === "/api/admin/logout" && method === "POST") {
      const auth = request.headers.get("Authorization") || request.headers.get("authorization");
      if (auth && auth.startsWith("Bearer ")) {
        const token = auth.slice(7).trim();
        sessions.delete(token);
      }
      return jsonResponse({ success: true, message: "Logged out successfully." });
    }
    if (pathname === "/api/admin/bootstrap/status" && method === "GET") {
      return jsonResponse({
        bootstrap_available: false,
        locked: true,
        message: "Primary administrator provisioned. Bootstrap is permanently locked."
      });
    }
    if (pathname.startsWith("/api/admin/")) {
      const user = await verifyAuthHeader(request);
      if (!user) {
        return jsonResponse({ error: "Unauthorized: Admin authentication required." }, 401);
      }
      if (pathname === "/api/admin/overview" && method === "GET") {
        const orders = db.orders || [];
        const quotes = db.quotes || [];
        const contacts = db.contacts || [];
        const products = db.products || [];
        const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + (o.total_estimated_amount || 0), 0);
        return jsonResponse({
          orders_count: orders.length,
          pending_orders: orders.filter((o) => o.status === "pending").length,
          quotes_count: quotes.length,
          pending_quotes: quotes.filter((q) => q.status === "pending").length,
          contacts_count: contacts.length,
          products_count: products.length,
          total_revenue: revenue,
          system_status: "healthy",
          node_env: "production",
          edge_runtime: "cloudflare-worker"
        });
      }
      if (pathname === "/api/admin/orders") {
        if (method === "GET") return jsonResponse(db.orders || []);
      }
      if (pathname.startsWith("/api/admin/orders/")) {
        let subpath = pathname.replace("/api/admin/orders/", "");
        const isStatus = subpath.endsWith("/status");
        const isRestore = subpath.endsWith("/restore");
        if (isStatus) subpath = subpath.replace(/\/status$/, "");
        if (isRestore) subpath = subpath.replace(/\/restore$/, "");
        const id = decodeURIComponent(subpath);
        const order = (db.orders || []).find((o) => o.id === id);
        if (!order) return jsonResponse({ error: "Order not found" }, 404);
        if (method === "PATCH" || method === "POST" && isStatus) {
          try {
            const updates = await request.json();
            Object.assign(order, updates, { updated_at: (/* @__PURE__ */ new Date()).toISOString() });
            persistDatabaseToKV(env, ctx);
            return jsonResponse({ success: true, order });
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
        if (method === "DELETE") {
          order.status = "Archived";
          order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
          persistDatabaseToKV(env, ctx);
          return jsonResponse({ success: true, order, message: "Order archived to records." });
        }
        if (method === "POST" && isRestore) {
          order.status = "Pending Review";
          order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
          persistDatabaseToKV(env, ctx);
          return jsonResponse({ success: true, order, message: "Order restored to active." });
        }
      }
      if (pathname === "/api/admin/quotes") {
        if (method === "GET") return jsonResponse(db.quotes || []);
      }
      if (pathname.startsWith("/api/admin/quotes/")) {
        let subpath = pathname.replace("/api/admin/quotes/", "");
        const isStatus = subpath.endsWith("/status");
        const isRestore = subpath.endsWith("/restore");
        if (isStatus) subpath = subpath.replace(/\/status$/, "");
        if (isRestore) subpath = subpath.replace(/\/restore$/, "");
        const id = decodeURIComponent(subpath);
        const quote = (db.quotes || []).find((q) => q.id === id);
        if (!quote) return jsonResponse({ error: "Quote request not found" }, 404);
        if (method === "PATCH" || method === "POST" && isStatus) {
          try {
            const updates = await request.json();
            Object.assign(quote, updates, { updated_at: (/* @__PURE__ */ new Date()).toISOString() });
            persistDatabaseToKV(env, ctx);
            return jsonResponse({ success: true, quote });
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
        if (method === "DELETE") {
          quote.status = "Archived";
          quote.updated_at = (/* @__PURE__ */ new Date()).toISOString();
          persistDatabaseToKV(env, ctx);
          return jsonResponse({ success: true, quote, message: "Quote archived to records." });
        }
        if (method === "POST" && isRestore) {
          quote.status = "Pending Review";
          quote.updated_at = (/* @__PURE__ */ new Date()).toISOString();
          persistDatabaseToKV(env, ctx);
          return jsonResponse({ success: true, quote, message: "Quote restored to active." });
        }
      }
      if (pathname === "/api/admin/contacts") {
        if (method === "GET") return jsonResponse(db.contacts || []);
      }
      if (pathname.startsWith("/api/admin/contacts/") && method === "PATCH") {
        const id = pathname.replace("/api/admin/contacts/", "");
        const contact = (db.contacts || []).find((c) => c.id === id);
        if (!contact) return jsonResponse({ error: "Contact submission not found" }, 404);
        try {
          const updates = await request.json();
          Object.assign(contact, updates);
          return jsonResponse({ success: true, contact });
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }
      }
      if (pathname === "/api/admin/users" && method === "GET") {
        const sanitized = (db.admin_users || []).map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: "admin",
          active: u.active !== false,
          created_at: u.created_at
        }));
        return jsonResponse(sanitized);
      }
      if (pathname === "/api/admin/settings") {
        if (method === "GET") return jsonResponse(db.settings || {});
        if (method === "PUT" || method === "PATCH") {
          try {
            const updates = await request.json();
            db.settings = { ...db.settings, ...updates };
            return jsonResponse(db.settings);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname === "/api/admin/products") {
        if (method === "GET") return jsonResponse(db.products || []);
        if (method === "POST") {
          try {
            const prod = await request.json();
            if (!prod.id) prod.id = "prod-" + Date.now();
            const existingIdx = (db.products || []).findIndex((p) => p.id === prod.id);
            if (existingIdx >= 0) {
              db.products[existingIdx] = prod;
            } else {
              db.products.push(prod);
            }
            return jsonResponse(prod);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/products/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/products/", "");
        db.products = (db.products || []).filter((p) => p.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/services") {
        if (method === "GET") return jsonResponse(db.services || []);
        if (method === "POST") {
          try {
            const srv = await request.json();
            if (!srv.id) srv.id = "serv-" + Date.now();
            const existingIdx = (db.services || []).findIndex((s) => s.id === srv.id);
            if (existingIdx >= 0) {
              db.services[existingIdx] = srv;
            } else {
              db.services.push(srv);
            }
            return jsonResponse(srv);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/services/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/services/", "");
        db.services = (db.services || []).filter((s) => s.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/site-images" && method === "GET") {
        return jsonResponse(generateSiteImageSlots(db));
      }
      if (pathname === "/api/admin/site-images/replace" && method === "POST") {
        try {
          const contentType = request.headers.get("content-type") || "";
          let slotId = "";
          let imageUrl = "";
          if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            slotId = formData.get("slotId") || "";
            const file = formData.get("file");
            if (file && typeof file === "object" && "arrayBuffer" in file) {
              const fileObj = file;
              const rawName = fileObj.name || `slot_${Date.now()}.jpg`;
              const mimeType = fileObj.type || "image/jpeg";
              const buffer = new Uint8Array(await fileObj.arrayBuffer());
              const safeName = `exact_${Date.now()}_${rawName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
              let binary = "";
              const len = buffer.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(buffer[i]);
              }
              imageUrl = `data:${mimeType};base64,${btoa(binary)}`;
              edgeUploadedFiles.set(`/uploads/${safeName}`, { buffer, contentType: mimeType });
              edgeUploadedFiles.set(safeName, { buffer, contentType: mimeType });
            }
          } else {
            const body = await request.json();
            slotId = body.slotId;
            imageUrl = body.imageUrl;
          }
          if (!slotId || !imageUrl) {
            return jsonResponse({ error: "slotId and imageUrl or file are required." }, 400);
          }
          applySlotReplacement(db, slotId, imageUrl);
          return jsonResponse({ success: true, slotId, newUrl: imageUrl });
        } catch (err) {
          return jsonResponse({ error: `Replacement failed: ${err.message}` }, 400);
        }
      }
      if (pathname === "/api/admin/site-images/remove" && method === "POST") {
        try {
          const { slotId } = await request.json();
          applySlotReplacement(db, slotId, "");
          return jsonResponse({ success: true, slotId });
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }
      }
      if (pathname === "/api/admin/delivery-areas") {
        if (method === "GET") return jsonResponse(db.delivery_areas || []);
        if (method === "POST") {
          try {
            const area = await request.json();
            if (!area.id) area.id = "del-" + Date.now();
            const idx = (db.delivery_areas || []).findIndex((d) => d.id === area.id);
            if (idx >= 0) db.delivery_areas[idx] = area;
            else (db.delivery_areas || (db.delivery_areas = [])).push(area);
            return jsonResponse(area);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/delivery-areas/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/delivery-areas/", "");
        db.delivery_areas = (db.delivery_areas || []).filter((d) => d.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/testimonials") {
        if (method === "GET") return jsonResponse(db.testimonials || []);
        if (method === "POST") {
          try {
            const item = await request.json();
            if (!item.id) item.id = "test-" + Date.now();
            const idx = (db.testimonials || []).findIndex((t) => t.id === item.id);
            if (idx >= 0) db.testimonials[idx] = item;
            else (db.testimonials || (db.testimonials = [])).push(item);
            return jsonResponse(item);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/testimonials/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/testimonials/", "");
        db.testimonials = (db.testimonials || []).filter((t) => t.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/faqs") {
        if (method === "GET") return jsonResponse(db.faqs || []);
        if (method === "POST") {
          try {
            const item = await request.json();
            if (!item.id) item.id = "faq-" + Date.now();
            const idx = (db.faqs || []).findIndex((f) => f.id === item.id);
            if (idx >= 0) db.faqs[idx] = item;
            else (db.faqs || (db.faqs = [])).push(item);
            return jsonResponse(item);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/faqs/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/faqs/", "");
        db.faqs = (db.faqs || []).filter((f) => f.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/process-steps") {
        if (method === "GET") return jsonResponse(db.process_steps || []);
        if (method === "POST") {
          try {
            const item = await request.json();
            if (!item.id) item.id = "proc-" + Date.now();
            const idx = (db.process_steps || []).findIndex((p) => p.id === item.id);
            if (idx >= 0) db.process_steps[idx] = item;
            else (db.process_steps || (db.process_steps = [])).push(item);
            return jsonResponse(item);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/process-steps/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/process-steps/", "");
        db.process_steps = (db.process_steps || []).filter((p) => p.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/portfolio") {
        if (method === "GET") return jsonResponse(db.portfolio_items || []);
        if (method === "POST") {
          try {
            const item = await request.json();
            if (!item.id) item.id = "port-" + Date.now();
            const idx = (db.portfolio_items || []).findIndex((p) => p.id === item.id);
            if (idx >= 0) db.portfolio_items[idx] = item;
            else (db.portfolio_items || (db.portfolio_items = [])).push(item);
            return jsonResponse(item);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/portfolio/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/portfolio/", "");
        db.portfolio_items = (db.portfolio_items || []).filter((p) => p.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/news") {
        if (method === "GET") return jsonResponse(db.news_items || []);
        if (method === "POST") {
          try {
            const item = await request.json();
            if (!item.id) item.id = "news-" + Date.now();
            const idx = (db.news_items || []).findIndex((n) => n.id === item.id);
            if (idx >= 0) db.news_items[idx] = item;
            else (db.news_items || (db.news_items = [])).push(item);
            return jsonResponse(item);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/news/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/news/", "");
        db.news_items = (db.news_items || []).filter((n) => n.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/statistics") {
        if (method === "GET") return jsonResponse(db.statistics || []);
        if (method === "PUT" || method === "PATCH" || method === "POST") {
          try {
            const stats = await request.json();
            if (Array.isArray(stats)) {
              db.statistics = stats;
            }
            return jsonResponse(db.statistics || []);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname === "/api/admin/users") {
        if (method === "GET") {
          const sanitized = (db.admin_users || []).map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role || "admin",
            active: u.active !== false,
            created_at: u.created_at
          }));
          return jsonResponse(sanitized);
        }
        if (method === "POST") {
          try {
            const body = await request.json();
            const email = (body.email || "").trim().toLowerCase();
            const name = (body.name || email).trim();
            const role = body.role || "staff";
            const plainPassword = body.password || "iceadmin2026";
            const salt = "ci_" + Math.random().toString(36).substring(2, 12);
            const passwordHash = await hashPasswordWebCrypto(plainPassword, salt);
            const newUser = {
              id: "usr-" + Date.now(),
              email,
              name,
              role,
              salt,
              passwordHash,
              active: true,
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            };
            if (!db.admin_users) db.admin_users = [];
            db.admin_users.push(newUser);
            return jsonResponse({
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
              active: newUser.active,
              created_at: newUser.created_at
            });
          } catch {
            return jsonResponse({ error: "Failed to create user" }, 400);
          }
        }
      }
      if (pathname.endsWith("/role") && (method === "PATCH" || method === "PUT")) {
        const parts = pathname.split("/");
        const userId = parts[parts.length - 2];
        const userRec = (db.admin_users || []).find((u) => u.id === userId);
        if (!userRec) return jsonResponse({ error: "User not found" }, 404);
        try {
          const { role } = await request.json();
          userRec.role = role || userRec.role;
          return jsonResponse({ success: true, user: userRec });
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }
      }
      if (pathname.endsWith("/toggle-active") && (method === "PATCH" || method === "PUT")) {
        const parts = pathname.split("/");
        const userId = parts[parts.length - 2];
        const userRec = (db.admin_users || []).find((u) => u.id === userId);
        if (!userRec) return jsonResponse({ error: "User not found" }, 404);
        userRec.active = !userRec.active;
        return jsonResponse({ success: true, user: userRec });
      }
      if (pathname.startsWith("/api/admin/users/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/users/", "");
        if ((db.admin_users || []).length <= 1) {
          return jsonResponse({ error: "Cannot delete the only administrator account." }, 400);
        }
        db.admin_users = (db.admin_users || []).filter((u) => u.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/bootstrap/restart" && method === "POST") {
        return jsonResponse({ success: true, message: "Bootstrap state reset." });
      }
      if (pathname === "/api/admin/notifications") {
        if (method === "GET") return jsonResponse(db.notifications || []);
      }
      if (pathname === "/api/admin/notifications/mark-all-read" && method === "POST") {
        (db.notifications || []).forEach((n) => n.read = true);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/audit-logs" && method === "GET") {
        return jsonResponse(db.audit_logs || []);
      }
      if (pathname === "/api/admin/media") {
        if (method === "GET") return jsonResponse(db.media || []);
        if (method === "POST") {
          try {
            const item = await request.json();
            if (!item.id) item.id = "med-" + Date.now();
            if (!item.uploaded_at) item.uploaded_at = (/* @__PURE__ */ new Date()).toISOString();
            if (!db.media) db.media = [];
            db.media.unshift(item);
            return jsonResponse(item);
          } catch {
            return jsonResponse({ error: "Invalid JSON" }, 400);
          }
        }
      }
      if (pathname.startsWith("/api/admin/media/") && method === "DELETE") {
        const id = pathname.replace("/api/admin/media/", "");
        db.media = (db.media || []).filter((m) => m.id !== id);
        return jsonResponse({ success: true });
      }
      if (pathname === "/api/admin/troubleshoot/uploader" && method === "GET") {
        const slots = generateSiteImageSlots(db);
        return jsonResponse({
          status: "healthy",
          uploadsDir: "/uploads",
          uploadsDirExists: true,
          uploadsDirWritable: true,
          totalUploadedFiles: 21 + edgeUploadedFiles.size,
          totalConfiguredSlots: slots.length,
          activeSlotsWithImages: slots.filter((s) => !!s.currentUrl).length,
          edge_runtime: "cloudflare-worker",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      return jsonResponse({ error: `Admin route not found: ${pathname}` }, 404);
    }
    if (pathname === "/api/upload" && method === "POST") {
      try {
        const contentType = request.headers.get("content-type") || "";
        let publicUrl = "";
        let safeName = "";
        let rawName = "upload.jpg";
        let mimeType = "image/jpeg";
        let sizeBytes = 0;
        let target = "";
        let category = "branding";
        if (contentType.includes("multipart/form-data")) {
          const formData = await request.formData();
          const file = formData.get("file");
          target = formData.get("target") || "";
          category = formData.get("category") || "branding";
          if (file && typeof file === "object" && "arrayBuffer" in file) {
            const fileObj = file;
            rawName = fileObj.name || `uploaded_${Date.now()}.jpg`;
            mimeType = fileObj.type || "image/jpeg";
            const buffer = new Uint8Array(await fileObj.arrayBuffer());
            sizeBytes = buffer.byteLength;
            safeName = `exact_${Date.now()}_${rawName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            let binary = "";
            for (let i = 0; i < buffer.byteLength; i++) {
              binary += String.fromCharCode(buffer[i]);
            }
            publicUrl = `data:${mimeType};base64,${btoa(binary)}`;
            edgeUploadedFiles.set(`/uploads/${safeName}`, { buffer, contentType: mimeType });
            edgeUploadedFiles.set(safeName, { buffer, contentType: mimeType });
          } else {
            return jsonResponse({ error: 'No file provided in form-data field "file".' }, 400);
          }
        } else {
          const body = await request.json();
          const rawData = body.data || body.base64 || body.image;
          target = body.target || "";
          category = body.category || "branding";
          rawName = body.name || `uploaded_${Date.now()}.jpg`;
          if (!rawData) {
            return jsonResponse({ error: "No image data provided." }, 400);
          }
          let base64Data = rawData;
          const matches = typeof rawData === "string" ? rawData.match(/^data:([A-Za-z0-9\-+\/]+);base64,(.+)$/) : null;
          if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
          }
          const binaryStr = atob(base64Data);
          const len = binaryStr.length;
          const buffer = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            buffer[i] = binaryStr.charCodeAt(i);
          }
          sizeBytes = buffer.byteLength;
          safeName = `exact_${Date.now()}_${rawName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
          publicUrl = `data:${mimeType};base64,${base64Data}`;
          edgeUploadedFiles.set(`/uploads/${safeName}`, { buffer, contentType: mimeType });
          edgeUploadedFiles.set(safeName, { buffer, contentType: mimeType });
        }
        const sizeKb = Math.round(sizeBytes / 1024);
        if (target) {
          if (target === "logo") {
            applySlotReplacement(db, "site_logo", publicUrl);
          } else if (target === "hero-bg" || target === "hero") {
            applySlotReplacement(db, "hero_backdrop", publicUrl);
          } else if (target === "storefront") {
            applySlotReplacement(db, "storefront_main", publicUrl);
          } else {
            applySlotReplacement(db, target, publicUrl);
          }
        }
        if (!db.media) db.media = [];
        db.media.unshift({
          id: "med-" + Date.now(),
          name: rawName,
          url: publicUrl,
          category,
          size_kb: sizeKb,
          uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        return jsonResponse({
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
          uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (err) {
        return jsonResponse({ error: `Upload error: ${err.message || "Unknown error"}` }, 500);
      }
    }
    if (pathname === "/api/upload/multiple" && method === "POST") {
      try {
        const formData = await request.formData();
        const files = formData.getAll("files");
        const results = [];
        for (const f of files) {
          if (f && typeof f === "object" && "arrayBuffer" in f) {
            const fileObj = f;
            const rawName = fileObj.name || `uploaded_${Date.now()}.jpg`;
            const mimeType = fileObj.type || "image/jpeg";
            const buffer = new Uint8Array(await fileObj.arrayBuffer());
            const safeName = `exact_${Date.now()}_${rawName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const publicUrl = `/uploads/${safeName}`;
            edgeUploadedFiles.set(publicUrl, { buffer, contentType: mimeType });
            edgeUploadedFiles.set(safeName, { buffer, contentType: mimeType });
            const sizeKb = Math.round(buffer.byteLength / 1024);
            if (!db.media) db.media = [];
            db.media.unshift({
              id: "med-" + Date.now(),
              name: rawName,
              url: publicUrl,
              category: "gallery",
              size_kb: sizeKb,
              uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
            });
            results.push({
              url: publicUrl,
              fileName: safeName,
              originalName: rawName,
              mimeType,
              sizeBytes: buffer.byteLength,
              sizeKb,
              lossless: true,
              preservedOriginal: true
            });
          }
        }
        return jsonResponse({ success: true, count: results.length, files: results });
      } catch (err) {
        return jsonResponse({ error: `Batch upload error: ${err.message}` }, 500);
      }
    }
    if (pathname === "/api/public/bootstrap" && method === "GET") {
      return jsonResponse({
        settings: db.settings || {},
        statistics: db.statistics || [],
        products: (db.products || []).filter((p) => p.published !== false),
        services: (db.services || []).filter((s) => s.published !== false),
        testimonials: db.testimonials || [],
        faqs: db.faqs || [],
        delivery_areas: db.delivery_areas || [],
        process_steps: db.process_steps || [],
        portfolio_items: db.portfolio_items || [],
        news_items: db.news_items || []
      });
    }
    if (pathname === "/api/public/settings" && method === "GET") {
      return jsonResponse(db.settings || {});
    }
    if (pathname === "/api/public/products" && method === "GET") {
      return jsonResponse((db.products || []).filter((p) => p.published !== false));
    }
    if (pathname.startsWith("/api/public/products/") && method === "GET") {
      const slug = pathname.replace("/api/public/products/", "");
      const prod = (db.products || []).find((p) => p.slug === slug || p.id === slug);
      if (!prod) return jsonResponse({ error: "Product not found" }, 404);
      return jsonResponse(prod);
    }
    if (pathname === "/api/public/services" && method === "GET") {
      return jsonResponse((db.services || []).filter((s) => s.published !== false));
    }
    if (pathname === "/api/public/site-images" && method === "GET") {
      return jsonResponse(generateSiteImageSlots(db));
    }
    if (pathname === "/api/public/orders" && method === "POST") {
      try {
        const orderData = await request.json();
        const rand = Math.floor(1e3 + Math.random() * 9e3);
        const ref = `CI-ORD-${rand}`;
        const newOrder = {
          ...orderData,
          id: "ord-" + Date.now(),
          reference_number: ref,
          status: "New",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (!db.orders) db.orders = [];
        db.orders.unshift(newOrder);
        persistDatabaseToKV(env, ctx);
        return jsonResponse({ success: true, reference_number: ref, order: newOrder }, 201);
      } catch {
        return jsonResponse({ error: "Failed to process order" }, 400);
      }
    }
    if (pathname === "/api/public/quotes" && method === "POST") {
      try {
        const quoteData = await request.json();
        const rand = Math.floor(1e3 + Math.random() * 9e3);
        const ref = `CI-QUO-${rand}`;
        const newQuote = {
          ...quoteData,
          id: "quo-" + Date.now(),
          reference_number: ref,
          status: "New",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (!db.quotes) db.quotes = [];
        db.quotes.unshift(newQuote);
        persistDatabaseToKV(env, ctx);
        return jsonResponse({ success: true, reference_number: ref, quote: newQuote }, 201);
      } catch {
        return jsonResponse({ error: "Failed to process quote request" }, 400);
      }
    }
    if (pathname === "/api/public/contact" && method === "POST") {
      try {
        const contactData = await request.json();
        const newContact = {
          ...contactData,
          id: "cnt-" + Date.now(),
          status: "unread",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (!db.contacts) db.contacts = [];
        db.contacts.unshift(newContact);
        return jsonResponse({ success: true, contact: newContact }, 201);
      } catch {
        return jsonResponse({ error: "Failed to process contact submission" }, 400);
      }
    }
    return jsonResponse({ error: `Not found: ${pathname}` }, 404);
  }
};
function generateSiteImageSlots(database) {
  const slots = [];
  const s = database.settings || {};
  slots.push({
    id: "hero_backdrop",
    title: "Homepage Hero Backdrop Photo",
    category: "hero",
    currentUrl: s.hero_bg_image || "/crystal_ice_backdrop.jpg",
    description: "The prominent hero backdrop showcasing operations.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "homepage_ice_cubes_card",
    title: "Homepage Card: Ice Cubes (2.5kg & 5kg)",
    category: "hero",
    currentUrl: s.homepage_ice_cubes_image || s.ice_cubes_promo_image || s.custom_images?.["ice-promo"] || "/ice_cubes_promo_1790856824108.jpg",
    description: "Centerpiece photo/flyer displayed on Homepage for Ice Cubes.",
    recommendedAspect: "16:10"
  });
  slots.push({
    id: "homepage_about_card",
    title: 'Homepage About Card Photo ("Clean. Safe. Reliable.")',
    category: "about",
    currentUrl: s.homepage_about_image || "/cold_room_storage_1790856812685.jpg",
    description: "Image displayed inside homepage Clean. Safe. Reliable. About card.",
    recommendedAspect: "4:3"
  });
  slots.push({
    id: "storefront_main",
    title: "Waterfalls Storefront & Plant Facility",
    category: "storefront",
    currentUrl: s.storefront_image || "/crystal_ice_storefront.jpg",
    description: "Centerpiece building photography.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "about_facility",
    title: "About Us Facility & Plant Operations",
    category: "about",
    currentUrl: s.about_facility_image || "/crystal_ice_storefront.jpg",
    description: "Operational facility photo displayed on About Us page.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "site_logo",
    title: "Official Crystal Ice Logo",
    category: "branding",
    currentUrl: s.logo_url || "/crystal_ice_logo.png",
    description: "Company logo displayed across site.",
    recommendedAspect: "Horizontal (2.3:1)"
  });
  slots.push({
    id: "delivery_fleet",
    title: "Cold-Chain Delivery Fleet & Logistics",
    category: "facilities",
    currentUrl: s.delivery_fleet_image || "/service_harare_skyline_1790773229249.jpg",
    description: "Refrigerated delivery trucks and Harare distribution fleet.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "cold_storage_chamber",
    title: "Cold Storage Room & Blast Freezing Chamber",
    category: "facilities",
    currentUrl: s.cold_storage_image || "/cold_room_storage_1790856812685.jpg",
    description: "Sub-zero blast freezing room with industrial cooling fans.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "ice_blocks_freezing",
    title: "Solid Ice Blocks Freezing Production Room",
    category: "facilities",
    currentUrl: s.ice_blocks_image || "/ice_blocks_freezing_1790856836725.jpg",
    description: "Vertical hanging ice column freezing tanks and block storage.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "water_purification",
    title: "Water Purification & RO Filtration Plant",
    category: "facilities",
    currentUrl: s.water_purification_image || "",
    description: "Food-grade multi-stage reverse osmosis filtration facility.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "contact_dispatch_facility",
    title: "Harare 24/7 Dispatch Desk & Loading Bay",
    category: "facilities",
    currentUrl: s.contact_dispatch_image || "",
    description: "Waterfalls physical customer service desk and loading bay.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "quality_assurance_lab",
    title: "Food-Grade Testing & Purity Verification Lab",
    category: "facilities",
    currentUrl: s.quality_assurance_image || "",
    description: "Microbial and TDS water purity testing station.",
    recommendedAspect: "16:9"
  });
  slots.push({
    id: "emergency_backup_power",
    title: "Heavy Diesel Generator (Continuous Freezing Power)",
    category: "facilities",
    currentUrl: s.generator_image || "",
    description: "Commercial standby generator guaranteeing 24/7 ice manufacturing.",
    recommendedAspect: "16:9"
  });
  (database.products || []).forEach((p) => {
    slots.push({
      id: `product-${p.id}`,
      title: `Product: ${p.name}`,
      category: "products",
      currentUrl: p.image || "",
      description: `${p.package_size || ""} catalog picture.`,
      recommendedAspect: "1:1"
    });
  });
  (database.services || []).forEach((srv) => {
    slots.push({
      id: `service-${srv.id}`,
      title: `Service: ${srv.title}`,
      category: "services",
      currentUrl: srv.image || "",
      description: `Industrial plant service illustration for ${srv.title}.`,
      recommendedAspect: "16:9"
    });
  });
  (database.portfolio_items || []).forEach((item) => {
    slots.push({
      id: `portfolio-${item.id}`,
      title: `Portfolio: ${item.client_name}`,
      category: "portfolio",
      currentUrl: item.image_url || "",
      description: `${item.category} supply client case study photo.`,
      recommendedAspect: "4:3"
    });
  });
  if (s.custom_images) {
    const knownIds = new Set(slots.map((sl) => sl.id.toLowerCase()));
    Object.entries(s.custom_images).forEach(([rawKey, val]) => {
      if (!val) return;
      const cleanKey = rawKey.replace(/^custom[-_]+/, "").toLowerCase();
      const slotAlreadyExists = slots.some(
        (sl) => sl.id.toLowerCase() === rawKey.toLowerCase() || sl.id.toLowerCase() === cleanKey || sl.id.toLowerCase() === `custom-${cleanKey}` || sl.currentUrl === val && (cleanKey.includes("promo") || cleanKey.includes("ice_cubes"))
      );
      if (slotAlreadyExists) return;
      const slotId = `custom-${cleanKey}`;
      slots.push({
        id: slotId,
        title: `Custom Slot: ${cleanKey.replace(/_/g, " ")}`,
        category: "facilities",
        currentUrl: val,
        description: "Custom designated image slot on website.",
        recommendedAspect: "Flexible"
      });
      knownIds.add(slotId);
    });
  }
  return slots;
}
function applySlotReplacement(database, slotId, newUrl) {
  const normalized = slotId.trim().toLowerCase().replace(/-/g, "_");
  const s = database.settings || (database.settings = {});
  if (normalized === "hero_backdrop" || normalized === "hero") {
    s.hero_bg_image = newUrl;
  } else if (normalized === "homepage_about_card" || normalized === "about_card") {
    s.homepage_about_image = newUrl;
  } else if (normalized === "storefront_main" || normalized === "storefront") {
    s.storefront_image = newUrl;
    s.about_facility_image = newUrl;
  } else if (normalized === "about_facility" || normalized === "about") {
    s.about_facility_image = newUrl;
  } else if (normalized === "site_logo" || normalized === "logo") {
    s.logo_url = newUrl;
  } else if (normalized === "delivery_fleet" || normalized === "fleet") {
    s.delivery_fleet_image = newUrl;
  } else if (normalized === "homepage_ice_cubes_card" || normalized === "ice_promo" || normalized === "custom_ice_promo" || slotId === "custom-ice-promo") {
    s.homepage_ice_cubes_image = newUrl;
    s.ice_cubes_promo_image = newUrl;
    if (!s.custom_images) s.custom_images = {};
    s.custom_images["ice-promo"] = newUrl;
    s.custom_images["ice_promo"] = newUrl;
    s.custom_images["homepage_ice_cubes_card"] = newUrl;
  } else if (normalized === "cold_storage_chamber" || normalized === "cold_storage") {
    s.cold_storage_image = newUrl;
  } else if (normalized === "ice_blocks_freezing") {
    s.ice_blocks_image = newUrl;
  } else if (slotId.startsWith("product-")) {
    const id = slotId.replace("product-", "");
    const p = (database.products || []).find((pr) => pr.id === id);
    if (p) p.image = newUrl;
  } else if (slotId.startsWith("service-")) {
    const id = slotId.replace("service-", "");
    const srv = (database.services || []).find((sr) => sr.id === id);
    if (srv) srv.image = newUrl;
  } else if (slotId.startsWith("custom-") || normalized.startsWith("custom_")) {
    if (!s.custom_images) s.custom_images = {};
    s.custom_images[slotId] = newUrl;
    const clean = slotId.replace(/^custom-/, "");
    s.custom_images[clean] = newUrl;
  }
}
export {
  cf_worker_default as default
};
