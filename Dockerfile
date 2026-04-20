# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# --ignore-scripts prevents postinstall hooks (e.g. prisma generate) from running
# before schema.prisma is available. Scripts run explicitly in the builder stage.
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-slim AS builder
# Install OpenSSL for Prisma schema engine (debian-openssl-3.0.x target)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV HOME="/tmp/focussteps-build"
ENV XDG_CACHE_HOME="/tmp/focussteps-build/.cache"
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:/tmp/build.db"
ENV AUTH_SECRET="build-time-placeholder-secret"
ENV NEXT_PUBLIC_APP_URL="https://localhost:3000"
# Generate Prisma client now that schema.prisma is available
RUN npx prisma generate
RUN npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > /app/prisma/init.sql
RUN npm run build

# Stage 3: Runner
FROM node:20-slim AS runner
# Install sqlite for first-boot schema initialization and OpenSSL for Prisma runtime compatibility
RUN apt-get update -y && apt-get install -y sqlite3 openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/data/app.db"
ENV AUTH_SECRET="focussteps-default-secret-override-in-production"
ENV NEXT_PUBLIC_APP_URL=""
ENV HOME="/tmp/focussteps"
ENV XDG_CACHE_HOME="/tmp/focussteps/.cache"
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /data /tmp/focussteps/.cache && chown -R nextjs:nodejs /data /tmp/focussteps
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '3000')).then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["./docker-entrypoint.sh"]
