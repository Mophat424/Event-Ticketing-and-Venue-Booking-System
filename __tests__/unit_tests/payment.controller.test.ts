import { Request, Response } from "express";
import * as paymentController from "../../src/Payments/payment.controller";
import * as paymentService from "../../src/Payments/payment.service";

jest.mock("../../src/Payments/payment.service");

describe("Payment Controller", () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPayment", () => {
    it("should create a payment for authenticated user", async () => {
      const req = {
        body: {
          booking_id: 1,
          amount: "100.00",
          payment_status: "Paid",
          payment_date: new Date(),
          payment_method: "Mpesa",
          transaction_id: "TX123",
        },
        user: { id: 2, role: "user" },
      } as any;

      const res = mockResponse();

      const mockPayment = {
        ...req.body,
        payment_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (paymentService.createPayment as jest.Mock).mockResolvedValue(mockPayment);

      await paymentController.createPayment(req, res);

      expect(paymentService.createPayment).toHaveBeenCalledWith(req.body, 2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPayment);
    });

    it("should handle errors during createPayment", async () => {
      const req = { body: {}, user: { id: 2, role: "user" } } as any;
      const res = mockResponse();

      (paymentService.createPayment as jest.Mock).mockRejectedValue(new Error("DB error"));

      await paymentController.createPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("getPayments", () => {
    it("should return all payments for admin", async () => {
      const req = { user: { id: 1, role: "admin" } } as any;
      const res = mockResponse();

      const mockPayments = [
        {
          payment_id: 1,
          booking_id: 123,
          amount: "100.00",
          payment_status: "Paid",
          payment_date: new Date(),
          payment_method: "Mpesa",
          transaction_id: "ABC123",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (paymentService.getAllPayments as jest.Mock).mockResolvedValue(mockPayments);

      await paymentController.getPayments(req, res);

      expect(paymentService.getAllPayments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPayments);
    });

    it("should return user's payments for normal user", async () => {
      const req = { user: { id: 2, role: "user" } } as any;
      const res = mockResponse();

      const mockUserPayments = [
        {
          payments: {
            payment_id: 1,
            booking_id: 123,
            amount: "100.00",
            payment_status: "Paid",
            payment_date: new Date(),
            payment_method: "Mpesa",
            transaction_id: "XYZ789",
            created_at: new Date(),
            updated_at: new Date(),
          },
          bookings: {
            booking_id: 123,
            user_id: 2,
          },
        },
      ];

      (paymentService.getPaymentsByUser as jest.Mock).mockResolvedValue(mockUserPayments);

      await paymentController.getPayments(req, res);

      expect(paymentService.getPaymentsByUser).toHaveBeenCalledWith(2);
      expect(res.json).toHaveBeenCalledWith(mockUserPayments);
    });

    it("should handle errors in getPayments", async () => {
      const req = { user: { id: 1, role: "admin" } } as any;
      const res = mockResponse();

      (paymentService.getAllPayments as jest.Mock).mockRejectedValue(new Error("DB error"));

      await paymentController.getPayments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
