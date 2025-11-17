import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseCurrentStockOptions, UseCurrentStockReturn } from './types';

export const useCurrentStock = (options: UseCurrentStockOptions = {}): UseCurrentStockReturn => {
  const { idProduct, enabled = true } = options;

  const queryKey = ['current-stock', idProduct];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => stockMovementService.getCurrentStock(idProduct),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    stock: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
