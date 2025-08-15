/**
 * Módulo de rutas de usuario
 * @module routes/userRoutes
 * @requires express
 * @requires ../controllers/userController
 */

const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

/**
 * Ruta para registrar un nuevo usuario
 * @name POST /register
 * @function
 * @param {string} path - Ruta del endpoint
 * @param {callback} middleware - Controlador de registro
 */
router.post("/register", registerUser);

/**
 * Ruta para autenticar un usuario
 * @name POST /login
 * @function
 * @param {string} path - Ruta del endpoint
 * @param {callback} middleware - Controlador de login
 */
router.post("/login", loginUser);

module.exports = router;
