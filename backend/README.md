# Azure 3-Tier E-Commerce — Backend REST API

This is the backend service for the 3-Tier Azure E-Commerce application, built with **Node.js, Express, TypeScript, and Prisma ORM** targeting **PostgreSQL**.

---

## Architecture & Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and route directory |
| `GET` | `/api/health` | Service liveness and database ping check |
| `GET` | `/api/products` | Retrieve catalog products (supports `?category=` and `?search=`) |
| `POST` | `/api/orders` | Create an order with line items, stock validation, and price calculation |
| `GET` | `/api/orders` | Retrieve list of placed orders with items |

---

## Directory Structure

```
backend/
├── Dockerfile                   # Multi-stage Docker build for Azure Container Apps
├── .env.example                 # Environment configuration template
├── .gitignore                   # Ignored directories and secret files
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── prisma/
│   ├── schema.prisma            # Prisma schema (Product, Order, OrderItem)
│   ├── seed.ts                  # Seed script with 5 sample e-commerce items
│   └── migrations/
│       └── 20261005000000_init/
│           └── migration.sql    # Idempotent PostgreSQL DDL migration
└── src/
    ├── app.ts                   # Express application setup & middleware
    ├── index.ts                 # Server entry point & graceful shutdown
    ├── lib/
    │   └── prisma.ts            # Prisma client singleton
    ├── middlewares/
    │   └── errorHandler.ts      # Structured error handler (Zod, Prisma, HTTP)
    └── routes/
        ├── health.routes.ts     # Health check route
        ├── products.routes.ts   # Product catalog routes
        └── orders.routes.ts     # Order placement & retrieval routes
```

---

## Quickstart

### 1. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` points to your PostgreSQL instance.

### 2. Local Docker Compose (Recommended)
From the root directory, launch PostgreSQL and the backend service:
```bash
docker compose up -d
```

### 3. Database Migration & Seeding
Apply migrations:
```bash
npm run prisma:migrate
```
Seed the 5 sample products:
```bash
npm run prisma:seed
```

### 4. Running the Development Server
```bash
npm run dev
```

---

## API Request Examples

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Place an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "shippingAddress": "456 Market St, San Francisco, CA",
    "items": [
      {
        "productId": "<PRODUCT_UUID>",
        "quantity": 1
      }
    ]
  }'
```

