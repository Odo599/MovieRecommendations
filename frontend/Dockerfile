FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache curl
RUN curl -sfS https://dotenvx.sh/install.sh | sh

COPY .env* ./
COPY . .
RUN npm --workspace frontend ci
RUN npm --workspace frontend run typecheck
RUN npm --workspace frontend run build


CMD ["npx", "dotenvx", "run", \
    "-f", ".env", ".env.production", "--", \
    "npm", "--workspace", "frontend", \
    "run", "start"]
