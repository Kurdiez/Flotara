FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/ ./packages/shared/

COPY apps/server/package.json ./apps/server/
COPY apps/server/ ./apps/server/

RUN yarn install --frozen-lockfile --ignore-scripts
RUN yarn global add typescript turbo
RUN cd packages/shared && yarn install && yarn build
RUN cd apps/server && yarn install && yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/server ./apps/server

RUN yarn install --production --frozen-lockfile --ignore-scripts

WORKDIR /app/apps/server

ENV ENVIRONMENT=development
ENV PORT=8080

EXPOSE 8080

CMD ["yarn", "start:prod"]