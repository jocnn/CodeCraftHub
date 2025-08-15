/**
 * Módulo factory para crear datos de prueba de usuarios
 * @module tests/factories/userFactory
 * @requires ../src/models/userModel - Modelo de usuario
 */

const User = require("../../src/models/userModel");
const bcrypt = require("bcrypt");

/**
 * Crea un objeto de usuario para pruebas
 * @function createUser
 * @param {Object} [overrides={}] - Valores para sobrescribir los defaults
 * @returns {Object} Objeto con datos de usuario
 * @example
 * // Retorna usuario con datos default
 * createUser();
 *
 * // Retorna usuario con email específico
 * createUser({ email: 'test@test.com' });
 */
const createUser = (overrides = {}) => {
  const defaults = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    role: "student",
  };

  return { ...defaults, ...overrides };
};

/**
 * Crea y guarda un usuario en la base de datos
 * @function createUserInDb
 * @async
 * @param {Object} [overrides={}] - Valores para sobrescribir los defaults
 * @returns {Promise<User>} Instancia del modelo User guardada en DB
 * @example
 * // Crea usuario con datos default
 * await createUserInDb();
 *
 * // Crea usuario admin
 * await createUserInDb({ role: 'admin' });
 */
const createUserInDb = async (overrides = {}) => {
  const userData = createUser(overrides);

  // Hashear la contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = new User({
    ...userData,
    password: hashedPassword,
  });

  await user.save();
  return user;
};

/**
 * Crea un token JWT válido para un usuario
 * @function createValidToken
 * @async
 * @param {string} userId - ID del usuario
 * @returns {Promise<string>} Token JWT
 */
const createValidToken = async (userId) => {
  const jwt = require("jsonwebtoken");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
};

module.exports = {
  createUser,
  createUserInDb,
  createValidToken,
};
