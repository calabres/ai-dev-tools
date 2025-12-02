# Stage 1: Build Frontend
FROM node:18-alpine as build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Setup Backend and Final Image
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies and install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source code
COPY backend/ .

# Copy built frontend assets from Stage 1
COPY --from=build-frontend /app/frontend/dist ../frontend/dist

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
