/**
 * Swagger Documentation Setup for HypoThyroManage API
 * 
 * - Generates and serves Swagger API documentation using `swagger-jsdoc` and `swagger-ui-express`.
 * - Outputs Swagger JSON and YAML files for external tools.
 * 
 * Usage:
 * - Automatically includes all API route files (via `apis` glob pattern).
 * - Accessible at /api-docs when the app is running.
 */
const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
require('dotenv').config();

// Load environment variables for server details
const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || 'localhost';
const USE_HTTPS = (process.env.USE_HTTPS ?? "false").toLowerCase() === "true";
const PROTOCOL = USE_HTTPS ? 'https' : 'http';
const BASE_URL = `${PROTOCOL}://${DOMAIN}:${PORT}`;

// Swagger JSDoc configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HypoThyroManage API Documentation',
      version: '1.0.0',
      description: 'API documentation for HypoThyroManage backend services',
    },
    servers: [
      {
        url: BASE_URL,
        description: 'Local/Docker API server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Adjust as per your routes location
};


const swaggerSpec = swaggerJsdoc(options);

/**
 * 📦 Export the generated Swagger JSON to file
 */
const jsonOutputPath = path.join(__dirname, '../../swagger-output/swagger-output.json');
fs.writeFileSync(jsonOutputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log(`✅ Swagger JSON exported to: ${jsonOutputPath}`);

/**
 * 📦 Export the generated Swagger YAML to file
 */
const yamlOutputPath = path.join(__dirname, '../../swagger-output/swagger-output.yaml');
fs.writeFileSync(yamlOutputPath, yaml.dump(swaggerSpec), 'utf-8');
console.log(`✅ Swagger YAML exported to: ${yamlOutputPath}`);

/**
 * Set up Swagger UI routes in the Express app.
 * 
 * @param {Express.Application} app - The Express app instance.
 */
const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger UI available at ${BASE_URL}/api-docs`);
};

module.exports = setupSwaggerDocs;
