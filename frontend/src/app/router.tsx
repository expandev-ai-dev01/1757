import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/pages/layouts/RootLayout';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

const HomePage = lazy(() => import('@/pages/Home'));
const StockMovementsPage = lazy(() => import('@/pages/StockMovements'));
const NewStockMovementPage = lazy(() => import('@/pages/NewStockMovement'));
const CurrentStockPage = lazy(() => import('@/pages/CurrentStock'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Erro</h1>
          <p className="text-gray-600 mb-4">Algo deu errado. Por favor, tente novamente.</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'stock-movements',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StockMovementsPage />
          </Suspense>
        ),
      },
      {
        path: 'stock-movements/new',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NewStockMovementPage />
          </Suspense>
        ),
      },
      {
        path: 'current-stock',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CurrentStockPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
