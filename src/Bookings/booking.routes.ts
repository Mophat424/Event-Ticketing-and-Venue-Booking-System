// import express from "express";
// import {
//   getAllBookings,
//   getBookingById,
//   createBooking,
//   updateBooking,
//   deleteBooking,
// } from "./booking.controller";

// const router = express.Router();

// router.get("/", getAllBookings);
// router.get("/:id", getBookingById);
// router.post("/", createBooking);
// router.put("/:id", updateBooking);
// router.delete("/:id", deleteBooking);

// export default router;



//Auth
import express from "express";
import {
  createBooking,
  getBookings,
  deleteBooking,
} from "./booking.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";

const router = express.Router();

// Create booking — any authenticated user
router.post("/", authenticate, createBooking);

// Get bookings — admin sees all, user sees only own
router.get("/", authenticate, getBookings);

// Delete booking — authenticated (we'll check owner/admin in controller)
router.delete("/:id", authenticate, deleteBooking);

export default router;
