# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# --ignore-scripts prevents postinstall hooks (e.g. prisma generate) from running
# before schema.prisma is available. Scripts run explicitly in the builder stage.
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:/tmp/build.db"
ENV AUTH_SECRET="build-time-placeholder-secret"
ENV NEXT_PUBLIC_APP_URL="https://localhost:3000"
# Generate Prisma client now that schema.prisma is available
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/app.db"
ENV AUTH_SECRET="focussteps-default-secret-override-in-production"
ENV NEXT_PUBLIC_APP_URL=""
# openssl required by Prisma query engine at runtime
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /data && chown nextjs:nodejs /data
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
# effect is required by @prisma/config (Prisma v6+)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/effect ./node_modules/effect
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push --skip-generate && echo 'DB schema initialized' && node server.js"]
