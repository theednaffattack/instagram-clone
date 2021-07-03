#
# Dependencies stage.
# Use this state to install production dependencies
#
FROM node:12.16.2 AS deps
WORKDIR /usr/src/app
COPY packages/server/package*.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile --production

#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:12.16.2 AS builder

WORKDIR /usr/src/app
# ENV YARN_CACHE_FOLDER=/dev/shm/yarn_cache

COPY packages/server/package*.json ./
COPY packages/server/tsconfig*.json ./
COPY packages/server/src ./src
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile && yarn build
# RUN npm ci --quiet && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:12.16.2-slim

WORKDIR /app
ENV NODE_ENV=production
# Need below to ensure sessions are secure
# ENV DEBUG=express-session

# RUN npm ci --quiet --only=production

## We just need the build to execute the command
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist


# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8080

USER node

# start the app
CMD ["node", "dist/main.js"]
# CMD ["yarn", "start"]
