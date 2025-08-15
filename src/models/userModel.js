/**
 * Módulo del modelo de Usuario
 * @module models/userModel
 * @requires mongoose
 */

const mongoose = require("mongoose");

/**
 * Esquema de usuario para MongoDB
 * @typedef {Object} UserSchema
 * @property {string} username - Nombre de usuario (único)
 * @property {string} email - Correo electrónico (único)
 * @property {string} password - Contraseña hasheada
 * @property {string} role - Rol del usuario (student/instructor/admin)
 * @property {Date} createdAt - Fecha de creación del usuario
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.path("email").validate(async (value) => {
  const emailCount = await mongoose.models.User.countDocuments({
    email: value,
  });
  return !emailCount;
}, "Email already exists");

userSchema.path("username").validate(async (value) => {
  const usernameCount = await mongoose.models.User.countDocuments({
    username: value,
  });
  return !usernameCount;
}, "Username already exists");

// Validación personalizada para mejor manejo de errores
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email or username already exists'));
    } else {
        next(error);
    }
});

/**
 * Modelo de Usuario para MongoDB
 * @class User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
