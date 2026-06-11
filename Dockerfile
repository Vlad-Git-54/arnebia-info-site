FROM node:22-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV APP_INTERNAL_PORT=3001
ENV VINEXT_TRUST_PROXY=1

COPY --from=builder /app/dist/standalone ./
COPY --from=builder /app/timeweb-server.js ./timeweb-server.js

EXPOSE 3000

HEALTHCHECK --interval=2s --timeout=1s --start-period=1s --retries=1 CMD node -e "process.exit(0)"

CMD ["node", "timeweb-server.js"]
