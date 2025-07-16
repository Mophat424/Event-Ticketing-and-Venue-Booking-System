import request from "supertest";
import { app } from "../../src/index";
import db from "../../src/Drizzle/db";
import { users, supportTickets } from "../../src/Drizzle/schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

describe("Support Tickets API", () => {
  let adminToken: string;
  let userToken: string;
  let adminId: number;
  let userId: number;

  beforeAll(async () => {
    await db.delete(supportTickets);
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

  describe("POST /tickets", () => {
    it("should allow user to create a support ticket", async () => {
      const res = await request(app)
        .post("/tickets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          subject: "Test Ticket",
          description: "Details about the issue",
          status: "Open",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("ticket_id");
      expect(res.body.subject).toBe("Test Ticket");
    });

    it("should reject if no token is provided", async () => {
      const res = await request(app).post("/tickets").send({
        subject: "Missing Token",
        description: "Unauthorized access",
        status: "Open",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/unauthorized/i);
    });
  });

  describe("GET /tickets", () => {
    beforeAll(async () => {
      await db.insert(supportTickets).values([
        { user_id: adminId, subject: "Admin Ticket", description: "admin desc", status: "Open" },
        { user_id: userId, subject: "User Ticket", description: "user desc", status: "Open" },
      ]);
    });

    it("should allow admin to fetch all tickets", async () => {
      const res = await request(app)
        .get("/tickets")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should allow user to fetch only their tickets", async () => {
      const res = await request(app)
        .get("/tickets")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.every((t: any) => t.user_id === userId)).toBe(true);
    });
  });

  describe("DELETE /tickets/:id", () => {
    let ticketIdToDeleteByAdmin: number;
    let ticketIdToDeleteByUser: number;

    beforeAll(async () => {
      const [adminTicket] = await db.insert(supportTickets).values({
        user_id: adminId,
        subject: "Delete by Admin",
        description: "Admin should delete this",
        status: "Open",
      }).returning();

      const [userTicket] = await db.insert(supportTickets).values({
        user_id: userId,
        subject: "Delete by User",
        description: "User should delete this",
        status: "Open",
      }).returning();

      ticketIdToDeleteByAdmin = adminTicket.ticket_id;
      ticketIdToDeleteByUser = userTicket.ticket_id;
    });

    it("should allow admin to delete any ticket", async () => {
      const res = await request(app)
        .delete(`/tickets/${ticketIdToDeleteByAdmin}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it("should allow user to delete their own ticket", async () => {
      const res = await request(app)
        .delete(`/tickets/${ticketIdToDeleteByUser}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it("should not allow user to delete someone else's ticket", async () => {
      const [adminTicket] = await db.insert(supportTickets).values({
        user_id: adminId,
        subject: "Forbidden",
        description: "Should not be deletable by user",
        status: "Open",
      }).returning();

      const res = await request(app)
        .delete(`/tickets/${adminTicket.ticket_id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });
});
