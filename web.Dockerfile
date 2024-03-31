FROM node:18-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY ./shared/package.json ./shared/package.json
COPY ./shared/package-lock.json ./shared/package-lock.json
COPY ./web/package.json ./web/package.json
COPY ./web/package-lock.json ./web/package-lock.json

WORKDIR /app/shared

RUN npm ci

WORKDIR /app/web

RUN npm ci

WORKDIR /app

COPY ./shared ./shared/
COPY ./web ./web/

WORKDIR /app/web

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

ENV NODE_ENV production
ENV PORT 3002

EXPOSE 3002

CMD npm run start
