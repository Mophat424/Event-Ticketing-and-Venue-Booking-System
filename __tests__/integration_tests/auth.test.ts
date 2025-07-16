import request from "supertest";
import { app } from "../../src/index";
import db from "../../src/Drizzle/db";
import { users } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";


const testEmail = "testuser@example.com";

beforeAll(async () => {
  await db.delete(users).where(eq(users.email, testEmail));
});

afterAll(async () => {
  await db.delete(users).where(eq(users.email, testEmail));
  await db.$client.end();
});

describe("Auth API Integration", () => {
  const userData = {
    first_name: "Test",
    last_name: "User",
    email: testEmail,
    password: "password123",
    contact_phone: "0712345678",
    address: "Test Address",
  };

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/auth/register").send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "User registered successfully");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        role: "user",
      });
    });

    it("should return 400 for duplicate email", async () => {
      const res = await request(app).post("/auth/register").send(userData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 for invalid role", async () => {
      const invalidData = { ...userData, email: "another@example.com", role: "invalid" };
      const res = await request(app).post("/auth/register").send(invalidData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid role specified");
    });
  });

  describe("POST /auth/login", () => {
    it("should login with correct credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: userData.email,
        password: userData.password,
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        role: "user",
      });
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: userData.email,
        password: "wrongpassword",
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should reject login with non-existent email", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "notfound@example.com",
        password: "somepassword",
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });
  });
});
