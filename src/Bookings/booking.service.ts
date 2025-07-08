import db from "../Drizzle/db";
import { bookings } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const createBooking = (data: typeof bookings.$inferInsert) =>
  db.insert(bookings).values(data).returning().then(([b]) => b);

// Admin: all bookings
export const getAllBookings = () => db.select().from(bookings);

// User: own bookings
export const getBookingsByUser = (userId: number) =>
  db.select().from(bookings).where(eq(bookings.user_id, userId));

// Delete logic
export const deleteBooking = async (
  bookingId: number,
  userId: number,
  isAdmin: boolean
) => {
  if (isAdmin) {
    await db.delete(bookings).where(eq(bookings.booking_id, bookingId));
    return true;
  }

  // Check if booking belongs to user
  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.booking_id, bookingId))
    .then(([b]) => b);

  if (!booking || booking.user_id !== userId) {
    return false;
  }

  await db.delete(bookings).where(eq(bookings.booking_id, bookingId));
  return true;
};
