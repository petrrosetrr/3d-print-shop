FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

FROM base AS deps
COPY . .
RUN npm ci

FROM deps AS typecheck
RUN npm run typecheck

FROM deps AS lint
RUN npm run lint

FROM deps AS test
ENV NODE_ENV=test
RUN npm run test

FROM deps AS build
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]
