# ==========================================
# Stage 1: Install Dependencies
# ==========================================
FROM node:20-alpine AS deps

# Install OpenSSL and libc compatibility for Prisma engine binary resolution
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies (respect lockfile if present)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ==========================================
# Stage 2: Build Application & Generate Prisma
# ==========================================
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

# Generate Prisma Client (builds Linux musl query engine)
RUN npx prisma generate

# Copy source code and compile TypeScript to dist/
COPY src ./src
RUN npm run build

# Prune devDependencies (keeps prisma CLI and production dependencies)
RUN npm prune --production

# ==========================================
# Stage 3: Minimal Production Runner (Non-Root)
# ==========================================
FROM node:20-alpine AS runner

# Install OpenSSL for Prisma runtime queries and wget for healthchecks
RUN apk add --no-cache openssl wget

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy production node_modules, compiled dist, package manifests, and prisma migrations/schema
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/prisma ./prisma

# Copy container entrypoint script for automated migration deployment
COPY --chown=node:node docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh && chown -R node:node /app

# Switch to non-root user (UID 1000) for security hardening
USER node

# Health check endpoint verification
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

EXPOSE 5000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
