FROM node:18

# Create app directory
WORKDIR /app

# Copy dependency files and install
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the required ports
EXPOSE 8081 19000 19001 19002

# Start the Expo server with tunnel (so you can test from mobile)
CMD ["npx", "expo", "start", "--tunnel"]
