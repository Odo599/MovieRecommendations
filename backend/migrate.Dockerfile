FROM node:20-alpine
WORKDIR /app

COPY . .
RUN npm --workspace backend ci


