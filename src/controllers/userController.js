/**
 * Módulo de controladores de usuario
 * @module controllers/userController
 * @requires ../models/userModel
 * @requires bcrypt
 * @requires jsonwebtoken
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Registra un nuevo usuario
 * @async
 * @function registerUser
 * @param {Object} req - Objeto de solicitud Express
 * @param {string} req.body.username - Nombre de usuario
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} 
 * @throws {400} Si el email o username ya existen
 * @throws {500} Si ocurre un error en el servidor
 */
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe primero
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Mejor manejo de errores de duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email or username already exists",
      });
    }
    res.status(500).json({ error: "Registration failed." });
  }
};

/**
 * Autentica a un usuario existente
 * @async
 * @function loginUser
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<void>} No retorna valor, pero envía una respuesta JSON con el token JWT
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: `Login failed: ${error.message}` });
  }
};
