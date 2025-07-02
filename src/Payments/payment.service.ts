// import db from "../Drizzle/db";
// import { payments } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// // Get all payments
// export const getAllPayments = () => db.select().from(payments);

// // Get a single payment by ID
// export const getPaymentById = (id: number) =>
//   db.select().from(payments).where(eq(payments.payment_id, id)).then(([p]) => p);

// // Create a payment
// export const createPayment = (data: typeof payments.$inferInsert) =>
//   db.insert(payments).values(data).returning().then(([p]) => p);

// // Update a payment
// export const updatePayment = (id: number, data: Partial<typeof payments.$inferInsert>) =>
//   db.update(payments).set(data).where(eq(payments.payment_id, id)).returning().then(([p]) => p);

// // Delete a payment
// export const deletePayment = (id: number) =>
//   db.delete(payments).where(eq(payments.payment_id, id));



//Auth
import db from "../Drizzle/db";
import { payments, bookings } from "../Drizzle/schema";
import { eq, and } from "drizzle-orm";

export const createPayment = async (
  data: typeof payments.$inferInsert,
  userId: number
) => {
  if (!userId || !data.booking_id) {
    throw new Error("Missing user ID or booking ID");
  }

  const [booking] = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.booking_id, data.booking_id),
        eq(bookings.user_id, userId)
      )
    );

  if (!booking) throw new Error("Unauthorized or booking not found");

  const [newPayment] = await db.insert(payments).values(data).returning();
  return newPayment;
};


// Admin: all payments
export const getAllPayments = () => db.select().from(payments);

// User: payments for their bookings
export const getPaymentsByUser = async (userId: number) => {
  return db
    .select()
    .from(payments)
    .innerJoin(bookings, eq(payments.booking_id, bookings.booking_id))
    .where(eq(bookings.user_id, userId));
};
