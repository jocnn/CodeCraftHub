/**
 * Módulo principal de la aplicación
 * @module app
 * @requires dotenv - Para cargar variables de entorno
 * @requires express - Framework web
 * @requires ./config/db - Conexión a MongoDB
 * @requires ./config/server - Configuración inicial del servidor
 * @requires ./routes/userRoutes - Rutas de usuario
 * @requires ./utils/errorHandler - Manejador de errores
 */

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const initServer = require("./config/server");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");

/**
 * Instancia de la aplicación Express configurada
 * @type {express.Application}
 */
const app = initServer();

// Establece conexión con la base de datos
connectDB();

// Configuración de rutas
app.use("/api/users", userRoutes);

// Manejador de errores (debe ser el último middleware)
app.use(errorHandler);

/**
 * Inicia el servidor HTTP
 * @type {http.Server}
 * 
 * Solo inicia el servidor si no estamos en modo test
 */
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

/**
 * Función para crear una instancia de servidor configurada para testing
 * @function createServer
 * @returns {express.Application} Aplicación Express configurada
 * @description Crea una nueva instancia del servidor sin iniciarlo automáticamente
 */
const createServer = () => {
  const testApp = initServer();
  testApp.use("/api/users", userRoutes);
  testApp.use(errorHandler);
  return testApp;
};

// Exportación principal para uso normal
module.exports = app;

// Exportación para testing (sin iniciar servidor)
module.exports.createTestServer = () => {
  const testApp = initServer();
  testApp.use('/api/users', userRoutes);
  testApp.use(errorHandler);
  return testApp;
};
