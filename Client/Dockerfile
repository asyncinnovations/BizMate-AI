# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# stability + low memory
ENV NODE_OPTIONS="--max-old-space-size=1024"

RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm install --prefer-offline --no-audit --progress=false

COPY . .

RUN npm run build


# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Only copy needed files (IMPORTANT)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next  # if Next.js
COPY --from=builder /app/public ./public

# install only production deps (light)
RUN npm install --omit=dev --no-audit --prefer-offline

EXPOSE 3000

CMD ["npm", "start"]