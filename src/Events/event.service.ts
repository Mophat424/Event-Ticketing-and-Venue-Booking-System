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
