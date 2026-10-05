# Azure 3-Tier E-Commerce — Frontend SPA

A modern, responsive Single Page Application (SPA) built with **React 18/19, Vite, and TypeScript**, containerized with a multi-stage **Nginx Alpine** image.

---

## Features

- **Product Catalog Grid**: Displays active products retrieved from `/api/products` with dynamic category filters and real-time search.
- **Order Placement**: Interactive modal submitting orders to `POST /api/orders` with live price calculation and stock deduction.
- **Nginx Reverse Proxy**: Forwards `/api/` calls seamlessly to the backend service and serves static assets with gzip compression.
- **Responsive Modern UI**: Built with accessible semantic elements, smooth animations, and clean styling (no bloated frameworks).

---

## Local Development (Vite Dev Server)

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:3000` and automatically proxy `/api` calls to `http://localhost:5000`.

---

## Production Build & Static Assets

To build for production (e.g. for Azure Static Web Apps deployment):

```bash
npm run build
```

Compiled static output is saved to `dist/`.

---

## Docker Execution

Run the complete 3-tier stack from the root directory:

```bash
docker compose up -d --build
```

Access the frontend at `http://localhost:3000`.

