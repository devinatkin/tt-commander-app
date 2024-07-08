# Use an official Node runtime as a parent image
FROM node:22-alpine

# Install git
RUN apk add --no-cache git

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that your app runs on
EXPOSE 5173

# Define the command to run your app using Vite
CMD ["npx", "vite", "--host"]
