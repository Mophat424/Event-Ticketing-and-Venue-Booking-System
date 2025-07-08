// import request from "supertest";
// import { app, server } from "../../src/index";
// import db from "../../src/Drizzle/db";
// import { users } from "../../src/Drizzle/schema";
// import bcrypt from "bcryptjs";
// import { eq } from "drizzle-orm";
// import jwt from "jsonwebtoken";

// let adminToken: string;
// let userToken: string;
// let eventId: number;
// const existingVenueId = 12; 

// beforeAll(async () => {
//   // Cleanup
//   await db.delete(users);

//   // Create admin and user
//   const passwordHash = await bcrypt.hash("adminpass", 10);
//   const [admin] = await db.insert(users).values({
//     first_name: "Admin",
//     last_name: "User",
//     email: "admin@example.com",
//     password: passwordHash,
//     contact_phone: "0711111111",
//     address: "Admin Street",
//     role: "admin",
//   }).returning();

//   const [user] = await db.insert(users).values({
//     first_name: "Regular",
//     last_name: "User",
//     email: "user@example.com",
//     password: await bcrypt.hash("userpass", 10),
//     contact_phone: "0722222222",
//     address: "User Town",
//     role: "user",
//   }).returning();

//   // Generate JWTs
//   adminToken = jwt.sign({ id: admin.user_id, role: admin.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
//   userToken = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
// });

// describe("Events API Integration", () => {
//   it("POST /events → should allow admin to create event", async () => {
//     const res = await request(app)
//       .post("/events")
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({
//         title: "Integration Test Event",
//         description: "Event for testing",
//         venue_id: existingVenueId,
//         category: "Testing",
//         date: "2025-09-01",
//         time: "20:00",
//         ticket_price: "20.00",
//         tickets_total: 50,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty("event_id");
//     eventId = res.body.event_id;
//   });

//   it("POST /events → should forbid non-admin from creating event", async () => {
//     const res = await request(app)
//       .post("/events")
//       .set("Authorization", `Bearer ${userToken}`)
//       .send({
//         title: "Unauthorized Event",
//         description: "Should fail",
//         venue_id: existingVenueId,
//         category: "Testing",
//         date: "2025-09-01",
//         time: "20:00",
//         ticket_price: "20.00",
//         tickets_total: 50,
//       });

//     expect(res.status).toBe(403);
//   });

//   it("GET /events → should retrieve all events", async () => {
//     const res = await request(app).get("/events");

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBeGreaterThan(0);
//   });

//   it("PUT /events/:id → should allow admin to update event", async () => {
//     const res = await request(app)
//       .put(`/events/${eventId}`)
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({ title: "Updated Test Event" });

//     expect(res.status).toBe(200);
//     expect(res.body.title).toBe("Updated Test Event");
//   });

//   it("DELETE /events/:id → should allow admin to delete event", async () => {
//     const res = await request(app)
//       .delete(`/events/${eventId}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toMatch(/Event deleted successfully/);
//   });

//   it("DELETE /events/:id → should return 404 if event already deleted", async () => {
//     const res = await request(app)
//       .delete(`/events/${eventId}`)
//       .set("Authorization", `Bearer ${adminToken}`);

//     expect(res.status).toBe(404);
//   });
// });

// afterAll(async () => {
//   await db.$client.end(); 
//   await server.close();   
// });


import request from "supertest";
import { app, server } from "../../src/index";
import db from "../../src/Drizzle/db";
import { users, venues } from "../../src/Drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

let adminToken: string;
let userToken: string;
let eventId: number;
let venueId: number;

beforeAll(async () => {
  // Cleanup users and venues
  await db.delete(users);
  await db.delete(venues);

  // Insert a venue and get its ID
  const [venue] = await db.insert(venues).values({
    name: "Test Venue",
    address: "Test Location", 
    capacity: 100,
  }).returning();

  venueId = venue.venue_id;

  // Create admin and user
  const passwordHash = await bcrypt.hash("adminpass", 10);
  const [admin] = await db.insert(users).values({
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
    password: passwordHash,
    contact_phone: "0711111111",
    address: "Admin Street",
    role: "admin",
  }).returning();

  const [user] = await db.insert(users).values({
    first_name: "Regular",
    last_name: "User",
    email: "user@example.com",
    password: await bcrypt.hash("userpass", 10),
    contact_phone: "0722222222",
    address: "User Town",
    role: "user",
  }).returning();

  // Generate JWTs
  adminToken = jwt.sign({ id: admin.user_id, role: admin.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  userToken = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
});

describe("Events API Integration", () => {
  it("POST /events → should allow admin to create event", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Integration Test Event",
        description: "Event for testing",
        venue_id: venueId,
        category: "Testing",
        date: "2025-09-01",
        time: "20:00",
        ticket_price: "20.00",
        tickets_total: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("event_id");
    eventId = res.body.event_id;
  });

  it("POST /events → should forbid non-admin from creating event", async () => {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Unauthorized Event",
        description: "Should fail",
        venue_id: venueId,
        category: "Testing",
        date: "2025-09-01",
        time: "20:00",
        ticket_price: "20.00",
        tickets_total: 50,
      });

    expect(res.status).toBe(403);
  });

  it("GET /events → should retrieve all events", async () => {
    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("PUT /events/:id → should allow admin to update event", async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Test Event" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Test Event");
  });

  it("DELETE /events/:id → should allow admin to delete event", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Event deleted successfully/);
  });

  it("DELETE /events/:id → should return 404 if event already deleted", async () => {
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

afterAll(async () => {
  await db.$client.end();
  await server.close();
});
