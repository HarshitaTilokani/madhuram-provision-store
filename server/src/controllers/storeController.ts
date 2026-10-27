import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStoreInfo = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      name: env.store.name,
      tagline: env.store.tagline,
      address: env.store.address,
      city: env.store.city,
      state: env.store.state,
      pincode: env.store.pincode,
      phonePrimary: env.store.phonePrimary,
      phoneSecondary: env.store.phoneSecondary,
      email: env.store.email,
      gstin: env.store.gstin,
      hours: env.store.hours,
      owners: [env.store.owner1, env.store.owner2],
      minimumOrderValue: env.store.minimumOrderValue,
      deliveryFee: env.store.deliveryFee,
      freeDeliveryThreshold: env.store.freeDeliveryThreshold,
    },
  });
});
