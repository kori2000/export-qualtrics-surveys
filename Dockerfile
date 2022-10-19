FROM node:16.0.0-slim

# App work directory
WORKDIR /usr/src/app

# Get app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --loglevel=error

# Bundle app source into container
COPY . .

# Port exposed
EXPOSE 4400

# Run app
CMD [ "npm", "start" ]