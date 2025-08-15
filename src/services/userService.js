/**
 * Módulo de servicios de usuario
 * @module services/userService
 * @requires ../models/userModel
 */

const User = require("../models/userModel");

/**
 * Busca un usuario por su ID
 * @async
 * @function findUserById
 * @param {string} userId - ID del usuario a buscar
 * @returns {Promise<Object>} Usuario encontrado
 */
exports.findUserById = async (userId) => {
  return await User.findById(userId);
};
