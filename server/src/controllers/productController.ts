import { Response } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
  const skip = (page - 1) * limit;

  const filter: any = { isActive: true };

  if (req.query.category) {
    // The storefront sends a category SLUG (e.g. "rice-and-grains").
    // Only add an _id condition when the value really is a 24-char ObjectId,
    // otherwise Mongoose throws a CastError (400 "Invalid ID format").
    const key = String(req.query.category).trim();
    const conditions: any[] = [{ slug: key.toLowerCase() }];
    if (/^[a-f\d]{24}$/i.test(key)) conditions.push({ _id: key });

    const cat = await Category.findOne({ $or: conditions }).select('_id').lean();

    if (!cat) {
      // Unknown category -> show an empty list (never silently show ALL products)
      res.json({
        success: true,
        data: [],
        pagination: { page, limit, total: 0, pages: 0 },
      });
      return;
    }
    filter.category = cat._id;
  }

  if (req.query.brand) {
    filter.brand = new RegExp(String(req.query.brand), 'i');
  }

  if (req.query.search) {
    const q = String(req.query.search).trim();
    if (q) {
      // Prefer text index when available; fall back to regex so search never hard-fails
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { brand: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') },
        { shortDescription: new RegExp(q, 'i') },
      ];
    }
  }

  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter['variants.price'] = {};
    if (req.query.minPrice) filter['variants.price'].$gte = parseFloat(String(req.query.minPrice));
    if (req.query.maxPrice) filter['variants.price'].$lte = parseFloat(String(req.query.maxPrice));
  }

  if (req.query.inStock === 'true') {
    filter['variants.stock'] = { $gt: 0 };
  }

  let sort: any = { createdAt: -1 };
  const sortParam = String(req.query.sort || '');
  if (sortParam === 'price_asc') sort = { 'variants.price': 1 };
  else if (sortParam === 'price_desc') sort = { 'variants.price': -1 };
  else if (sortParam === 'rating') sort = { averageRating: -1 };
  else if (sortParam === 'name') sort = { name: 1 };
  else if (sortParam === 'newest') sort = { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getProductBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .lean();

  if (!product) throw new AppError('Product not found', 404);

  res.json({ success: true, data: product });
});

export const getFeaturedProducts = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .limit(12)
    .lean();

  res.json({ success: true, data: products });
});

// Admin
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new AppError('Product not found', 404);
  res.json({ success: true, message: 'Product deactivated' });
});
