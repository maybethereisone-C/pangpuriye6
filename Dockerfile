# syntax=docker/dockerfile:1

# ─── Stage 1: deps ────────────────────────────────────────────────────────────
# Install production + dev deps separately so the runner stage only ships prod.
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
# ci is faster than install and respects the lockfile exactly
RUN npm ci

# ─── Stage 2: builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy source
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build args for public env vars (non-secret, baked at build time)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_HOSTNAME
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_HOSTNAME=$NEXT_PUBLIC_API_HOSTNAME

RUN npm run build

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
# Only the standalone output + public assets land here — no node_modules, no src.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Least-privilege: run as non-root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Static assets + pre-rendered pages
COPY --from=builder /app/public ./public

# Standalone output (server.js + minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static chunks (CSS, JS) required at runtime
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
# Bind to all interfaces so Docker can reach it
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
