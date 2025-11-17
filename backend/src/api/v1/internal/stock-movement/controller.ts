/**
 * @summary
 * Stock movement controller handling all CRUD operations for inventory movements.
 *
 * @module api/v1/internal/stock-movement
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  stockMovementCreate,
  stockMovementList,
  stockMovementGet,
  stockCurrentGet,
} from '@/services/stockMovement';
import type {
  StockMovementCreateRequest,
  StockMovementListRequest,
  StockMovementGetRequest,
  StockCurrentGetRequest,
} from '@/services/stockMovement';

const securable = 'STOCK_MOVEMENT';

/**
 * @api {post} /api/v1/internal/stock-movement Create Stock Movement
 * @apiName CreateStockMovement
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new stock movement record
 *
 * @apiParam {Number} idProduct Product identifier
 * @apiParam {String} movementType Movement type (entrada, saida, ajuste, criacao, exclusao)
 * @apiParam {Number} quantity Quantity being moved
 * @apiParam {String} [reason] Reason for the movement
 * @apiParam {String} [referenceDocument] Reference document number
 * @apiParam {String} [batchNumber] Batch number
 * @apiParam {String} [expirationDate] Expiration date (ISO 8601)
 * @apiParam {String} [location] Storage location
 * @apiParam {Number} [unitCost] Unit cost
 *
 * @apiSuccess {Number} idStockMovement Created movement identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    idProduct: z.coerce.number().int().positive(),
    movementType: z.enum(['entrada', 'saida', 'ajuste', 'criacao', 'exclusao']),
    quantity: z.coerce.number(),
    reason: z.string().max(255).nullable().optional(),
    referenceDocument: z.string().max(50).nullable().optional(),
    batchNumber: z.string().max(30).nullable().optional(),
    expirationDate: z.string().date().nullable().optional(),
    location: z.string().max(50).nullable().optional(),
    unitCost: z.coerce.number().positive().nullable().optional(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated as {
      credential: { idAccount: number; idUser: number };
      params: StockMovementCreateRequest;
    };

    const result = await stockMovementCreate({
      ...data.params,
      idAccount: data.credential.idAccount,
      idUser: data.credential.idUser,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/stock-movement List Stock Movements
 * @apiName ListStockMovements
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists stock movements with filtering and pagination
 *
 * @apiParam {Number} [idProduct] Filter by product
 * @apiParam {String} [movementType] Filter by movement type
 * @apiParam {String} [startDate] Filter by start date (ISO 8601)
 * @apiParam {String} [endDate] Filter by end date (ISO 8601)
 * @apiParam {Number} [idUser] Filter by user
 * @apiParam {String} [referenceDocument] Filter by reference document
 * @apiParam {String} [orderBy=date_desc] Sort order
 * @apiParam {Number} [page=1] Page number
 * @apiParam {Number} [pageSize=20] Items per page
 *
 * @apiSuccess {Array} movements List of movements
 * @apiSuccess {Object} pagination Pagination information
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    idProduct: z.coerce.number().int().positive().optional(),
    movementType: z.enum(['entrada', 'saida', 'ajuste', 'criacao', 'exclusao']).optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    idUser: z.coerce.number().int().positive().optional(),
    referenceDocument: z.string().max(50).optional(),
    orderBy: z.enum(['date_asc', 'date_desc', 'product_asc', 'product_desc']).default('date_desc'),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated as {
      credential: { idAccount: number; idUser: number };
      params: StockMovementListRequest;
    };

    const result = await stockMovementList({
      ...data.params,
      idAccount: data.credential.idAccount,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/stock-movement/:id Get Stock Movement
 * @apiName GetStockMovement
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets a specific stock movement by ID
 *
 * @apiParam {Number} id Movement identifier
 *
 * @apiSuccess {Object} movement Movement details
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated as {
      credential: { idAccount: number; idUser: number };
      params: { id: number };
    };

    const result = await stockMovementGet({
      idStockMovement: data.params.id,
      idAccount: data.credential.idAccount,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/stock-current Get Current Stock
 * @apiName GetCurrentStock
 * @apiGroup StockMovement
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets current stock levels for all products or a specific product
 *
 * @apiParam {Number} [idProduct] Filter by specific product
 *
 * @apiSuccess {Array} stock Current stock levels
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getCurrentStockHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    idProduct: z.coerce.number().int().positive().optional(),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated as {
      credential: { idAccount: number; idUser: number };
      params: StockCurrentGetRequest;
    };

    const result = await stockCurrentGet({
      ...data.params,
      idAccount: data.credential.idAccount,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
