// import { Request, Response } from "express";
// import * as VenueService from "./venue.service";

// export const getAllVenues = async (req: Request, res: Response) => {
//   try {
//     const all = await VenueService.getAllVenues();
//     res.status(200).json(all);
//   } catch (error) {
//     console.error("Error fetching venues:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const getVenueById = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const venue = await VenueService.getVenueById(id);

//     if (!venue) {
//       res.status(404).json({ message: "Venue not found" });
//       return;
//     }

//     res.status(200).json(venue);
//   } catch (error) {
//     console.error("Error fetching venue:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const createVenue = async (req: Request, res: Response) => {
//   try {
//     const newVenue = await VenueService.createVenue(req.body);
//     res.status(201).json(newVenue);
//   } catch (error) {
//     console.error("Error creating venue:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updateVenue = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const updated = await VenueService.updateVenue(id, req.body);

//     if (!updated) {
//       res.status(404).json({ message: "Venue not found" });
//       return;
//     }

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Error updating venue:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const deleteVenue = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     await VenueService.deleteVenue(id);
//     res.status(204).send();
//   } catch (error) {
//     console.error("Error deleting venue:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };





//AUTH
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
