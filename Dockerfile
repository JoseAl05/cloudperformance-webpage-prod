FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=localhost
ENV MONGO_URI=mongodb://placeholder:placeholder@localhost:27017/placeholder
ENV MONGODB_URI=mongodb://placeholder:placeholder@localhost:27017/placeholder
ENV MONGODB_USER_DB=placeholder
ENV MONGO_DB_AWS=placeholder
ENV MONGO_DB_AZURE=placeholder
ENV JWT_SECRET=placeholder-build-time-secret
ENV SECRET_KEY=placeholder-build-time-key
ENV AZURE_DB_USER=placeholder
ENV AZURE_DB_PASSWORD=placeholder
ENV AZURE_DB_HOST=placeholder
ENV AZURE_DB_PORT=5432
ENV AZURE_DB_NAME=placeholder
ENV AWS_DB_USER=placeholder
ENV AWS_DB_PASSWORD=placeholder
ENV AWS_DB_HOST=placeholder
ENV AWS_DB_PORT=5432
ENV AWS_DB_NAME=placeholder
ENV API_AWS_URL=http://placeholder
ENV API_AZURE_URL=http://placeholder
ENV API_GCP_URL=http://placeholder
ENV API_CLOUD_COMPARISON=http://placeholder
ENV API_ALERTAS_URL=http://placeholder
ENV API_PRESUPUESTO=http://placeholder
ENV MAIL_FROM=placeholder@placeholder.com
ENV SMTP_HOST=placeholder
ENV SMTP_PORT=587
ENV SMTP_USER=placeholder
ENV SMTP_PASS=placeholder
ENV AZURE_STORAGE_ACCOUNT_NAME=placeholder
ENV AZURE_STORAGE_ACCOUNT_KEY=placeholder

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
