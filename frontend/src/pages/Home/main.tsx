export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">StockBox</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema para controlar itens no estoque: entradas, saídas e quantidade atual
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Começar
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Saiba Mais
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
