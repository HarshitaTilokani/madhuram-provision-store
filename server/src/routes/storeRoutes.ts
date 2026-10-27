import { Router } from 'express';
import { getStoreInfo } from '../controllers/storeController.js';

const router = Router();
router.get('/', getStoreInfo);
export default router;
