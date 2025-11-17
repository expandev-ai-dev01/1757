# StockBox Backend API

Sistema para controlar itens no estoque: entradas, saídas e quantidade atual.

## Features

- **Registrar Movimentações de Estoque**: Permitir que o usuário registre todas as ações no estoque (adição de novo produto, alteração de quantidade, entrada, saída ou exclusão de item) como movimentações no banco de dados.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Microsoft SQL Server
- **Validation**: Zod

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── config/                 # Configuration
├── migrations/             # Database migrations
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- Microsoft SQL Server
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure database connection in `.env`:
   ```
   DB_SERVER=localhost
   DB_PORT=1433
   DB_USER=sa
   DB_PASSWORD=your_password
   DB_NAME=stockbox
   ```

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

### Building for Production

```bash
npm run build
npm start
```

### Database Migrations

Migrations run automatically on server startup. To run migrations manually:
```bash
npm run migrate
```

## API Documentation

### Health Check

```
GET /health
```

Returns server health status.

### API Versioning

All API endpoints are versioned:
- External (public) endpoints: `/api/v1/external/...`
- Internal (authenticated) endpoints: `/api/v1/internal/...`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| DB_SERVER | Database server | localhost |
| DB_PORT | Database port | 1433 |
| DB_NAME | Database name | stockbox |
| DB_USER | Database user | sa |
| DB_PASSWORD | Database password | - |
| DB_ENCRYPT | Enable encryption | false |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## License

ISC
