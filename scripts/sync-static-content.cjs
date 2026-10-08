const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const distDir = path.join(rootDir, 'dist');
const distUploadsDir = path.join(distDir, 'uploads');
const dbPath = path.join(rootDir, 'data', 'db.json');

// Ensure necessary directories exist
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, 'api', 'public'), { recursive: true });

// 1. Ensure all referenced authentic photos exist in public/uploads/
const fallbackMap = [
  ['ice_cubes_promo_1790856824108.jpg', 'IMG_COM_202610031743031531-1791401516491-320800556.jpeg'],
  ['ice_cubes_promo_1790856824108.jpg', 'IMG_COM_202610031743031531-1791401372083-177921440.jpeg'],
  ['ice_cubes_promo_1790856824108.jpg', 'IMG_COM_202610031743031531-1791401151436-718604365.jpeg'],
  ['packaged_ice_5kg_1790856872454.jpg', 'IMG_COM_202610031743031500-1791401016893-600287730.jpeg'],
  ['chicken_blast_freeze_1790856846432.jpg', 'IMG_COM_202610031040189473-1791401069486-652946178.jpeg'],
  ['beef_blast_freeze_1790856859754.jpg', 'IMG_COM_202610031040189566-1791401081338-932160898.jpeg'],
  ['service_harare_skyline_1790773229249.jpg', 'IMG_COM_202610031743031582-1791401102435-587151614.jpeg'],
  ['cold_room_storage_1790856812685.jpg', 'IMG_COM_202610031040189421-1791400957038-759381652.jpeg'],
  ['cold_room_storage_1790856812685.jpg', 'IMG_COM_202610031040189504__1_-1791400873458-295953650.jpeg'],
  ['cold_room_storage_1790856812685.jpg', 'IMG_COM_202610031040189504-1791040034146-233172210.jpeg'],
  ['ice_blocks_freezing_1790856836725.jpg', 'IMG_COM_202610031040189535-1791397195925-210854871.jpeg'],
  ['ice_blocks_freezing_1790856836725.jpg', 'IMG_COM_202610031040189535-1791397154550-453598773.jpeg'],
  ['hero_crystal_ice_block_1790773155832.jpg', 'test_hero-1791388910575-835054107.png']
];

fallbackMap.forEach(([srcFile, destFile]) => {
  const destPath = path.join(uploadsDir, destFile);
  if (!fs.existsSync(destPath)) {
    const srcPath = path.join(publicDir, srcFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Asset Sync] Preserved upload asset: ${destFile}`);
    }
  }
});

// 2. Read database and generate bootstrap.json and api/public/bootstrap
if (fs.existsSync(dbPath)) {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const bootstrapData = {
      settings: db.settings,
      products: db.products,
      services: db.services,
      testimonials: db.testimonials,
      faqs: db.faqs,
      delivery_areas: db.delivery_areas,
      statistics: db.statistics,
      process_steps: db.process_steps || [],
      portfolio_items: db.portfolio_items || [],
      news_items: db.news_items || []
    };

    const bootstrapJson = JSON.stringify(bootstrapData, null, 2);
    fs.writeFileSync(path.join(publicDir, 'bootstrap.json'), bootstrapJson, 'utf8');
    fs.writeFileSync(path.join(publicDir, 'api', 'public', 'bootstrap'), bootstrapJson, 'utf8');

    // Build site image slots
    const slots = [];
    const settings = db.settings || {};

    slots.push({
      id: 'hero_backdrop',
      title: 'Homepage Hero Backdrop Photo',
      category: 'hero',
      currentUrl: settings.hero_bg_image || '/crystal_ice_backdrop.jpg',
      description: 'The prominent hero backdrop showcasing the Crystal Ice Zimbabwe packaged ice operations.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'hero_bg_image'
    });

    slots.push({
      id: 'homepage_ice_cubes_card',
      title: 'Homepage Card: Ice Cubes (2.5kg & 5kg)',
      category: 'hero',
      currentUrl: settings.homepage_ice_cubes_image || settings.ice_cubes_promo_image || settings.custom_images?.['ice-promo'] || '/ice_cubes_promo_1790856824108.jpg',
      description: 'Centerpiece photo/flyer displayed on the Homepage for "Ice Cubes (2.5kg & 5kg)".',
      recommendedAspect: '16:10',
      targetType: 'settings',
      targetField: 'homepage_ice_cubes_image'
    });

    slots.push({
      id: 'homepage_about_card',
      title: 'Homepage About Card Photo ("Clean. Safe. Reliable.")',
      category: 'about',
      currentUrl: settings.homepage_about_image || '/ice_cubes_promo_1790856824108.jpg',
      description: 'Image displayed inside the homepage "Clean. Safe. Reliable." About card.',
      recommendedAspect: '4:3',
      targetType: 'settings',
      targetField: 'homepage_about_image'
    });

    slots.push({
      id: 'storefront_main',
      title: 'Waterfalls Storefront & Plant Facility',
      category: 'storefront',
      currentUrl: settings.storefront_image || '/crystal_ice_storefront.jpg',
      description: 'Centerpiece building photography featured across the homepage showcase.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'storefront_image'
    });

    slots.push({
      id: 'about_facility',
      title: 'About Us Facility & Plant Operations',
      category: 'about',
      currentUrl: settings.about_facility_image || '/crystal_ice_storefront.jpg',
      description: 'Operational facility photo displayed on the About Us page.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'about_facility_image'
    });

    slots.push({
      id: 'site_logo',
      title: 'Official Crystal Ice Logo',
      category: 'branding',
      currentUrl: settings.logo_url || '/crystal_ice_logo.png',
      description: 'Company logo displayed across header, footer, and admin portals.',
      recommendedAspect: 'Horizontal (2.3:1)',
      targetType: 'settings',
      targetField: 'logo_url'
    });

    slots.push({
      id: 'delivery_fleet',
      title: 'Cold-Chain Delivery Fleet & Logistics',
      category: 'facilities',
      currentUrl: settings.delivery_fleet_image || '/service_harare_skyline_1790773229249.jpg',
      description: 'Refrigerated delivery trucks and Harare distribution fleet.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'delivery_fleet_image'
    });

    slots.push({
      id: 'cold_storage_chamber',
      title: 'Cold Storage Room & Blast Freezing Chamber',
      category: 'facilities',
      currentUrl: settings.cold_storage_image || '/cold_room_storage_1790856812685.jpg',
      description: 'Sub-zero blast freezing room with industrial cooling fans.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'cold_storage_image'
    });

    slots.push({
      id: 'ice_blocks_freezing',
      title: 'Solid Ice Blocks Freezing Production Room',
      category: 'facilities',
      currentUrl: settings.ice_blocks_image || '/ice_blocks_freezing_1790856836725.jpg',
      description: 'Vertical hanging ice column freezing tanks and block storage.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'ice_blocks_image'
    });

    slots.push({
      id: 'water_purification',
      title: 'Water Purification & RO Filtration Plant',
      category: 'facilities',
      currentUrl: settings.water_purification_image || '',
      description: 'Food-grade multi-stage reverse osmosis filtration facility.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'water_purification_image'
    });

    slots.push({
      id: 'contact_dispatch_facility',
      title: 'Harare 24/7 Dispatch Desk & Loading Bay',
      category: 'facilities',
      currentUrl: settings.contact_dispatch_image || '',
      description: 'Waterfalls physical customer service desk and loading bay.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'contact_dispatch_image'
    });

    slots.push({
      id: 'quality_assurance_lab',
      title: 'Food-Grade Testing & Purity Verification Lab',
      category: 'facilities',
      currentUrl: settings.quality_assurance_image || '',
      description: 'Microbial and TDS water purity testing station.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'quality_assurance_image'
    });

    slots.push({
      id: 'emergency_backup_power',
      title: 'Heavy Diesel Generator (Continuous Freezing Power)',
      category: 'facilities',
      currentUrl: settings.generator_image || '',
      description: 'Commercial standby generator guaranteeing 24/7 ice manufacturing.',
      recommendedAspect: '16:9',
      targetType: 'settings',
      targetField: 'generator_image'
    });

    (db.products || []).forEach(prod => {
      slots.push({
        id: `product-${prod.id}`,
        title: `Product: ${prod.name}`,
        category: 'products',
        currentUrl: prod.image || '',
        description: `${prod.package_size} • ${prod.category} catalog card picture.`,
        recommendedAspect: '1:1',
        targetType: 'product',
        targetId: prod.id,
        targetField: 'image'
      });
    });

    (db.services || []).forEach(srv => {
      slots.push({
        id: `service-${srv.id}`,
        title: `Service: ${srv.title}`,
        category: 'services',
        currentUrl: srv.image || '',
        description: `Industrial plant service illustration for ${srv.title}.`,
        recommendedAspect: '16:9',
        targetType: 'service',
        targetId: srv.id,
        targetField: 'image'
      });
    });

    (db.portfolio_items || []).forEach(item => {
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

    if (settings.custom_images) {
      const knownIds = new Set(slots.map(s => s.id.toLowerCase()));
      Object.entries(settings.custom_images).forEach(([rawKey, val]) => {
        if (!val) return;
        const cleanKey = rawKey.replace(/^custom[-_]+/, '').toLowerCase();
        const slotAlreadyExists = slots.some(
          s => s.id.toLowerCase() === rawKey.toLowerCase() ||
               s.id.toLowerCase() === cleanKey ||
               s.id.toLowerCase() === `custom-${cleanKey}` ||
               (s.currentUrl === val && (cleanKey.includes('promo') || cleanKey.includes('ice_cubes')))
        );
        if (slotAlreadyExists) return;

        const slotId = `custom-${cleanKey}`;
        slots.push({
          id: slotId,
          title: `Custom Slot: ${cleanKey.replace(/_/g, ' ')}`,
          category: 'facilities',
          currentUrl: val,
          description: 'Custom designated image slot on website.',
          recommendedAspect: 'Flexible',
          targetType: 'custom',
          targetField: cleanKey
        });
        knownIds.add(slotId);
      });
    }

    const slotsJson = JSON.stringify(slots, null, 2);
    fs.writeFileSync(path.join(publicDir, 'site-images.json'), slotsJson, 'utf8');
    fs.writeFileSync(path.join(publicDir, 'api', 'public', 'site-images'), slotsJson, 'utf8');

    console.log(`[Cloudflare Sync] Generated static bootstrap.json & site-images.json (${slots.length} slots)`);
  } catch (err) {
    console.error('[Cloudflare Sync] Error generating static data:', err);
  }
}

// 3. Configure public/_redirects for Cloudflare Pages
const redirectsContent = `# Cloudflare Pages Static & Edge API Routing
/bootstrap.json         /bootstrap.json         200
/api/public/bootstrap   /bootstrap.json         200
/site-images.json       /site-images.json       200
/api/public/site-images /site-images.json       200
/uploads/*              /uploads/:splat         200
/*                      /index.html             200
`;
fs.writeFileSync(path.join(publicDir, '_redirects'), redirectsContent, 'utf8');
console.log('[Cloudflare Sync] Configured public/_redirects for static Cloudflare Pages');
