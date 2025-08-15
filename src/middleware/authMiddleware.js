/**
 * Módulo de middleware de autenticación
 * @module middlewares/authMiddleware
 * @requires jsonwebtoken
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar el token JWT
 * @function authMiddleware
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {function} next - Función para pasar al siguiente middleware
 * @returns {void} No retorna valor, pero verifica el token o envía un error
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
