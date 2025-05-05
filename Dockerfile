# ===== FRONTEND BUILD =====
FROM node:18-bullseye-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ===== BACKEND BUILD =====
FROM node:18-bullseye-slim

WORKDIR /app

# Copy backend package files and install deps first
COPY backend/package*.json ./backend/
RUN cd backend && npm install --legacy-peer-deps

# Copy the backend code and frontend build
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./backend/public

WORKDIR /app/backend

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
