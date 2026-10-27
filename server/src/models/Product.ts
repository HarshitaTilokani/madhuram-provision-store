import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  isDefault?: boolean;
}

export interface IProductImage {
  publicId: string;
  url: string;
  alt?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  brand?: string;
  images: IProductImage[];
  variants: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  averageRating: number;
  numReviews: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
    shortDescription: { type: String, maxlength: 300 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    brand: { type: String, trim: true, index: true },
    images: [
      {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        alt: String,
      },
    ],
    variants: {
      type: [variantSchema],
      validate: {
        validator: (v: IProductVariant[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one variant is required',
      },
    },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.index({ name: 'text', brand: 'text', tags: 'text' });
productSchema.index({ 'variants.price': 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
