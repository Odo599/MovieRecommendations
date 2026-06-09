FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

RUN npm ci

FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build --workspace=backend

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

RUN apk add --no-cache curl
RUN curl -sfS https://dotenvx.sh/install.sh | sh

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/drizzle ./backend/drizzle

COPY .env* ./

WORKDIR /app/backend
EXPOSE 3000

CMD ["npm", "run", "start"]
