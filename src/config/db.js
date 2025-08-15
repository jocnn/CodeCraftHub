/**
 * Módulo de conexión a MongoDB
 * @module config/db
 * @requires mongoose
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Establece la conexión con la base de datos MongoDB
 * @async
 * @function connectDB
 * @throws {Error} Si la conexión falla
 * @returns {Promise<void>} No retorna valor, pero establece la conexión con MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
