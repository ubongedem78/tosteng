const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "tost API",
      version: "1.0.0",
      description: "API documentation for TOST application",
    },
    servers: [
      {
        url: "https://tost-app.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
