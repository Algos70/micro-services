# Use the official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the port that the application will run on
EXPOSE 4000

# Set the default command to run when the container starts
CMD ["npm", "run", "start:prod"]
