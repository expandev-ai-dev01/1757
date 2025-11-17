import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { CurrentStockTableProps } from './types';

const statusLabels: Record<string, string> = {
  normal: 'Normal',
  baixo: 'Baixo',
  critico: 'Crítico',
  excesso: 'Excesso',
};

const statusColors: Record<string, string> = {
  normal: 'bg-green-100 text-green-800',
  baixo: 'bg-yellow-100 text-yellow-800',
  critico: 'bg-red-100 text-red-800',
  excesso: 'bg-blue-100 text-blue-800',
};

export const CurrentStockTable = ({
  stock,
  isLoading = false,
  onViewMovements,
}: CurrentStockTableProps) => {
  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (stock.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum produto em estoque</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade Atual
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mínimo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Máximo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {onViewMovements && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stock.map((item) => (
            <tr key={item.idProduct} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.productName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.currentQuantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.minimumQuantity !== undefined ? item.minimumQuantity : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.maximumQuantity !== undefined ? item.maximumQuantity : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    statusColors[item.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[item.status] || item.status}
                </span>
              </td>
              {onViewMovements && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewMovements(item.idProduct)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver movimentações
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
