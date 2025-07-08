import { Request, Response } from "express";
import * as venueService from "./venue.service";
import { JwtPayload } from "jsonwebtoken";

// Custom type to include user info in request
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id?: number; role?: string };
}

// Create Venue – Admin only
export const createVenue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can create venues" });
      return;
    }

    const newVenue = await venueService.createVenue(req.body);
    res.status(201).json(newVenue);
  } catch (error) {
    console.error("Create venue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Venues – Public
export const getVenues = async (req: Request, res: Response): Promise<void> => {
  try {
    const venues = await venueService.getAllVenues();
    res.json(venues);
  } catch (error) {
    console.error("Fetch venues error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Venue – Admin only
export const updateVenue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can update venues" });
      return;
    }

    const venueId = parseInt(req.params.id);
    const updatedVenue = await venueService.updateVenue(venueId, req.body);

    if (!updatedVenue) {
      res.status(404).json({ message: "Venue not found" });
      return;
    }

    res.json(updatedVenue);
  } catch (error) {
    console.error("Update venue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Venue – Admin only
export const deleteVenue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can delete venues" });
      return;
    }

    const venueId = parseInt(req.params.id);
    const deleted = await venueService.deleteVenue(venueId);

    if (!deleted) {
      res.status(404).json({ message: "Venue not found or already deleted" });
      return;
    }

    res.json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("Delete venue error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
