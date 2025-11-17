import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentStock } from '@/domain/stockMovement/hooks/useCurrentStock';
import { CurrentStockTable } from '@/domain/stockMovement/components/CurrentStockTable';
import { ErrorMessage } from '@/core/components/ErrorMessage';

export const CurrentStockPage = () => {
  const navigate = useNavigate();
  const [idProduct, setIdProduct] = useState<number | undefined>();

  const { stock, isLoading, error } = useCurrentStock({ idProduct });

  const handleViewMovements = (productId: number) => {
    navigate(`/stock-movements?idProduct=${productId}`);
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar estoque"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Estoque Atual</h1>
        <button
          onClick={() => navigate('/stock-movements/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Movimentação
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label htmlFor="productFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Produto
          </label>
          <input
            id="productFilter"
            type="number"
            placeholder="ID do produto"
            value={idProduct || ''}
            onChange={(e) => setIdProduct(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <CurrentStockTable
          stock={stock}
          isLoading={isLoading}
          onViewMovements={handleViewMovements}
        />
      </div>
    </div>
  );
};

export default CurrentStockPage;
