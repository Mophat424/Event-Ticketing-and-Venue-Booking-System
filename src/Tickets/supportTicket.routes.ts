// import express from "express";
// import {
//   getAllTickets,
//   getTicketById,
//   createTicket,
//   updateTicket,
//   deleteTicket,
// } from "./supportTicket.controller";

// const router = express.Router();

// router.get("/", getAllTickets);
// router.get("/:id", getTicketById);
// router.post("/", createTicket);
// router.put("/:id", updateTicket);
// router.delete("/:id", deleteTicket);

// export default router;



//AUTH
import express from "express";
import {
  createTicket,
  getTickets,
  deleteTicket,
} from "./supportTicket.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Submit support ticket
router.post("/", authenticate, createTicket);

// Get tickets (admin = all, user = own)
router.get("/", authenticate, getTickets);

// Delete ticket
router.delete("/:id", authenticate, deleteTicket);

export default router;
