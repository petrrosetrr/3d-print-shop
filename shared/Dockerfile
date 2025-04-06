# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
COPY .npmrc .npmrc
RUN npm ci --ignore-scripts

# ---------- Dependencies ----------
FROM base AS deps
WORKDIR /app
COPY . .
RUN npm ci

# ---------- Type check ----------
FROM deps AS typecheck
RUN npm run typecheck

# ---------- Lint ----------
FROM deps AS lint
RUN npm run lint

# ---------- Test ----------
FROM deps AS test
ENV NODE_ENV=test
RUN npm run test

# ---------- Build ----------
FROM deps AS build
RUN npm run build

# ---------- Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY .env.local .env.local
CMD ["node", "dist/index.js"]
