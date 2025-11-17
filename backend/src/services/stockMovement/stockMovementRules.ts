/**
 * @summary
 * Stock movement business logic and database operations.
 *
 * @module services/stockMovement/stockMovementRules
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import type {
  StockMovementCreateRequest,
  StockMovementListRequest,
  StockMovementGetRequest,
  StockCurrentGetRequest,
  StockMovementCreateResponse,
  StockMovementListResponse,
  StockMovementGetResponse,
  StockCurrentGetResponse,
} from './stockMovementTypes';

/**
 * @summary
 * Creates a new stock movement record.
 *
 * @function stockMovementCreate
 * @module stockMovement
 *
 * @param {StockMovementCreateRequest} params - Movement creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idProduct - Product identifier
 * @param {string} params.movementType - Movement type
 * @param {number} params.quantity - Quantity being moved
 * @param {string} [params.reason] - Reason for movement
 * @param {string} [params.referenceDocument] - Reference document
 * @param {string} [params.batchNumber] - Batch number
 * @param {string} [params.expirationDate] - Expiration date
 * @param {string} [params.location] - Storage location
 * @param {number} [params.unitCost] - Unit cost
 *
 * @returns {Promise<StockMovementCreateResponse>} Created movement data
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementCreate(
  params: StockMovementCreateRequest
): Promise<StockMovementCreateResponse> {
  const result = await dbRequest(
    '[functional].[spStockMovementCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      idProduct: params.idProduct,
      movementType: params.movementType,
      quantity: params.quantity,
      reason: params.reason || null,
      referenceDocument: params.referenceDocument || null,
      batchNumber: params.batchNumber || null,
      expirationDate: params.expirationDate || null,
      location: params.location || null,
      unitCost: params.unitCost || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Lists stock movements with filtering and pagination.
 *
 * @function stockMovementList
 * @module stockMovement
 *
 * @param {StockMovementListRequest} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} [params.idProduct] - Filter by product
 * @param {string} [params.movementType] - Filter by movement type
 * @param {string} [params.startDate] - Filter by start date
 * @param {string} [params.endDate] - Filter by end date
 * @param {number} [params.idUser] - Filter by user
 * @param {string} [params.referenceDocument] - Filter by reference document
 * @param {string} [params.orderBy] - Sort order
 * @param {number} [params.page] - Page number
 * @param {number} [params.pageSize] - Items per page
 *
 * @returns {Promise<StockMovementListResponse>} Movement list with pagination
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementList(
  params: StockMovementListRequest
): Promise<StockMovementListResponse> {
  const results = await dbRequest(
    '[functional].[spStockMovementList]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct || null,
      movementType: params.movementType || null,
      startDate: params.startDate || null,
      endDate: params.endDate || null,
      idUser: params.idUser || null,
      referenceDocument: params.referenceDocument || null,
      orderBy: params.orderBy || 'date_desc',
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    },
    ExpectedReturn.Multi
  );

  return {
    movements: results[0] || [],
    pagination: results[1]
      ? results[1][0]
      : { totalRecords: 0, totalPages: 0, currentPage: 1, pageSize: 20 },
  };
}

/**
 * @summary
 * Gets a specific stock movement by ID.
 *
 * @function stockMovementGet
 * @module stockMovement
 *
 * @param {StockMovementGetRequest} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idStockMovement - Movement identifier
 *
 * @returns {Promise<StockMovementGetResponse>} Movement details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function stockMovementGet(
  params: StockMovementGetRequest
): Promise<StockMovementGetResponse> {
  const result = await dbRequest(
    '[functional].[spStockMovementGet]',
    {
      idAccount: params.idAccount,
      idStockMovement: params.idStockMovement,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Gets current stock levels for all products or a specific product.
 *
 * @function stockCurrentGet
 * @module stockMovement
 *
 * @param {StockCurrentGetRequest} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} [params.idProduct] - Filter by specific product
 *
 * @returns {Promise<StockCurrentGetResponse>} Current stock levels
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function stockCurrentGet(
  params: StockCurrentGetRequest
): Promise<StockCurrentGetResponse> {
  const results = await dbRequest(
    '[functional].[spStockCurrentGet]',
    {
      idAccount: params.idAccount,
      idProduct: params.idProduct || null,
    },
    ExpectedReturn.Multi
  );

  return results;
}
