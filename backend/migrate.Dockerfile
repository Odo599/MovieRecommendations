FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache curl
RUN curl -sfS https://dotenvx.sh/install.sh | sh

COPY . .
RUN npm --workspace backend ci

CMD ["npx", "dotenvx", "run", \
    "-f", "/app/.env", "/app/.env.production", "--", \
    "npm", "--workspace", "backend", \
    "run", "db:push"]
