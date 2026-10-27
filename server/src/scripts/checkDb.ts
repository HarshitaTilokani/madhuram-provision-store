/**
 * Shows EXACTLY which MongoDB the app is reading from, and what is inside it.
 * Run:  cd server && npm run check-db
 *
 * Compare the "Host" and "Database" printed here with the connection
 * and database selected in MongoDB Compass.
 */
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

async function main() {
  await connectDB();
  const conn = mongoose.connection;

  console.log('\n=== CONNECTION USED BY THE APP ===');
  console.log('Host      :', conn.host);
  console.log('Database  :', conn.name);
  console.log('Collection:', Product.collection.name, '(products) /', Category.collection.name, '(categories)');

  const total = await Product.countDocuments();
  const active = await Product.countDocuments({ isActive: true });
  console.log(`\nProducts: ${total} total, ${active} active`);

  const cats = await Category.find().sort({ sortOrder: 1 }).lean();
  console.log('\n=== CATEGORIES (slug -> products) ===');
  for (const c of cats) {
    const n = await Product.countDocuments({ category: c._id, isActive: true });
    console.log(`${c.name.padEnd(26)} slug=${c.slug.padEnd(26)} products=${n}  _id=${c._id}`);
  }

  const catIds = new Set(cats.map((c) => String(c._id)));
  const all = await Product.find().select('name slug category isActive').lean();
  const orphans = all.filter((p) => !catIds.has(String(p.category)));
  console.log(`\nProducts whose category does not exist: ${orphans.length}`);
  orphans.forEach((p) => console.log('  -', p.name, '| category =', String(p.category)));

  console.log('\n=== THE THREE PRODUCTS ===');
  for (const re of [/toothpaste/i, /detergent/i, /dishwash/i]) {
    const found = await Product.find({ name: re }).select('name slug isActive category').lean();
    if (!found.length) console.log(`${re}: NOT FOUND in this database`);
    found.forEach((p) => console.log(`${p.name} | _id=${p._id} | slug=${p.slug} | active=${p.isActive}`));
  }

  console.log('\nLatest 5 inserted products:');
  const last = await Product.find().sort({ _id: -1 }).limit(5).select('name').lean();
  last.forEach((p) => console.log('  -', p.name));

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
