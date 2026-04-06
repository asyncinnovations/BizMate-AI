# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

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

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# install only production deps
RUN npm install --omit=dev --no-audit --prefer-offline

EXPOSE 4040

CMD ["npm", "run", "start:prod"]