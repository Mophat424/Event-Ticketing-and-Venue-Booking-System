import request from "supertest";
import { app, server } from "../../src/index";
import db from "../../src/Drizzle/db";
import { users, venues, events, bookings } from "../../src/Drizzle/schema";
import jwt from "jsonwebtoken";

// JWT utility
function generateToken(userId: number, role: string) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "testsecret", {
    expiresIn: "1h",
  });
}

describe("Bookings API Integration", () => {
  let token: string;
  let adminToken: string;
  let userId: number;
  let eventId: number;
  let bookingId: number;

  beforeAll(async () => {
    await db.delete(bookings);
    await db.delete(events);
    await db.delete(venues);
    await db.delete(users);

    const [user] = await db.insert(users).values({
      first_name: "Test",
      last_name: "User",
      email: "testuser@example.com",
      password: "password",
      contact_phone: "0700000000",
      address: "Nairobi",
      role: "user",
    }).returning();

    const [admin] = await db.insert(users).values({
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: "password",
      contact_phone: "0700000001",
      address: "Adminville",
      role: "admin",
    }).returning();

    const [venue] = await db.insert(venues).values({
      name: "Test Venue",
      address: "Test Street",
      capacity: 100,
    }).returning();

    const [event] = await db.insert(events).values({
      title: "Test Event",
      description: "Test Description",
      venue_id: venue.venue_id,
      category: "Music",
      date: "2025-08-01",
      time: "18:00",
      ticket_price: "50.00",
      tickets_total: 100,
    }).returning();

    userId = user.user_id;
    eventId = event.event_id;
    token = generateToken(user.user_id, "user");
    adminToken = generateToken(admin.user_id, "admin");
  });

afterAll(async () => {
  server.close();             
  await db.$client.end();     
});


  it("POST /bookings → should create a booking", async () => {
    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        event_id: eventId,
        quantity: 2,
        total_amount: "100.00",
        booking_status: "Confirmed",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("booking_id");
    expect(res.body.user_id).toBe(userId);
    bookingId = res.body.booking_id;
  });

  it("GET /bookings → user should get only their bookings", async () => {
    const res = await request(app)
      .get("/bookings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user_id).toBe(userId);
  });

  it("GET /bookings → admin should see all bookings", async () => {
    const res = await request(app)
      .get("/bookings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("DELETE /bookings/:id → user can delete own booking", async () => {
    const res = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Booking deleted successfully/);
  });

  it("DELETE /bookings/:id → should return 403 if not owner or admin", async () => {
    const res = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});
