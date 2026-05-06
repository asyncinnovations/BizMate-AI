# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Prevent memory crashes on small VPS
ENV NODE_OPTIONS="--max-old-space-size=768"

RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install --prefer-offline --no-audit --progress=false

COPY . .

# Build Next.js app
RUN npm run build


# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output (IMPORTANT)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Start optimized server
CMD ["node", "server.js"]