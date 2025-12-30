FROM node:18-alpine

WORKDIR /app

# Install system dependencies for canvas / face-api
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    python3

# Copy package files
COPY package*.json ./

# Install dependencies (SAFE for Railway)
RUN npm install

# Copy source code
COPY . .

# Create required directories
RUN mkdir -p face_data uploads logs

# Set environment variables
ENV NODE_ENV=production

# Railway uses dynamic PORT
EXPOSE 3000

# Start app
CMD ["node", "src/server.js"]
