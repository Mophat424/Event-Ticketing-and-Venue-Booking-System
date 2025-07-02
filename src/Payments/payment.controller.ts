// import { Request, Response } from "express";
// import * as PaymentService from "./payment.service";

// export const getAllPayments = async (req: Request, res: Response) => {
//   try {
//     const all = await PaymentService.getAllPayments();
//     res.status(200).json(all);
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const getPaymentById = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const payment = await PaymentService.getPaymentById(id);

//     if (!payment) {
//       res.status(404).json({ message: "Payment not found" });
//       return;
//     }

//     res.status(200).json(payment);
//   } catch (error) {
//     console.error("Error fetching payment:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const createPayment = async (req: Request, res: Response) => {
//   try {
//     const newPayment = await PaymentService.createPayment(req.body);
//     res.status(201).json(newPayment);
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updatePayment = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     const updated = await PaymentService.updatePayment(id, req.body);

//     if (!updated) {
//       res.status(404).json({ message: "Payment not found" });
//       return;
//     }

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Error updating payment:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const deletePayment = async (req: Request, res: Response) => {
//   try {
//     const id = parseInt(req.params.id);
//     await PaymentService.deletePayment(id);
//     res.status(204).send();
//   } catch (error) {
//     console.error("Error deleting payment:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




//Auth
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
