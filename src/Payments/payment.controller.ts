import { Request, Response } from "express";
import * as paymentService from "./payment.service";
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id?: number; role?: string };
}

// Create Payment (user)
export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const payment = await paymentService.createPayment(req.body, userId!);
    res.status(201).json(payment);
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Payments (admin sees all, user sees own)
export const getPayments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role === "admin") {
      const payments = await paymentService.getAllPayments();
      res.json(payments);
    } else {
      const userId = req.user?.id;
      const payments = await paymentService.getPaymentsByUser(userId!);
      res.json(payments);
    }
  } catch (error) {
    console.error("Failed to get payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
