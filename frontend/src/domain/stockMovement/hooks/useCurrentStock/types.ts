import type { CurrentStock } from '../../types';

export interface UseCurrentStockOptions {
  idProduct?: number;
  enabled?: boolean;
}

export interface UseCurrentStockReturn {
  stock: CurrentStock[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
