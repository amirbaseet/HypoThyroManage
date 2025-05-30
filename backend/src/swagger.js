// src/swagger.js
const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const DOMAIN = process.env.DOMAIN || 'localhost';
const USE_HTTPS = (process.env.USE_HTTPS ?? "false").toLowerCase() === "true";
const PROTOCOL = USE_HTTPS ? 'https' : 'http';
const BASE_URL = `${PROTOCOL}://${DOMAIN}:${PORT}`;

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

// 📦 Export Swagger JSON
const jsonOutputPath = path.join(__dirname, '../swagger-output/swagger-output.json');
fs.writeFileSync(jsonOutputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log(`✅ Swagger JSON exported to: ${jsonOutputPath}`);

// 📦 Export Swagger YAML
const yamlOutputPath = path.join(__dirname, '../swagger-output/swagger-output.yaml');
fs.writeFileSync(yamlOutputPath, yaml.dump(swaggerSpec), 'utf-8');
console.log(`✅ Swagger YAML exported to: ${yamlOutputPath}`);

// 📚 Swagger UI setup
const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger UI available at ${BASE_URL}/api-docs`);
};

module.exports = setupSwaggerDocs;
