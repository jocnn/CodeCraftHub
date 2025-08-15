/**
 * Suite de pruebas de integración para el servicio de usuarios
 * @module tests/user.test
 * @requires supertest - Librería para testing HTTP
 * @requires mongoose - ODM para MongoDB
 * @requires ../src/models/userModel - Modelo de usuario
 * @requires ../src/app - Aplicación principal (usando createServer para testing)
 */

const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../src/models/userModel");
const { createTestServer } = require("../src/app");

/**
 * Instancia de la aplicación Express para testing
 * @type {express.Application}
 */
let app;

/**
 * Instancia del servidor HTTP para testing
 * @type {http.Server}
 */
let server;

/**
 * Configuración inicial antes de todas las pruebas
 * @function beforeAll
 * @async
 * @description
 * 1. Crea una instancia del servidor configurada para testing
 * 2. Inicia el servidor en un puerto aleatorio
 * 3. Establece conexión con MongoDB
 */
beforeAll(async () => {
  app = createTestServer();
  server = app.listen(0); // 0 = puerto aleatorio

  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/testdb",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
});

/**
 * Limpieza después de todas las pruebas
 * @function afterAll
 * @async
 * @description
 * 1. Cierra el servidor de testing
 * 2. Elimina todos los usuarios de la base de datos
 * 3. Cierra la conexión con MongoDB
 */
afterAll(async () => {
  await server.close();
  await User.deleteMany({});
  await mongoose.connection.close();
});

/**
 * Suite de pruebas para el servicio de usuarios
 * @description Pruebas de integración para los endpoints de registro y autenticación
 */
describe("User Service Integration Tests", () => {
  /**
   * Prueba: Registro con email duplicado
   * @test {POST /api/users/register}
   * @description Verifica que el sistema rechace registros con emails duplicados
   * con un código 400 y mensaje claro
   */
  it("should register a new user with valid data", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(server)
      .post("/api/users/register")
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  /**
   * Prueba: Registro con email duplicado
   * @test {POST /api/users/register}
   * @description Verifica que el sistema rechace registros con emails duplicados
   */
  it("should reject registration with duplicate email", async () => {
    const userData = {
      username: "testuser1",
      email: "duplicate@example.com",
      password: "password123",
    };

    // Primer registro exitoso
    await request(server).post("/api/users/register").send(userData);

    // Intento de registro con mismo email pero diferente username
    const response = await request(server).post("/api/users/register").send({
      username: "testuser2",
      email: userData.email, // Mismo email
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Email or username already exists");

    // Intento de registro con mismo username pero diferente email
    const response2 = await request(server).post("/api/users/register").send({
      username: userData.username, // Mismo username
      email: "another@example.com",
      password: "password123",
    });

    expect(response2.statusCode).toBe(400);
    expect(response2.body.error).toBe("Email or username already exists");
  });

  /**
   * Prueba: Autenticación exitosa
   * @test {POST /api/users/login}
   * @description Verifica que un usuario pueda autenticarse correctamente
   */
  it("should authenticate user with valid credentials", async () => {
    const userData = {
      username: "loginuser",
      email: "login@example.com",
      password: "password123",
    };

    // Registro previo
    await request(server).post("/api/users/register").send(userData);

    // Intento de login
    const response = await request(server).post("/api/users/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  /**
   * Prueba: Autenticación con contraseña incorrecta
   * @test {POST /api/users/login}
   * @description Verifica que el sistema rechace credenciales inválidas
   */
  it("should reject authentication with invalid password", async () => {
    const userData = {
      username: "wrongpassuser",
      email: "wrongpass@example.com",
      password: "password123",
    };

    // Registro previo
    await request(server).post("/api/users/register").send(userData);

    // Intento de login con contraseña incorrecta
    const response = await request(server).post("/api/users/login").send({
      email: userData.email,
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });

  /**
   * Prueba: Autenticación de usuario no existente
   * @test {POST /api/users/login}
   * @description Verifica que el sistema maneje correctamente usuarios no registrados
   */
  it("should reject authentication for non-existent user", async () => {
    const response = await request(server).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: "anypassword",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("User not found.");
  });
});

describe("Error Handler", () => {
  it("should handle validation errors with 400 status", async () => {
    // Intento de registro con datos inválidos
    const response = await request(server).post("/api/users/register").send({
      username: "a", // demasiado corto
      email: "invalid-email",
      password: "short",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(
      /Username must be at least|Invalid email format/
    );
  });

  it("should handle unexpected errors with 500 status", async () => {
    // Mockeamos el método findOne para forzar un error
    const originalFindOne = User.findOne;
    User.findOne = jest.fn(() => {
      throw new Error("Database connection failed");
    });

    const response = await request(server).post("/api/users/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Database connection failed");

    // Restauramos el método original
    User.findOne = originalFindOne;
  });
});