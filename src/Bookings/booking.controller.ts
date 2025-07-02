// import { Request, Response } from "express";
// import db from "../Drizzle/db";
// import { bookings } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// // GET /bookings
// export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const allBookings = await db.select().from(bookings);
//     res.status(200).json(allBookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // GET /bookings/:id
// export const getBookingById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);
//     const booking = await db.select().from(bookings).where(eq(bookings.booking_id, id));

//     if (!booking.length) {
//       res.status(404).json({ message: "Booking not found" });
//       return;
//     }

//     res.status(200).json(booking[0]);
//   } catch (error) {
//     console.error("Error fetching booking:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // POST /bookings
// export const createBooking = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const newBooking = req.body;
//     const inserted = await db.insert(bookings).values(newBooking).returning();
//     res.status(201).json(inserted[0]);
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // PUT /bookings/:id
// export const updateBooking = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);
//     const updates = req.body;

//     const updated = await db.update(bookings)
//       .set(updates)
//       .where(eq(bookings.booking_id, id))
//       .returning();

//     if (!updated.length) {
//       res.status(404).json({ message: "Booking not found" });
//       return;
//     }

//     res.status(200).json(updated[0]);
//   } catch (error) {
//     console.error("Error updating booking:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // DELETE /bookings/:id
// export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);

//     const deleted = await db.delete(bookings)
//       .where(eq(bookings.booking_id, id))
//       .returning();

//     if (!deleted.length) {
//       res.status(404).json({ message: "Booking not found" });
//       return;
//     }

//     res.status(200).json({ message: "Booking deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting booking:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };





//Auth
import { Request, Response } from "express";
import * as bookingService from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id?: number; role?: string };
}

// Create booking - User only
export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const data = { ...req.body, user_id: userId };

    const newBooking = await bookingService.createBooking(data);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Booking creation failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get bookings - Admin sees all, user sees own
export const getBookings = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role === "admin") {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
    } else {
      const userId = req.user?.id;
      const bookings = await bookingService.getBookingsByUser(userId!);
      res.json(bookings);
    }
  } catch (error) {
    console.error("Failed to get bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Delete booking - Admin or owner
export const deleteBooking = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const bookingId = parseInt(req.params.id);
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const deleted = await bookingService.deleteBooking(bookingId, userId!, isAdmin);

    if (!deleted) {
      res.status(403).json({ message: "Not authorized to delete this booking" });
    } else {
      res.json({ message: "Booking deleted successfully" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
