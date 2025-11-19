# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 4040
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]
