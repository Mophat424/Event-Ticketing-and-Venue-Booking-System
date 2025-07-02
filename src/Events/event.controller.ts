// import { Request, Response } from "express";
// import * as EventService from "./event.service";

// export const getAllEvents = async (req: Request, res: Response) => {
//   try {
//     const all = await EventService.getAllEvents();
//     res.status(200).json(all);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const getEventById = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const event = await EventService.getEventById(id);

//     if (!event) {
//       res.status(404).json({ message: "Event not found" });
//       return;
//     }

//     res.status(200).json(event);
//   } catch (error) {
//     console.error("Error fetching event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const createEvent = async (req: Request, res: Response) => {
//   try {
//     const newEvent = await EventService.createEvent(req.body);
//     res.status(201).json(newEvent);
//   } catch (error) {
//     console.error("Error creating event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updateEvent = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const updated = await EventService.updateEvent(id, req.body);

//     if (!updated) {
//       res.status(404).json({ message: "Event not found" });
//       return;
//     }

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Error updating event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const deleteEvent = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     await EventService.deleteEvent(id);
//     res.status(204).send();
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



//Auth
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
