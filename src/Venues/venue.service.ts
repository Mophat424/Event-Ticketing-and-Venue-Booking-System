import db from "../Drizzle/db";
import { venues } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

// Get all venues
export const getAllVenues = () => db.select().from(venues);

// Create venue
export const createVenue = (data: typeof venues.$inferInsert) =>
  db.insert(venues).values(data).returning().then(([v]) => v);

// Update venue
export const updateVenue = async (venueId: number, data: Partial<typeof venues.$inferInsert>) => {
  const result = await db.update(venues).set(data).where(eq(venues.venue_id, venueId));
  return result.rowCount && result.rowCount > 0;
};

// Delete venue
export const deleteVenue = async (venueId: number) => {
  const result = await db.delete(venues).where(eq(venues.venue_id, venueId));
  return result.rowCount && result.rowCount > 0;
};
