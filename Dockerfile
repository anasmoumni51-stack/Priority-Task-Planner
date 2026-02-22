# Use Node.js base image (Alpine for smaller size)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for Docker cache optimization)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for nodemon)
RUN npm install

# Copy the rest of the project code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
