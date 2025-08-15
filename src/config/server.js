/**
 * Módulo de inicialización del servidor Express
 * @module config/server
 * @requires express
 * @requires cors
 * @requires body-parser
 */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

/**
 * Inicializa y configura el servidor Express
 * @function initServer
 * @returns {express.Application} Aplicación Express configurada
 */
const initServer = () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  return app;
};

module.exports = initServer;
