# Use official Node 20 image
FROM node:20

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose port 3000 for Next.js dev server
EXPOSE 3000

# Default command for dev environment
CMD ["npm", "run", "dev"]

