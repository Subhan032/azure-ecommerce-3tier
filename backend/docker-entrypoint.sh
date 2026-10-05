#!/bin/sh
set -e

echo "==> Running Prisma database migrations against PostgreSQL..."
npx prisma migrate deploy

echo "==> Ensuring sample products are seeded in database..."
npx tsx prisma/seed.ts || echo "==> Note: Seed step encountered an error or was already populated."

echo "==> Starting backend REST API server..."
exec "$@"

