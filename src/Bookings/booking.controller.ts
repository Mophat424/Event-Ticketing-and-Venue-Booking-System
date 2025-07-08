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
