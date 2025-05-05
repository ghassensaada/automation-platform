# ===== BACKEND BUILD =====
FROM node:18

WORKDIR /app

# Copy backend package files and install deps separately
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy the rest AFTER install to optimize caching
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./backend/public

WORKDIR /app/backend

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
