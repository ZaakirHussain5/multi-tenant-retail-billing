FROM node:24-alpine AS development
RUN corepack enable
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/database/package.json packages/database/package.json
RUN pnpm install --frozen-lockfile
COPY . .

FROM development AS build
RUN pnpm --filter @retail/worker build

FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /workspace/apps/worker/dist ./dist
COPY --from=build /workspace/node_modules ./node_modules
CMD ["node", "dist/main.js"]

