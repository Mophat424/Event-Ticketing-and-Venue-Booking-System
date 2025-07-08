import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "./event.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Public access – anyone can view events
router.get("/", getEvents);

// Admin routes – must be authenticated
router.post("/", authenticate, createEvent);
router.put("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

export default router;
