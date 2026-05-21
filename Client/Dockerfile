FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

ENV NODE_OPTIONS="--max-old-space-size=768"

RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 10 \
 && npm config set fetch-timeout 600000 \
 && npm config set maxsockets 5 \
 && npm install -g npm@latest \
 && npm ci --no-audit --no-fund --legacy-peer-deps

COPY . .

RUN npm run build


FROM node:20-alpine

# WORKDIR /app
# ENV NODE_ENV=production

# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]