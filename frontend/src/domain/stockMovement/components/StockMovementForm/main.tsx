import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { StockMovementFormProps } from './types';

const stockMovementSchema = z.object({
  idProduct: z.number().int().positive({ message: 'Produto é obrigatório' }),
  movementType: z.enum(['entrada', 'saida', 'ajuste', 'criacao', 'exclusao']),
  quantity: z.number().refine((val) => val !== 0, { message: 'Quantidade não pode ser zero' }),
  reason: z.string().max(255).optional(),
  referenceDocument: z.string().max(50).optional(),
  batchNumber: z.string().max(30).optional(),
  expirationDate: z.string().optional(),
  location: z.string().max(50).optional(),
  unitCost: z.number().positive().optional(),
});

type FormData = z.infer<typeof stockMovementSchema>;

export const StockMovementForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
}: StockMovementFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      idProduct: initialData?.idProduct,
      movementType: initialData?.movementType,
      quantity: initialData?.quantity,
      reason: initialData?.reason,
      referenceDocument: initialData?.referenceDocument,
      batchNumber: initialData?.batchNumber,
      expirationDate: initialData?.expirationDate,
      location: initialData?.location,
      unitCost: initialData?.unitCost,
    },
  });

  const movementType = watch('movementType');
  const requiresReason = movementType === 'ajuste' || movementType === 'exclusao';

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      idProduct: data.idProduct,
      movementType: data.movementType,
      quantity: data.quantity,
      reason: data.reason,
      referenceDocument: data.referenceDocument,
      batchNumber: data.batchNumber,
      expirationDate: data.expirationDate,
      location: data.location,
      unitCost: data.unitCost,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="idProduct" className="block text-sm font-medium text-gray-700 mb-2">
            Produto *
          </label>
          <input
            id="idProduct"
            type="number"
            {...register('idProduct', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.idProduct && (
            <p className="mt-1 text-sm text-red-600">{errors.idProduct.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="movementType" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Movimentação *
          </label>
          <select
            id="movementType"
            {...register('movementType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Selecione...</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ajuste">Ajuste</option>
            <option value="criacao">Criação</option>
            <option value="exclusao">Exclusão</option>
          </select>
          {errors.movementType && (
            <p className="mt-1 text-sm text-red-600">{errors.movementType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade *
          </label>
          <input
            id="quantity"
            type="number"
            step="0.01"
            {...register('quantity', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="referenceDocument"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Documento de Referência
          </label>
          <input
            id="referenceDocument"
            type="text"
            {...register('referenceDocument')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.referenceDocument && (
            <p className="mt-1 text-sm text-red-600">{errors.referenceDocument.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Número do Lote
          </label>
          <input
            id="batchNumber"
            type="text"
            {...register('batchNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.batchNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.batchNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
            Data de Validade
          </label>
          <input
            id="expirationDate"
            type="date"
            {...register('expirationDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.expirationDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700 mb-2">
            Custo Unitário
          </label>
          <input
            id="unitCost"
            type="number"
            step="0.01"
            {...register('unitCost', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.unitCost && (
            <p className="mt-1 text-sm text-red-600">{errors.unitCost.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Motivo {requiresReason && '*'}
        </label>
        <textarea
          id="reason"
          {...register('reason')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
