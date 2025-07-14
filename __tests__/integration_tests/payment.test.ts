import request from "supertest";
 import { app, server } from "../../src/index";
import db from "../../src/Drizzle/db";
import { payments, users, venues, events, bookings } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let userToken: string;
let adminToken: string;
let testBookingId: number;
let testUserId: number;

beforeAll(async () => {
  await db.delete(payments);
  await db.delete(bookings);
  await db.delete(events);
  await db.delete(venues);
  await db.delete(users);

  // Create user and admin
  const [user] = await db.insert(users).values({
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    password: "hashedpassword",
    contact_phone: "123456789",
    address: "123 Street",
    role: "user",
  }).returning();

  const [admin] = await db.insert(users).values({
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
    password: "hashedpassword",
    contact_phone: "987654321",
    address: "Admin Street",
    role: "admin",
  }).returning();

  testUserId = user.user_id;

  userToken = jwt.sign(
    { id: user.user_id, email: user.email, role: "user" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  adminToken = jwt.sign(
    { id: admin.user_id, email: admin.email, role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  const [venue] = await db.insert(venues).values({
    name: "Test Venue",
    address: "Somewhere",
    capacity: 100,
  }).returning();

  const [event] = await db.insert(events).values({
    title: "Test Event",
    description: "Exciting event",
    venue_id: venue.venue_id,
    category: "Concert",
    date: "2025-12-12",
    time: "18:00",
    ticket_price: "100.00",
    tickets_total: 500,
  }).returning();

  const [booking] = await db.insert(bookings).values({
    user_id: user.user_id,
    event_id: event.event_id,
    quantity: 2,
    total_amount: "200.00",
    booking_status: "Confirmed",
  }).returning();

  testBookingId = booking.booking_id;
});

describe("Payment Routes", () => {
  it("should allow user to create a payment", async () => {
    const res = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        booking_id: testBookingId,
        amount: "200.00",
        payment_method: "Mpesa",
        transaction_id: "TX123456",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("payment_id");
  });

  it("should allow admin to view all payments", async () => {
    const res = await request(app)
      .get("/payments")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should allow user to view own payments", async () => {
    const res = await request(app)
      .get("/payments")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should block payment creation with invalid booking_id", async () => {
    const res = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        booking_id: 999999,
        amount: "200.00",
        payment_method: "Mpesa",
        transaction_id: "INVALIDBOOKING123",
      });

    expect(res.status).toBe(500); // or 403/400 depending on how your error is handled
    expect(res.body).toHaveProperty("message");
  });

  it("should block payment creation without authentication", async () => {
    const res = await request(app)
      .post("/payments")
      .send({
        booking_id: testBookingId,
        amount: "200.00",
        payment_method: "Card",
        transaction_id: "TX_NOAUTH",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should block non-admin user from viewing all payments", async () => {
    const res = await request(app)
      .get("/payments")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200); // allowed, but only returns own
    res.body.forEach((row: any) => {
      expect(row.payments.user_id || row.user_id).toBe(testUserId);
    });
  });

  it("should prevent duplicate payment for the same booking", async () => {
    const res = await request(app)
      .post("/payments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        booking_id: testBookingId,
        amount: "200.00",
        payment_method: "Mpesa",
        transaction_id: "DUPLICATETX",
      });

    // Since booking_id is unique in payments table, this should error
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });
});

afterAll(async () => {
  await db.delete(payments);
  await db.delete(bookings);
  await db.delete(events);
  await db.delete(venues);
  await db.delete(users);

  if ("end" in db.$client) await db.$client.end();
});

