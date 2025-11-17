/**
 * @summary
 * Type definitions for stock movement operations.
 *
 * @module services/stockMovement/stockMovementTypes
 */

/**
 * @interface StockMovementCreateRequest
 * @description Request parameters for creating a stock movement
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idProduct - Product identifier
 * @property {string} movementType - Movement type (entrada, saida, ajuste, criacao, exclusao)
 * @property {number} quantity - Quantity being moved
 * @property {string} [reason] - Reason for movement
 * @property {string} [referenceDocument] - Reference document number
 * @property {string} [batchNumber] - Batch number
 * @property {string} [expirationDate] - Expiration date (ISO 8601)
 * @property {string} [location] - Storage location
 * @property {number} [unitCost] - Unit cost
 */
export interface StockMovementCreateRequest {
  idAccount: number;
  idUser: number;
  idProduct: number;
  movementType: 'entrada' | 'saida' | 'ajuste' | 'criacao' | 'exclusao';
  quantity: number;
  reason?: string | null;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  unitCost?: number | null;
}

/**
 * @interface StockMovementCreateResponse
 * @description Response data for created stock movement
 *
 * @property {number} idStockMovement - Created movement identifier
 */
export interface StockMovementCreateResponse {
  idStockMovement: number;
}

/**
 * @interface StockMovementListRequest
 * @description Request parameters for listing stock movements
 *
 * @property {number} idAccount - Account identifier
 * @property {number} [idProduct] - Filter by product
 * @property {string} [movementType] - Filter by movement type
 * @property {string} [startDate] - Filter by start date (ISO 8601)
 * @property {string} [endDate] - Filter by end date (ISO 8601)
 * @property {number} [idUser] - Filter by user
 * @property {string} [referenceDocument] - Filter by reference document
 * @property {string} [orderBy] - Sort order (date_asc, date_desc, product_asc, product_desc)
 * @property {number} [page] - Page number
 * @property {number} [pageSize] - Items per page
 */
export interface StockMovementListRequest {
  idAccount: number;
  idProduct?: number;
  movementType?: 'entrada' | 'saida' | 'ajuste' | 'criacao' | 'exclusao';
  startDate?: string;
  endDate?: string;
  idUser?: number;
  referenceDocument?: string;
  orderBy?: 'date_asc' | 'date_desc' | 'product_asc' | 'product_desc';
  page?: number;
  pageSize?: number;
}

/**
 * @interface StockMovementListResponse
 * @description Response data for stock movement list
 *
 * @property {Array} movements - List of movements
 * @property {Object} pagination - Pagination information
 */
export interface StockMovementListResponse {
  movements: any[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

/**
 * @interface StockMovementGetRequest
 * @description Request parameters for getting a stock movement
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idStockMovement - Movement identifier
 */
export interface StockMovementGetRequest {
  idAccount: number;
  idStockMovement: number;
}

/**
 * @interface StockMovementGetResponse
 * @description Response data for stock movement details
 *
 * @property {number} idStockMovement - Movement identifier
 * @property {number} idProduct - Product identifier
 * @property {string} productName - Product name
 * @property {string} movementType - Movement type
 * @property {number} quantity - Quantity moved
 * @property {string} dateTime - Movement date and time
 * @property {number} idUser - User identifier
 * @property {string} [reason] - Movement reason
 * @property {string} [referenceDocument] - Reference document
 * @property {string} [batchNumber] - Batch number
 * @property {string} [expirationDate] - Expiration date
 * @property {string} [location] - Storage location
 * @property {number} [unitCost] - Unit cost
 */
export interface StockMovementGetResponse {
  idStockMovement: number;
  idProduct: number;
  productName: string;
  movementType: string;
  quantity: number;
  dateTime: string;
  idUser: number;
  reason?: string | null;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  unitCost?: number | null;
}

/**
 * @interface StockCurrentGetRequest
 * @description Request parameters for getting current stock
 *
 * @property {number} idAccount - Account identifier
 * @property {number} [idProduct] - Filter by specific product
 */
export interface StockCurrentGetRequest {
  idAccount: number;
  idProduct?: number;
}

/**
 * @interface StockCurrentGetResponse
 * @description Response data for current stock levels
 *
 * @property {Array} stock - Current stock levels
 */
export interface StockCurrentGetResponse {
  [key: string]: any[];
}
