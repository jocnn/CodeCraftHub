/**
 * Módulo de manejo de errores
 * @module utils/errorHandler
 * @requires ./logger
 */

const logger = require("./logger");

/**
 * Middleware para manejo de errores
 * @function errorHandler
 * @param {Error} err - Error ocurrido
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {function} next - Función para pasar al siguiente middleware
 * @returns {void} No retorna valor, pero registra el error y envía una respuesta
 */
const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  // Manejo de errores de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Manejo de errores de duplicado
  if (err.message === "Email or username already exists") {
    return res.status(400).json({ error: err.message });
  }

  // Error general del servidor
  res.status(500).json({ error: "Something went wrong." });
};

module.exports = errorHandler;
