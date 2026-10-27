import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/madhuram_provision_store',

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me_32chars_min_xx',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me_32chars_min_xx',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  store: {
    name: process.env.STORE_NAME || 'Madhuram Provision Store',
    tagline: process.env.STORE_TAGLINE || 'Your trusted neighbourhood kirana store in Beawar',
    address: process.env.STORE_ADDRESS || '[ADD FULL STORE ADDRESS, Beawar, Rajasthan]',
    city: process.env.STORE_CITY || 'Beawar',
    state: process.env.STORE_STATE || 'Rajasthan',
    pincode: process.env.STORE_PINCODE || '[ADD PINCODE]',
    phonePrimary: process.env.STORE_PHONE_PRIMARY || '+91 9462498113',
    phoneSecondary: process.env.STORE_PHONE_SECONDARY || '+91 9414259167',
    email: process.env.STORE_EMAIL || '[ADD BUSINESS EMAIL]',
    gstin: process.env.STORE_GSTIN || '[ADD GSTIN IF AVAILABLE]',
    hours: process.env.STORE_HOURS || '8:00 AM - 9:00 PM (Mon - Sun)',
    owner1: process.env.OWNER_1 || 'Raju Jeswani',
    owner2: process.env.OWNER_2 || 'Tulsi Jeswani',
    minimumOrderValue: parseFloat(process.env.MINIMUM_ORDER_VALUE || '0'),
    deliveryFee: parseFloat(process.env.DELIVERY_FEE || '0'),
    freeDeliveryThreshold: parseFloat(process.env.FREE_DELIVERY_THRESHOLD || '0'),
  },
};
