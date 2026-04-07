# Stage 1: Install dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies if any)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only production files and node_modules from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./
COPY --from=dependencies /app/index.js ./
COPY --from=dependencies /app/scripts ./scripts
COPY --from=dependencies /app/src ./src

# Expose the default port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Command to start the application
CMD ["npm", "start"]
