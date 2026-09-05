FROM node:22.22-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22.22-alpine AS production-dependencies-env
ENV NODE_ENV=production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

FROM node:22.22-alpine AS build-env
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY . .
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
RUN npm run build

FROM node:22.22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-dependencies-env --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --from=build-env --chown=node:node /app/build ./build
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
