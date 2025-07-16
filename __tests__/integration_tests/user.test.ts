import request from "supertest";
import { app } from "../../src/index";
import db from "../../src/Drizzle/db";
import { users } from "../../src/Drizzle/schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

describe("User API", () => {
  let adminToken: string;
  let userToken: string;
  let adminId: number;
  let userId: number;

  beforeAll(async () => {
    await db.delete(users);

    const [admin] = await db.insert(users).values({
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: "hashedpass",
      role: "admin",
    }).returning();

    const [user] = await db.insert(users).values({
      first_name: "Regular",
      last_name: "User",
      email: "user@example.com",
      password: "hashedpass",
      role: "user",
    }).returning();

    adminId = admin.user_id;
    userId = user.user_id;

    adminToken = jwt.sign({ id: adminId, role: "admin" }, JWT_SECRET);
    userToken = jwt.sign({ id: userId, role: "user" }, JWT_SECRET);
  });

  describe("GET /users", () => {
    it("should allow admin to fetch all users", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should block non-admin users", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/only admins/i);
    });
  });

  describe("GET /users/me", () => {
    it("should return current user profile", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("user@example.com");
    });
  });

  describe("PUT /users/me", () => {
    it("should update user profile", async () => {
      const res = await request(app)
        .put("/users/me")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ first_name: "UpdatedName" });

      expect(res.status).toBe(200);
      expect(res.body.first_name).toBe("UpdatedName");
    });
  });

  describe("DELETE /users/:id", () => {
    let userToDeleteId: number;

    beforeAll(async () => {
      const [newUser] = await db.insert(users).values({
        first_name: "Delete",
        last_name: "Me",
        email: "deleteme@example.com",
        password: "hashedpass",
        role: "user",
      }).returning();

      userToDeleteId = newUser.user_id;
    });

    it("should allow admin to delete a user", async () => {
      const res = await request(app)
        .delete(`/users/${userToDeleteId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it("should block non-admin from deleting a user", async () => {
      const res = await request(app)
        .delete(`/users/${adminId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/only admins/i);
    });
  });
});
