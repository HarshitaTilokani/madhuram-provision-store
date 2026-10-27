/**
 * Finds DUPLICATE categories (e.g. "Rice & Grains" twice, with slugs
 * "rice-and-grains" and "rice-grains") and merges their products into one.
 *
 *   npm run fix-categories            -> DRY RUN (only prints, changes nothing)
 *   npm run fix-categories -- --apply -> performs the merge
 *
 * Nothing is deleted: duplicate categories are only set to inactive.
 */
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectDB } from '../config/db.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

const apply = process.argv.includes('--apply');
const norm = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

async function main() {
  await connectDB();
  console.log(`Database: ${mongoose.connection.name} @ ${mongoose.connection.host}`);
  console.log(apply ? 'MODE: APPLY' : 'MODE: DRY RUN (add -- --apply to make changes)');

  // Step 1: give every category that has NO slug a proper one
  const slugFixTargets = await Category.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
  }).lean();
  for (const c of slugFixTargets) {
    const slug = slugify(c.name, { lower: true, strict: true });
    const clash = await Category.findOne({ slug, _id: { $ne: c._id } }).lean();
    if (clash) {
      console.log(`Cannot set slug "${slug}" for "${c.name}" - already used by another category`);
      continue;
    }
    console.log(`MISSING SLUG: "${c.name}" -> will set slug="${slug}"`);
    if (apply) await Category.updateOne({ _id: c._id }, { $set: { slug } });
  }

  const cats = await Category.find().lean();
  const counts = new Map<string, number>();
  for (const c of cats) counts.set(String(c._id), await Product.countDocuments({ category: c._id }));

  console.log('\nAll categories:');
  cats.forEach((c) =>
    console.log(` ${c.name.padEnd(26)} slug=${String(c.slug).padEnd(24)} active=${c.isActive} products=${counts.get(String(c._id))} _id=${c._id}`)
  );

  const groups = new Map<string, typeof cats>();
  for (const c of cats) {
    const k = norm(c.name);
    groups.set(k, [...(groups.get(k) || []), c]);
  }

  let merged = 0;
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const canonical = [...list].sort((a, b) => {
      const aGood = a.slug === slugify(a.name, { lower: true, strict: true}) ? 1 : 0;
      const bGood = b.slug === slugify(b.name, { lower: true, strict: true}) ? 1 : 0;
      if (aGood !== bGood) return bGood - aGood;
      return (counts.get(String(b._id)) || 0) - (counts.get(String(a._id)) || 0);
    })[0];

    console.log(`\nDUPLICATES FOUND -> keeping "${canonical.name}" (slug=${canonical.slug}, _id=${canonical._id})`);
    for (const dup of list) {
      if (String(dup._id) === String(canonical._id)) continue;
      const n = counts.get(String(dup._id)) || 0;
      console.log(`  merge "${dup.name}" (slug=${dup.slug}, _id=${dup._id}) -> moving ${n} product(s)`);
      if (apply) {
        await Product.updateMany({ category: dup._id }, { $set: { category: canonical._id } });
        await Category.updateOne({ _id: dup._id }, { $set: { isActive: false } });
      }
      merged++;
    }
    if (apply) await Category.updateOne({ _id: canonical._id }, { $set: { isActive: true } });
  }

  if (!merged) console.log('\nNo duplicate categories found.');
  if (!apply && slugFixTargets.length) console.log('\nRun again with: npm run fix-categories -- --apply   to save the slug fix.');

  const ids = new Set(cats.map((c) => String(c._id)));
  const orphans = (await Product.find().select('name category').lean()).filter((p) => !ids.has(String(p.category)));
  console.log(`\nProducts pointing to a category that does not exist: ${orphans.length}`);
  orphans.forEach((p) => console.log(`  - ${p.name} (category=${p.category})`));

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
