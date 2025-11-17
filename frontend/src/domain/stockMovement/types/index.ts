export interface StockMovement {
  idStockMovement: number;
  idProduct: number;
  productName?: string;
  movementType: 'entrada' | 'saida' | 'ajuste' | 'criacao' | 'exclusao';
  quantity: number;
  dateTime: string;
  idUser: number;
  userName?: string;
  reason?: string | null;
  referenceDocument?: string | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  location?: string | null;
  unitCost?: number | null;
  runningBalance?: number;
}

export interface StockMovementListParams {
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

export interface StockMovementCreateDto {
  idProduct: number;
  movementType: 'entrada' | 'saida' | 'ajuste' | 'criacao' | 'exclusao';
  quantity: number;
  reason?: string;
  referenceDocument?: string;
  batchNumber?: string;
  expirationDate?: string;
  location?: string;
  unitCost?: number;
}

export interface CurrentStock {
  idProduct: number;
  productName: string;
  currentQuantity: number;
  minimumQuantity?: number;
  maximumQuantity?: number;
  status: 'normal' | 'baixo' | 'critico' | 'excesso';
  lastMovementDate?: string;
}

export interface StockMovementListResponse {
  movements: StockMovement[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CurrentStockResponse {
  stock: CurrentStock[];
}
