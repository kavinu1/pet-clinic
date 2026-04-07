# Use Node.js LTS (Long Term Support) image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port (Render uses PORT environment variable)
EXPOSE 4000

# Set environment variable defaults
ENV PORT=4000
ENV NODE_ENV=production

# Command to start the application
CMD ["npm", "start"]
