import { Outlet, Link, useLocation } from 'react-router-dom';

export const RootLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              StockBox
            </Link>
            <nav className="flex gap-4">
              <Link
                to="/stock-movements"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive('/stock-movements')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Movimentações
              </Link>
              <Link
                to="/current-stock"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive('/current-stock')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Estoque Atual
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            © 2024 StockBox. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
