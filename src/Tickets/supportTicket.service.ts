// import db from "../Drizzle/db";
// import { supportTickets } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// // Get all tickets
// export const getAllTickets = () => db.select().from(supportTickets);

// // Get one ticket
// export const getTicketById = (id: number) =>
//   db.select().from(supportTickets).where(eq(supportTickets.ticket_id, id)).then(([t]) => t);

// // Create ticket
// export const createTicket = (data: typeof supportTickets.$inferInsert) =>
//   db.insert(supportTickets).values(data).returning().then(([t]) => t);

// // Update ticket
// export const updateTicket = (id: number, data: Partial<typeof supportTickets.$inferInsert>) =>
//   db.update(supportTickets).set(data).where(eq(supportTickets.ticket_id, id)).returning().then(([t]) => t);

// // Delete ticket
// export const deleteTicket = (id: number) =>
//   db.delete(supportTickets).where(eq(supportTickets.ticket_id, id));



//AUTH
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
