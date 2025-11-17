/**
 * @summary
 * Internal (authenticated) API routes configuration
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as stockMovementController from '@/api/v1/internal/stock-movement/controller';

const router = Router();

// Stock movement routes
router.post('/stock-movement', stockMovementController.postHandler);
router.get('/stock-movement', stockMovementController.getHandler);
router.get('/stock-movement/:id', stockMovementController.getByIdHandler);
router.get('/stock-current', stockMovementController.getCurrentStockHandler);

export default router;
