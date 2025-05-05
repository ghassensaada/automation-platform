# ===== FRONTEND BUILD =====
FROM node:18 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ===== BACKEND BUILD =====
FROM node:18

WORKDIR /app

# Copy backend code
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy entire project (for shared files like .env or static)
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./backend/public

WORKDIR /app/backend

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
