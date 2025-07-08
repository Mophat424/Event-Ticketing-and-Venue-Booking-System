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
