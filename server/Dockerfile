FROM node:22-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5001

# Set environment
ENV PORT=5001
ENV NODE_ENV=production

# Start application
CMD ["node", "src/server.js"]
