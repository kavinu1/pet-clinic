# Use Node.js 20 Alpine for a small, secure base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install only production dependencies using npm ci
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the default port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Command to start the application
CMD ["npm", "start"]
