// import { Request, Response } from "express";
// import * as ticketService from "./supportTicket.service";
// import { JwtPayload } from "jsonwebtoken";

// interface AuthenticatedRequest extends Request {
//   user?: JwtPayload & { id?: number; role?: string };
// }

// // Create support ticket
// export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id;
//     const data = { ...req.body, user_id: userId };
//     const newTicket = await ticketService.createTicket(data);
//     res.status(201).json(newTicket);
//   } catch (error) {
//     console.error("Ticket creation failed:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get tickets - Admin sees all, User sees only their own
// export const getTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     if (req.user?.role === "admin") {
//       const tickets = await ticketService.getAllTickets();
//       res.json(tickets);
//     } else {
//       const userId = req.user?.id;
//       const tickets = await ticketService.getTicketsByUser(userId!);
//       res.json(tickets);
//     }
//   } catch (error) {
//     console.error("Get tickets failed:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Delete ticket - Admin can delete any, user only their own
// export const deleteTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const ticketId = parseInt(req.params.id);
//     const userId = req.user?.id;
//     const isAdmin = req.user?.role === "admin";

//     const deleted = await ticketService.deleteTicket(ticketId, userId!, isAdmin);

//     if (!deleted) {
//       res.status(403).json({ message: "Not authorized to delete this ticket" });
//     } else {
//       res.json({ message: "Ticket deleted successfully" });
//     }
//   } catch (error) {
//     console.error("Delete ticket failed:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


import { Request, Response } from "express";
import * as ticketService from "./supportTicket.service";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id?: number; role?: string };
}

// Create support ticket
export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const data = { ...req.body, user_id: userId };
    const newTicket = await ticketService.createTicket(data);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error("Ticket creation failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get tickets - Admin sees all, User sees only their own
export const getTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role === "admin") {
      const tickets = await ticketService.getAllTickets();
      res.json(tickets);
    } else {
      const userId = req.user?.id;
      const tickets = await ticketService.getTicketsByUser(userId!);
      res.json(tickets);
    }
  } catch (error) {
    console.error("Get tickets failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete ticket - Admin can delete any, user only their own
export const deleteTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const ticketId = parseInt(req.params.id);
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const deleted = await ticketService.deleteTicket(ticketId, userId!, isAdmin);

    if (!deleted) {
      res.status(403).json({ message: "Not authorized to delete this ticket" });
    } else {
      res.json({ message: "Ticket deleted successfully" });
    }
  } catch (error) {
    console.error("Delete ticket failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
