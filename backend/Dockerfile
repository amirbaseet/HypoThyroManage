# Use an official Node.js LTS base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy remaining application code
COPY . .

# Create a non-root user and group
RUN useradd --user-group --create-home --shell /bin/false appuser

# Change ownership and permissions (optional but recommended)
# Only fix permissions for internal folders (not host-mounted ones)
RUN mkdir -p /app/swagger-output && chmod -R 777 /app/swagger-output && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port your app listens on (adjust if needed)
EXPOSE 3001

# Define default command
CMD ["node", "src/index.js"]
