import * as paymentService from "../../src/Payments/payment.service";
import db from "../../src/Drizzle/db";
import { payments, bookings } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

// Mock DB methods
jest.mock("../../src/Drizzle/db", () => ({
  select: jest.fn(),
  insert: jest.fn(),
}));

const mockedDb = db as jest.Mocked<typeof db>;

describe("Payment Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPayment", () => {
    const userId = 1;

    it("should throw error if userId or booking_id is missing", async () => {
      await expect(
        paymentService.createPayment({} as any, null as unknown as number)
      ).rejects.toThrow("Missing user ID or booking ID");

      await expect(
        paymentService.createPayment({ booking_id: null } as any, 1)
      ).rejects.toThrow("Missing user ID or booking ID");
    });

    it("should throw error if booking is not found or unauthorized", async () => {
      (mockedDb.select as jest.Mock).mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([]), // no booking found
        }),
      });

      await expect(
        paymentService.createPayment({ booking_id: 2 } as any, userId)
      ).rejects.toThrow("Unauthorized or booking not found");
    });

    it("should insert and return a new payment", async () => {
      const paymentData = {
        booking_id: 2,
        amount: "100.00",
        payment_status: "Paid",
        payment_date: new Date(),
        payment_method: "Mpesa",
        transaction_id: "TX123",
      };

      // mock booking found
      (mockedDb.select as jest.Mock).mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([{ booking_id: 2, user_id: userId }]),
        }),
      });

      // mock inserted payment
      const mockInsertedPayment = { payment_id: 1, ...paymentData, created_at: new Date(), updated_at: new Date() };
      (mockedDb.insert as jest.Mock).mockReturnValueOnce({
        values: () => ({
          returning: () => Promise.resolve([mockInsertedPayment]),
        }),
      });

      const result = await paymentService.createPayment(paymentData as any, userId);
      expect(result).toEqual(mockInsertedPayment);
    });
  });

  describe("getAllPayments", () => {
    it("should return all payments", async () => {
      const mockPayments = [{ payment_id: 1 }, { payment_id: 2 }];
      (mockedDb.select as jest.Mock).mockReturnValueOnce({
        from: () => Promise.resolve(mockPayments),
      });

      const result = await paymentService.getAllPayments();
      expect(result).toEqual(mockPayments);
    });
  });

  describe("getPaymentsByUser", () => {
    it("should return payments for a specific user", async () => {
      const mockJoinedPayments = [
        {
          payments: {
            payment_id: 1,
            booking_id: 2,
            amount: "100.00",
            payment_status: "Paid",
            payment_date: new Date(),
            payment_method: "Mpesa",
            transaction_id: "XYZ789",
            created_at: new Date(),
            updated_at: new Date(),
          },
          bookings: {
            booking_id: 2,
            user_id: 1,
          },
        },
      ];

      (mockedDb.select as jest.Mock).mockReturnValueOnce({
        from: () => ({
          innerJoin: () => ({
            where: () => Promise.resolve(mockJoinedPayments),
          }),
        }),
      });

      const result = await paymentService.getPaymentsByUser(1);
      expect(result).toEqual(mockJoinedPayments);
    });
  });
});
