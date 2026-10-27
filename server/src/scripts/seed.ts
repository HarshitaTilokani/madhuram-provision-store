/**
 * DEMO seed for Madhuram Provision Store
 *
 * Default behaviour (SAFE):
 *   - If products already exist in MongoDB → do NOT delete them. Exit.
 *   - If database is empty → create categories + products.
 *
 * Force re-seed (wipes products & categories):
 *   FORCE_SEED=1 npm run seed
 *
 * Products persist in MongoDB and survive server/VS Code/browser restarts.
 */
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { env } from '../config/env.js';

const DEMO_CATEGORIES = [
  { name: 'Rice & Grains', description: 'Premium rice varieties and grains', sortOrder: 1 },
  { name: 'Pulses & Dal', description: 'Toor, Chana, Urad, Masoor and more', sortOrder: 2 },
  { name: 'Cooking Oils & Ghee', description: 'Oils, ghee and cooking fats', sortOrder: 3 },
  { name: 'Spices & Masala', description: 'Salt, mirchi, haldi, garam masala and spices', sortOrder: 4 },
  { name: 'Snacks & Namkeen', description: 'Chips, namkeens, biscuits and packaged snacks', sortOrder: 5 },
  { name: 'Sweets & Confectionery', description: 'Chocolates, toffees, candies and sweets', sortOrder: 6 },
  { name: 'Beverages', description: 'Tea, coffee, soft drinks and more', sortOrder: 7 },
  { name: 'Toiletries', description: 'Soaps, shampoos and personal care', sortOrder: 8 },
  { name: 'Kitchen & Household', description: 'Cleansers, detergents and daily essentials', sortOrder: 9 },
  { name: 'Spreads & Condiments', description: 'Spreads, sauces and condiments', sortOrder: 10 },
];

const img = (photoId: string, alt: string) => ({
  publicId: `demo/${photoId}`,
  url: `https://images.unsplash.com/${photoId}?w=400&h=400&fit=crop`,
  alt,
});

// Stable image map (fixed broken IDs)
const RELIABLE: Record<string, string> = {
  'photo-1586201375761-83865001e31c': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
  'photo-1536304993881-ff6e9eefa2a6': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
  'photo-1596797038530-2c107229654b': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop',
  'photo-1615485290382-441e4d049cb5': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop',
  'photo-1474979266404-7eaacbcd87c5': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
  'photo-1628088062855-487d8302184b': 'https://images.unsplash.com/photo-1628088062855-487d8302184b?w=400&h=400&fit=crop',
  'photo-1596040033229-a0b44cfd2f5b': 'https://images.unsplash.com/photo-1596040033229-a0b44cfd2f5b?w=400&h=400&fit=crop',
  'photo-1558961363-fa8fdf82db35': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
  'photo-1549007994-cb92caebd54b': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop',
  'photo-1564890369478-c89ca6d9cde9': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop',
  'photo-1447933601403-0c6688de566e': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
  'photo-1626197031507-c1709975321c': 'https://images.unsplash.com/photo-1626197031507-c1709975321c?w=400&h=400&fit=crop',
  'photo-1582735689369-4fe89db7114c': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop',
  'photo-1604719312566-8912e9227c6a': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop',
  'photo-1578916171728-46686eac8d58': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=400&fit=crop',
};

function fixImages(products: any[]) {
  for (const p of products) {
    p.images = (p.images || []).map((im: any) => {
      const key = Object.keys(RELIABLE).find((k) => (im.url || '').includes(k));
      return {
        ...im,
        url: key ? RELIABLE[key] : im.url || 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Product',
      };
    });
  }
}

async function seed() {
  await connectDB();

  const force = process.env.FORCE_SEED === '1' || process.argv.includes('--force');
  const existingCount = await Product.countDocuments();

  if (existingCount > 0 && !force) {
    console.log(`Database already has ${existingCount} products.`);
    console.log('Skipping seed to preserve your data (this is why products survive restarts).');
    console.log('To wipe and re-seed: FORCE_SEED=1 npm run seed   (or: npm run seed -- --force)');
    await mongoose.disconnect();
    process.exit(0);
  }

  if (force) {
    console.log('FORCE_SEED=1 → clearing products and categories...');
    await Product.deleteMany({});
    await Category.deleteMany({});
  } else {
    console.log('Empty database → seeding DEMO categories and products...');
  }

  const categories = await Category.insertMany(
    DEMO_CATEGORIES.map((c) => ({
      ...c,
      slug: slugify(c.name, { lower: true, strict: true }),
      isActive: true,
    }))
  );
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  const demoProducts = [
    {
      name: 'Basmati Rice Premium',
      shortDescription: 'Long grain aromatic basmati rice',
      description: 'Premium long-grain basmati rice for daily cooking and special occasions.',
      category: catMap['Rice & Grains'],
      brand: 'Local Select',
      images: [img('photo-1586201375761-83865001e31c', 'Basmati rice')],
      variants: [
        { name: '1 kg', sku: 'RICE-BAS-1KG', price: 120, mrp: 140, stock: 50, isDefault: true },
        { name: '5 kg', sku: 'RICE-BAS-5KG', price: 550, mrp: 650, stock: 20 },
      ],
      isFeatured: true,
      tags: ['rice', 'basmati'],
    },
    {
      name: 'Sona Masoori Rice',
      shortDescription: 'Lightweight everyday rice',
      description: 'Popular medium-grain rice for daily meals.',
      category: catMap['Rice & Grains'],
      brand: 'Local Select',
      images: [img('photo-1536304993881-ff6e9eefa2a6', 'Sona Masoori rice')],
      variants: [
        { name: '1 kg', sku: 'RICE-SM-1KG', price: 55, mrp: 65, stock: 80, isDefault: true },
        { name: '5 kg', sku: 'RICE-SM-5KG', price: 250, mrp: 300, stock: 30 },
      ],
      isFeatured: true,
      tags: ['rice'],
    },
    {
      name: 'Brown Rice',
      shortDescription: 'Whole grain brown rice',
      description: 'Nutritious brown rice, high in fibre.',
      category: catMap['Rice & Grains'],
      brand: 'Local Select',
      images: [img('photo-1536304993881-ff6e9eefa2a6', 'Brown rice')],
      variants: [
        { name: '1 kg', sku: 'RICE-BRN-1KG', price: 75, mrp: 90, stock: 40, isDefault: true },
      ],
      isFeatured: false,
      tags: ['rice', 'brown'],
    },
    {
      name: 'Poha (Flattened Rice)',
      shortDescription: 'Thick poha for breakfast',
      description: 'Cleaned thick poha for upma and snacks.',
      category: catMap['Rice & Grains'],
      brand: 'Local Select',
      images: [img('photo-1586201375761-83865001e31c', 'Poha')],
      variants: [
        { name: '500 g', sku: 'POHA-500', price: 40, mrp: 48, stock: 60, isDefault: true },
        { name: '1 kg', sku: 'POHA-1KG', price: 75, mrp: 90, stock: 35 },
      ],
      isFeatured: false,
      tags: ['poha', 'rice'],
    },
    {
      name: 'Toor Dal (Arhar)',
      shortDescription: 'Classic toor dal',
      description: 'Cleaned and sorted toor dal.',
      category: catMap['Pulses & Dal'],
      brand: 'Local Select',
      images: [img('photo-1596797038530-2c107229654b', 'Toor dal')],
      variants: [
        { name: '500 g', sku: 'DAL-TOOR-500', price: 70, mrp: 85, stock: 60, isDefault: true },
        { name: '1 kg', sku: 'DAL-TOOR-1KG', price: 135, mrp: 160, stock: 40 },
      ],
      isFeatured: true,
      tags: ['dal', 'toor'],
    },
    {
      name: 'Chana Dal',
      shortDescription: 'Split chickpea dal',
      description: 'High quality chana dal.',
      category: catMap['Pulses & Dal'],
      brand: 'Local Select',
      images: [img('photo-1615485290382-441e4d049cb5', 'Chana dal')],
      variants: [
        { name: '500 g', sku: 'DAL-CHANA-500', price: 55, mrp: 65, stock: 50, isDefault: true },
        { name: '1 kg', sku: 'DAL-CHANA-1KG', price: 105, mrp: 125, stock: 35 },
      ],
      isFeatured: false,
      tags: ['dal', 'chana'],
    },
    {
      name: 'Masoor Dal',
      shortDescription: 'Red lentils',
      description: 'Quick-cooking masoor dal.',
      category: catMap['Pulses & Dal'],
      brand: 'Local Select',
      images: [img('photo-1596797038530-2c107229654b', 'Masoor dal')],
      variants: [{ name: '500 g', sku: 'DAL-MASOOR-500', price: 60, mrp: 72, stock: 45, isDefault: true }],
      isFeatured: false,
      tags: ['dal', 'masoor'],
    },
    {
      name: 'Moong Dal',
      shortDescription: 'Split green gram',
      description: 'Cleaned moong dal.',
      category: catMap['Pulses & Dal'],
      brand: 'Local Select',
      images: [img('photo-1615485290382-441e4d049cb5', 'Moong dal')],
      variants: [
        { name: '500 g', sku: 'DAL-MOONG-500', price: 65, mrp: 78, stock: 50, isDefault: true },
        { name: '1 kg', sku: 'DAL-MOONG-1KG', price: 125, mrp: 150, stock: 30 },
      ],
      isFeatured: true,
      tags: ['dal', 'moong'],
    },
    {
      name: 'Urad Dal',
      shortDescription: 'Black gram dal',
      description: 'Quality urad dal for cooking.',
      category: catMap['Pulses & Dal'],
      brand: 'Local Select',
      images: [img('photo-1596797038530-2c107229654b', 'Urad dal')],
      variants: [{ name: '500 g', sku: 'DAL-URAD-500', price: 80, mrp: 95, stock: 40, isDefault: true }],
      isFeatured: false,
      tags: ['dal', 'urad'],
    },
    {
      name: 'Refined Sunflower Oil',
      shortDescription: 'Light cooking oil',
      description: 'Refined sunflower oil for daily cooking.',
      category: catMap['Cooking Oils & Ghee'],
      brand: 'Fortune',
      images: [img('photo-1474979266404-7eaacbcd87c5', 'Cooking oil')],
      variants: [
        { name: '1 L', sku: 'OIL-SF-1L', price: 145, mrp: 165, stock: 40, isDefault: true },
        { name: '5 L', sku: 'OIL-SF-5L', price: 700, mrp: 800, stock: 15 },
      ],
      isFeatured: true,
      tags: ['oil'],
    },
    {
      name: 'Mustard Oil',
      shortDescription: 'Kachi ghani mustard oil',
      description: 'Traditional mustard oil for Indian cooking.',
      category: catMap['Cooking Oils & Ghee'],
      brand: 'Local Select',
      images: [img('photo-1474979266404-7eaacbcd87c5', 'Mustard oil')],
      variants: [
        { name: '1 L', sku: 'OIL-MUS-1L', price: 160, mrp: 185, stock: 35, isDefault: true },
      ],
      isFeatured: true,
      tags: ['oil', 'mustard'],
    },
    {
      name: 'Pure Desi Ghee',
      shortDescription: 'Traditional pure ghee',
      description: 'Pure cow ghee.',
      category: catMap['Cooking Oils & Ghee'],
      brand: 'Amul',
      images: [img('photo-1628088062855-487d8302184b', 'Ghee')],
      variants: [
        { name: '500 ml', sku: 'GHEE-500', price: 320, mrp: 360, stock: 25, isDefault: true },
        { name: '1 L', sku: 'GHEE-1L', price: 620, mrp: 700, stock: 15 },
      ],
      isFeatured: true,
      tags: ['ghee'],
    },
    {
      name: 'Turmeric Powder (Haldi)',
      shortDescription: 'Pure turmeric powder',
      description: 'Finely ground turmeric.',
      category: catMap['Spices & Masala'],
      brand: 'Everest',
      images: [img('photo-1596040033229-a0b44cfd2f5b', 'Turmeric')],
      variants: [
        { name: '100 g', sku: 'SPI-HALDI-100', price: 35, mrp: 42, stock: 100, isDefault: true },
        { name: '200 g', sku: 'SPI-HALDI-200', price: 65, mrp: 78, stock: 60 },
      ],
      isFeatured: true,
      tags: ['spice', 'haldi'],
    },
    {
      name: 'Red Chilli Powder',
      shortDescription: 'Vibrant red chilli powder',
      description: 'Quality red chilli powder.',
      category: catMap['Spices & Masala'],
      brand: 'MDH',
      images: [img('photo-1596040033229-a0b44cfd2f5b', 'Chilli powder')],
      variants: [{ name: '100 g', sku: 'SPI-MIRCHI-100', price: 40, mrp: 50, stock: 80, isDefault: true }],
      isFeatured: false,
      tags: ['spice', 'mirchi'],
    },
    {
      name: 'Coriander Powder (Dhania)',
      shortDescription: 'Ground coriander',
      description: 'Freshly ground coriander powder.',
      category: catMap['Spices & Masala'],
      brand: 'Everest',
      images: [img('photo-1596040033229-a0b44cfd2f5b', 'Coriander')],
      variants: [{ name: '100 g', sku: 'SPI-DHANIA-100', price: 38, mrp: 45, stock: 70, isDefault: true }],
      isFeatured: false,
      tags: ['spice', 'dhania'],
    },
    {
      name: 'Garam Masala',
      shortDescription: 'Aromatic garam masala blend',
      description: 'Classic garam masala.',
      category: catMap['Spices & Masala'],
      brand: 'Everest',
      images: [img('photo-1596040033229-a0b44cfd2f5b', 'Garam masala')],
      variants: [{ name: '50 g', sku: 'SPI-GARAM-50', price: 45, mrp: 55, stock: 70, isDefault: true }],
      isFeatured: false,
      tags: ['spice', 'masala'],
    },
    {
      name: 'Cumin Seeds (Jeera)',
      shortDescription: 'Whole cumin seeds',
      description: 'Premium jeera for tempering.',
      category: catMap['Spices & Masala'],
      brand: 'Local Select',
      images: [img('photo-1596040033229-a0b44cfd2f5b', 'Cumin')],
      variants: [{ name: '100 g', sku: 'SPI-JEERA-100', price: 55, mrp: 65, stock: 55, isDefault: true }],
      isFeatured: false,
      tags: ['spice', 'jeera'],
    },
    {
      name: 'Iodized Salt',
      shortDescription: 'Refined iodized salt',
      description: 'Everyday table salt.',
      category: catMap['Spices & Masala'],
      brand: 'Tata',
      images: [img('photo-1604719312566-8912e9227c6a', 'Salt')],
      variants: [{ name: '1 kg', sku: 'SALT-1KG', price: 25, mrp: 28, stock: 120, isDefault: true }],
      isFeatured: false,
      tags: ['salt'],
    },
    {
      name: 'Namkeen Mixture',
      shortDescription: 'Classic salty namkeen mix',
      description: 'Crunchy namkeen mixture.',
      category: catMap['Snacks & Namkeen'],
      brand: 'Haldiram',
      images: [img('photo-1558961363-fa8fdf82db35', 'Namkeen')],
      variants: [
        { name: '200 g', sku: 'SNK-NAM-200', price: 45, mrp: 55, stock: 50, isDefault: true },
        { name: '400 g', sku: 'SNK-NAM-400', price: 85, mrp: 100, stock: 30 },
      ],
      isFeatured: true,
      tags: ['namkeen', 'snack'],
    },
    {
      name: 'Marie Biscuits',
      shortDescription: 'Light tea-time biscuits',
      description: 'Classic Marie biscuits.',
      category: catMap['Snacks & Namkeen'],
      brand: 'Britannia',
      images: [img('photo-1558961363-fa8fdf82db35', 'Biscuits')],
      variants: [{ name: '250 g', sku: 'SNK-MARIE-250', price: 30, mrp: 35, stock: 80, isDefault: true }],
      isFeatured: false,
      tags: ['biscuit'],
    },
    {
      name: 'Potato Chips',
      shortDescription: 'Crispy salted chips',
      description: 'Packaged potato chips.',
      category: catMap['Snacks & Namkeen'],
      brand: 'Lays',
      images: [img('photo-1558961363-fa8fdf82db35', 'Chips')],
      variants: [{ name: '52 g', sku: 'SNK-CHIPS-52', price: 20, mrp: 20, stock: 100, isDefault: true }],
      isFeatured: false,
      tags: ['chips', 'snack'],
    },
    {
      name: 'Assorted Chocolates Pack',
      shortDescription: 'Popular chocolate assortment',
      description: 'Mixed chocolates pack.',
      category: catMap['Sweets & Confectionery'],
      brand: 'Cadbury',
      images: [img('photo-1549007994-cb92caebd54b', 'Chocolates')],
      variants: [{ name: '100 g', sku: 'SWT-CHOC-100', price: 80, mrp: 95, stock: 40, isDefault: true }],
      isFeatured: true,
      tags: ['chocolate'],
    },
    {
      name: 'Assam Tea Leaves',
      shortDescription: 'Strong Assam CTC tea',
      description: 'Full-bodied Assam tea.',
      category: catMap['Beverages'],
      brand: 'Tata Tea',
      images: [img('photo-1564890369478-c89ca6d9cde9', 'Tea')],
      variants: [
        { name: '250 g', sku: 'BEV-TEA-250', price: 95, mrp: 110, stock: 45, isDefault: true },
        { name: '500 g', sku: 'BEV-TEA-500', price: 180, mrp: 210, stock: 25 },
      ],
      isFeatured: true,
      tags: ['tea'],
    },
    {
      name: 'Filter Coffee Powder',
      shortDescription: 'South Indian filter coffee',
      description: 'Aromatic filter coffee powder.',
      category: catMap['Beverages'],
      brand: 'Local Select',
      images: [img('photo-1447933601403-0c6688de566e', 'Coffee')],
      variants: [{ name: '200 g', sku: 'BEV-COF-200', price: 120, mrp: 140, stock: 30, isDefault: true }],
      isFeatured: false,
      tags: ['coffee'],
    },
    {
      name: 'Bathing Soap',
      shortDescription: 'Gentle bathing soap',
      description: 'Everyday bathing soap.',
      category: catMap['Toiletries'],
      brand: 'Dove',
      images: [img('photo-1626197031507-c1709975321c', 'Soap')],
      variants: [{ name: '100 g', sku: 'TOI-SOAP-100', price: 45, mrp: 55, stock: 90, isDefault: true }],
      isFeatured: false,
      tags: ['soap'],
    },
    {
      name: 'Toothpaste',
      shortDescription: 'Family toothpaste',
      description: 'Fluoride toothpaste.',
      category: catMap['Toiletries'],
      brand: 'Colgate',
      images: [img('photo-1626197031507-c1709975321c', 'Toothpaste')],
      variants: [{ name: '150 g', sku: 'TOI-TP-150', price: 85, mrp: 99, stock: 60, isDefault: true }],
      isFeatured: false,
      tags: ['toothpaste'],
    },
    {
      name: 'Detergent Powder',
      shortDescription: 'Effective washing powder',
      description: 'Laundry detergent.',
      category: catMap['Kitchen & Household'],
      brand: 'Surf Excel',
      images: [img('photo-1582735689369-4fe89db7114c', 'Detergent')],
      variants: [{ name: '1 kg', sku: 'HH-DET-1KG', price: 110, mrp: 130, stock: 40, isDefault: true }],
      isFeatured: false,
      tags: ['detergent'],
    },
    {
      name: 'Dishwash Liquid',
      shortDescription: 'Kitchen dishwash liquid',
      description: 'Effective dishwash liquid.',
      category: catMap['Kitchen & Household'],
      brand: 'Vim',
      images: [img('photo-1582735689369-4fe89db7114c', 'Dishwash')],
      variants: [{ name: '500 ml', sku: 'HH-DW-500', price: 95, mrp: 110, stock: 35, isDefault: true }],
      isFeatured: false,
      tags: ['dishwash'],
    },
  ];

  fixImages(demoProducts);
  await Product.insertMany(demoProducts);

  const adminEmail = 'admin@madhuram.local';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Store Admin',
      email: adminEmail,
      password: 'Admin@12345',
      role: 'admin',
      phone: env.store.phonePrimary,
    });
    console.log('Created DEMO admin: admin@madhuram.local / Admin@12345');
  }

  console.log(`Seeded ${categories.length} categories and ${demoProducts.length} products.`);
  console.log('Data is stored in MongoDB and will remain after restart.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
