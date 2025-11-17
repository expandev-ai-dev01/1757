import type { StockMovementCreateDto } from '../../types';

export interface StockMovementFormProps {
  onSubmit: (data: StockMovementCreateDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<StockMovementCreateDto>;
}
