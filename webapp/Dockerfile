ARG NODE_VERSION=24.14.0-alpine

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Development stage
FROM builder AS development

COPY . .

EXPOSE 5173

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/dist ./dist
RUN --mount=type=cache,target=/root/.npm npm install --global serve@14.2.6

USER node
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]