# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY book-service/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY book-service/ .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY book-service/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main"]

