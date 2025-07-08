import express from "express";
import {
  createPayment,
  getPayments,
} from "./payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createPayment); // Create payment (user)
router.get("/", authenticate, getPayments); // Admin sees all, user sees own

export default router;
