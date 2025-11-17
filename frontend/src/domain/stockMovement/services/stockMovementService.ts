import { authenticatedClient } from '@/core/lib/api';
import type {
  StockMovement,
  StockMovementListParams,
  StockMovementCreateDto,
  StockMovementListResponse,
  CurrentStock,
  CurrentStockResponse,
} from '../types';
import type { ApiResponse } from '@/core/types';

export const stockMovementService = {
  async list(params: StockMovementListParams): Promise<StockMovementListResponse> {
    const response = await authenticatedClient.get<ApiResponse<StockMovementListResponse>>(
      '/stock-movement',
      { params }
    );
    return response.data.data;
  },

  async getById(id: number): Promise<StockMovement> {
    const response = await authenticatedClient.get<ApiResponse<StockMovement>>(
      `/stock-movement/${id}`
    );
    return response.data.data;
  },

  async create(data: StockMovementCreateDto): Promise<{ idStockMovement: number }> {
    const response = await authenticatedClient.post<ApiResponse<{ idStockMovement: number }>>(
      '/stock-movement',
      data
    );
    return response.data.data;
  },

  async getCurrentStock(idProduct?: number): Promise<CurrentStock[]> {
    const response = await authenticatedClient.get<ApiResponse<CurrentStockResponse>>(
      '/stock-current',
      { params: idProduct ? { idProduct } : {} }
    );
    return response.data.data.stock;
  },
};
