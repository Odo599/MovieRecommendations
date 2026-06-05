FROM node:20-alpine
WORKDIR /app

COPY . .
RUN npm --workspace frontend ci
RUN npm --workspace frontend run build


CMD ["npm", "--workspace", "frontend", "run", "start"]
