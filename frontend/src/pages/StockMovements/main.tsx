import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStockMovementList } from '@/domain/stockMovement/hooks/useStockMovementList';
import { StockMovementList } from '@/domain/stockMovement/components/StockMovementList';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { StockMovementListParams } from '@/domain/stockMovement/types';

export const StockMovementsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<StockMovementListParams>({
    orderBy: 'date_desc',
    page: 1,
    pageSize: 20,
  });

  const { movements, isLoading, error, pagination } = useStockMovementList({ filters });

  const handleFilterChange = (newFilters: Partial<StockMovementListParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar movimentações"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Movimentações de Estoque</h1>
        <button
          onClick={() => navigate('/stock-movements/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Movimentação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="movementType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Movimentação
            </label>
            <select
              id="movementType"
              value={filters.movementType || ''}
              onChange={(e) =>
                handleFilterChange({
                  movementType: e.target.value
                    ? (e.target.value as StockMovementListParams['movementType'])
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
              <option value="ajuste">Ajuste</option>
              <option value="criacao">Criação</option>
              <option value="exclusao">Exclusão</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              id="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange({ startDate: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              id="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange({ endDate: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <StockMovementList movements={movements} isLoading={isLoading} />

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMovementsPage;
