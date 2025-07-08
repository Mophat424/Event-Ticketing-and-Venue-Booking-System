import { Request, Response } from "express";
import * as eventService from "./event.service";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id?: number; role?: string };
}

// Create Event – Admin only
export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can create events" });
      return;
    }

    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Event creation failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Events – Public
export const getEvents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error("Fetching events failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Event – Admin only
export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can update events" });
      return;
    }

    const updated = await eventService.updateEvent(parseInt(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.json(updated);
    }
  } catch (error) {
    console.error("Event update failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Event – Admin only
export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can delete events" });
      return;
    }

    const deleted = await eventService.deleteEvent(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.json({ message: "Event deleted successfully" });
    }
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
