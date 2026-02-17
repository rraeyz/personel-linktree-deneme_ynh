# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies (Prisma 7 will be used)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client (requires prisma.config.ts and DATABASE_URL)
ENV DATABASE_URL="file:./prisma/dev.db"
RUN npx prisma generate

# Build Next.js with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Install runtime dependencies (dumb-init + better-sqlite3 runtime deps)
RUN apk add --no-cache dumb-init

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Create directories with proper permissions
RUN mkdir -p /app/prisma /app/public/uploads && \
    chown -R nextjs:nodejs /app/prisma /app/public/uploads

USER nextjs

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Initialize database on first run, then start server
CMD ["sh", "-c", "npx prisma db push --url=\"${DATABASE_URL}\" --accept-data-loss && node server.js"]
