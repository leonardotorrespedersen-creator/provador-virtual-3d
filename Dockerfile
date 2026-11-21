# Build do front-end React
FROM node:22-alpine AS client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Servidor Node que serve a API e o build estático
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/index.js ./
COPY --from=client /app/client/dist /app/client/dist
RUN mkdir -p data && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "index.js"]
