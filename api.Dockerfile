FROM node:18-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY ./shared/package.json ./shared/package.json
COPY ./shared/package-lock.json ./shared/package-lock.json
COPY ./api/package.json ./api/package.json
COPY ./api/package-lock.json ./api/package-lock.json

WORKDIR /app/shared

RUN npm ci

WORKDIR /app/api

RUN npm ci

WORKDIR /app

COPY ./shared ./shared/
COPY ./api ./api/

WORKDIR /app/api

ENV NODE_ENV production
ENV PORT 3001

EXPOSE 3001

CMD ["node", "src/server"]
