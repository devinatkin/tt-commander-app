# Use an official Node runtime as a parent image
FROM node:22-alpine

# Install git
RUN apk add --no-cache git

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY ./backend/package*.json ./

# Install dependencies (including TypeScript)
RUN npm install

# Copy the rest of the application files to the working directory
COPY ./backend/ ./

# Compile TypeScript files in place
RUN npx tsc

# Expose the port that your app runs on
EXPOSE 3000

# Define the command to run your server.js file
CMD ["node", "src/server.js"]
