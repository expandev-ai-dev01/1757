import { format } from 'date-fns';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { StockMovementListProps } from './types';

const movementTypeLabels: Record<string, string> = {
  entrada: 'Entrada',
  saida: 'Saída',
  ajuste: 'Ajuste',
  criacao: 'Criação',
  exclusao: 'Exclusão',
};

const movementTypeColors: Record<string, string> = {
  entrada: 'bg-green-100 text-green-800',
  saida: 'bg-red-100 text-red-800',
  ajuste: 'bg-yellow-100 text-yellow-800',
  criacao: 'bg-blue-100 text-blue-800',
  exclusao: 'bg-gray-100 text-gray-800',
};

export const StockMovementList = ({
  movements,
  isLoading = false,
  onViewDetails,
}: StockMovementListProps) => {
  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (movements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma movimentação encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data/Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Saldo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            {onViewDetails && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movements.map((movement) => (
            <tr key={movement.idStockMovement} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(movement.dateTime), 'dd/MM/yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.productName || `Produto #${movement.idProduct}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    movementTypeColors[movement.movementType] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {movementTypeLabels[movement.movementType] || movement.movementType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.quantity > 0 ? '+' : ''}
                {movement.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.runningBalance !== undefined ? movement.runningBalance : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {movement.userName || `Usuário #${movement.idUser}`}
              </td>
              {onViewDetails && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewDetails(movement)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver detalhes
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
