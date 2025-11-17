import type { CurrentStock } from '../../types';

export interface CurrentStockTableProps {
  stock: CurrentStock[];
  isLoading?: boolean;
  onViewMovements?: (idProduct: number) => void;
}
