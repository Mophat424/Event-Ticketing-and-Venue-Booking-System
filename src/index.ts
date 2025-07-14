import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./Users/user.routes";
import eventRoutes from "./Events/event.routes";
import bookingRoutes from "./Bookings/booking.routes";
import paymentRoutes from "./Payments/payment.routes";
import venueRoutes from "./Venues/venue.routes";
import supportTicketRoutes from "./Tickets/supportTicket.routes";
import authRoutes from "./Auth/auth.routes";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/events", eventRoutes);
app.use("/payments", paymentRoutes);
app.use("/venues", venueRoutes);
app.use("/tickets", supportTicketRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8081;

const server = app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});

//  Export both for testability
export { app, server };
