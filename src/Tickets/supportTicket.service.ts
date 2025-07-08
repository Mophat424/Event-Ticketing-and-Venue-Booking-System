// import db from "../Drizzle/db";
// import { supportTickets } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// // Create ticket
// export const createTicket = (data: typeof supportTickets.$inferInsert) =>
//   db.insert(supportTickets).values(data).returning().then(([t]) => t);

// // Get all tickets (Admin)
// export const getAllTickets = () => db.select().from(supportTickets);

// // Get tickets for specific user
// export const getTicketsByUser = (userId: number) =>
//   db.select().from(supportTickets).where(eq(supportTickets.user_id, userId));

// // Delete ticket (Admin or Owner)
// export const deleteTicket = async (
//   ticketId: number,
//   userId: number,
//   isAdmin: boolean
// ): Promise<boolean> => {
//   if (isAdmin) {
//     await db.delete(supportTickets).where(eq(supportTickets.ticket_id, ticketId));
//     return true;
//   }

//   const ticket = await db
//     .select()
//     .from(supportTickets)
//     .where(eq(supportTickets.ticket_id, ticketId))
//     .then(([t]) => t);

//   if (!ticket || ticket.user_id !== userId) return false;

//   await db.delete(supportTickets).where(eq(supportTickets.ticket_id, ticketId));
//   return true;
// };


import db from "../Drizzle/db";
import { supportTickets } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

// Create ticket
export const createTicket = (data: typeof supportTickets.$inferInsert) =>
  db.insert(supportTickets).values(data).returning().then(([t]) => t);

// Get all tickets (Admin)
export const getAllTickets = () => db.select().from(supportTickets);

// Get tickets for specific user
export const getTicketsByUser = (userId: number) =>
  db.select().from(supportTickets).where(eq(supportTickets.user_id, userId));

// Delete ticket (Admin or Owner)
export const deleteTicket = async (
  ticketId: number,
  userId: number,
  isAdmin: boolean
): Promise<boolean> => {
  if (isAdmin) {
    await db.delete(supportTickets).where(eq(supportTickets.ticket_id, ticketId));
    return true;
  }

  const ticket = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.ticket_id, ticketId))
    .then(([t]) => t);

  if (!ticket || ticket.user_id !== userId) return false;

  await db.delete(supportTickets).where(eq(supportTickets.ticket_id, ticketId));
  return true;
};

