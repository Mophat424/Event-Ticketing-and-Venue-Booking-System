// import express from "express";
// import {
//   getAllPayments,
//   getPaymentById,
//   createPayment,
//   updatePayment,
//   deletePayment,
// } from "./payment.controller";

// const router = express.Router();

// router.get("/", getAllPayments);
// router.get("/:id", getPaymentById);
// router.post("/", createPayment);
// router.put("/:id", updatePayment);
// router.delete("/:id", deletePayment);

// export default router;



//Auth
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
