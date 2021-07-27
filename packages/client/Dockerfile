# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY packages/client/package.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
ADD  packages/client/.env.local ./.env.local
ADD  packages/client/tsconfig.server.json ./tsconfig.server.json
ADD  packages/client/tsconfig.json ./tsconfig.json
COPY packages/client/styles ./styles
COPY packages/client/public ./public
COPY packages/client/src ./src
COPY packages/client/.babelrc ./.babelrc
COPY packages/client/next.config.js ./next.config.js
COPY packages/client/next-env.d.ts ./next-env.d.ts
COPY packages/client/package.json yarn.lock ./

ENV GENERATE_SOURCEMAP false
RUN yarn install --frozen-lockfile && yarn build:all

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3030 

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/dist/server.js ./dist/server.js
# COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3030

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["yarn", "start"]
CMD ["node dist/server.js"]