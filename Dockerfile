# ===== FRONTEND BUILD =====
FROM node:18-bullseye-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ===== BACKEND BUILD =====
FROM node:18-bullseye-slim

WORKDIR /app/backend

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=256

# Backend install
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

# Copy backend code and frontend build
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3000

CMD ["npm", "start"]
