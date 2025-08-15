/**
 * Módulo de logger
 * @module utils/logger
 * @requires winston
 */

const winston = require("winston");

/**
 * Configuración del logger
 * @type {winston.Logger}
 * @property {string} level - Nivel mínimo de logs a registrar
 * @property {winston.format} format - Formato de los logs
 * @property {Array} transports - Destinos para los logs (archivo y consola)
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
