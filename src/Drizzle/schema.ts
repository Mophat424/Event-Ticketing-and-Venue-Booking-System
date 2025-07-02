import { pgTable, serial, varchar, timestamp, integer, pgEnum, text, decimal, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ENUMs
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const bookingStatusEnum = pgEnum("booking_status", ["Pending", "Confirmed", "Cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["Pending", "Paid", "Failed"]);

// Users Table
export const users = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }),
  last_name: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  contact_phone: varchar("contact_phone", { length: 20 }),
  address: text("address"),
  role: roleEnum("role").default("user"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Venues Table
export const venues = pgTable("venues", {
  venue_id: serial("venue_id").primaryKey(),
  name: varchar("name", { length: 255 }),
  address: text("address"),
  capacity: integer("capacity"),
  created_at: timestamp("created_at").defaultNow(),
});

// Events Table
export const events = pgTable("events", {
  event_id: serial("event_id").primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  venue_id: integer("venue_id").references(() => venues.venue_id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }),
  date: varchar("date", { length: 100 }), 
  time: varchar("time", { length: 100 }),
  ticket_price: decimal("ticket_price", { precision: 10, scale: 2 }),
  tickets_total: integer("tickets_total"),
  tickets_sold: integer("tickets_sold").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Bookings Table
export const bookings = pgTable("bookings", {
  booking_id: serial("booking_id").primaryKey(),
  user_id: integer("user_id").references(() => users.user_id, { onDelete: "cascade" }),
  event_id: integer("event_id").references(() => events.event_id, { onDelete: "cascade" }),
  quantity: integer("quantity"),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }),
  booking_status: bookingStatusEnum("booking_status").default("Pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const payments = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  booking_id: integer("booking_id").references(() => bookings.booking_id, { onDelete: "cascade" }).unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  payment_status: paymentStatusEnum("payment_status").default("Pending"),
  payment_date: timestamp("payment_date").defaultNow(),
  payment_method: varchar("payment_method", { length: 50 }),
  transaction_id: varchar("transaction_id", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").references(() => users.user_id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("Open"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});



// RELATIONSHIPS

// Users → Bookings, SupportTickets
export const userRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  supportTickets: many(supportTickets),
}));

// Venues → Events
export const venueRelations = relations(venues, ({ many }) => ({
  events: many(events),
}));

// Events → Venue (one), Bookings (many)
export const eventRelations = relations(events, ({ one, many }) => ({
  venue: one(venues, {
    fields: [events.venue_id],
    references: [venues.venue_id],
  }),
  bookings: many(bookings),
}));

// Bookings → User (one), Event (one), Payment (one)
export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.user_id],
    references: [users.user_id],
  }),
  event: one(events, {
    fields: [bookings.event_id],
    references: [events.event_id],
  }),
  payment: one(payments, {
    fields: [bookings.booking_id],
    references: [payments.booking_id],
  }),
}));

// Payments → Booking (one)
export const paymentRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.booking_id],
    references: [bookings.booking_id],
  }),
}));

// SupportTickets → User (one)
export const supportTicketRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.user_id],
    references: [users.user_id],
  }),
}));
