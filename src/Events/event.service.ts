// import db from "../Drizzle/db";
// import { events } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// // Get all events
// export const getAllEvents = () => db.select().from(events);

// // Get event by ID
// export const getEventById = (id: number) =>
//   db.select().from(events).where(eq(events.event_id, id)).then(([e]) => e);

// // Create a new event
// export const createEvent = (data: typeof events.$inferInsert) =>
//   db.insert(events).values(data).returning().then(([e]) => e);

// // Update event
// export const updateEvent = (id: number, data: Partial<typeof events.$inferInsert>) =>
//   db.update(events).set(data).where(eq(events.event_id, id)).returning().then(([e]) => e);

// // Delete event
// export const deleteEvent = (id: number) =>
//   db.delete(events).where(eq(events.event_id, id));



//Auth
import db from "../Drizzle/db";
import { events } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

// Create event
export const createEvent = (data: typeof events.$inferInsert) =>
  db.insert(events).values(data).returning().then(([e]) => e);

// Get all events
export const getAllEvents = () => db.select().from(events);

// Update event
export const updateEvent = async (eventId: number, data: Partial<typeof events.$inferInsert>) => {
  const [updated] = await db.update(events).set(data).where(eq(events.event_id, eventId)).returning();
  return updated;
};


// Delete event
export const deleteEvent = async (eventId: number) => {
  const deleted = await db.delete(events).where(eq(events.event_id, eventId));
  return (deleted?.rowCount ?? 0) > 0;
};
