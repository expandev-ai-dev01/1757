import { useNavigate } from 'react-router-dom';
import { useStockMovementCreate } from '@/domain/stockMovement/hooks/useStockMovementCreate';
import { StockMovementForm } from '@/domain/stockMovement/components/StockMovementForm';
import type { StockMovementCreateDto } from '@/domain/stockMovement/types';

export const NewStockMovementPage = () => {
  const navigate = useNavigate();

  const { create, isCreating } = useStockMovementCreate({
    onSuccess: () => {
      navigate('/stock-movements');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar movimentação: ${error.message}`);
    },
  });

  const handleSubmit = async (data: StockMovementCreateDto) => {
    try {
      await create(data);
    } catch (error: unknown) {
      console.error('Error creating stock movement:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/stock-movements')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Nova Movimentação de Estoque</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <StockMovementForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/stock-movements')}
          isSubmitting={isCreating}
        />
      </div>
    </div>
  );
};

export default NewStockMovementPage;
