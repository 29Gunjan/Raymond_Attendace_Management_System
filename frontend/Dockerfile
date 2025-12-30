FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build for production
RUN npm run build

# Production stage - serve static files
FROM node:18-alpine AS production

WORKDIR /app

# Install serve to host static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Railway uses dynamic PORT
EXPOSE 3000

# Serve the static files
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
