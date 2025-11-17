import type { StockMovement } from '../../types';

export interface StockMovementListProps {
  movements: StockMovement[];
  isLoading?: boolean;
  onViewDetails?: (movement: StockMovement) => void;
}
