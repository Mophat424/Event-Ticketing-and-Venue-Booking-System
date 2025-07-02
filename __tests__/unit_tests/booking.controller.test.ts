import { createBooking, getBookings, deleteBooking } from "../../src/Bookings/booking.controller";
import * as bookingService from "../../src/Bookings/booking.service";
import { Request, Response } from "express";

jest.mock("../../src/Bookings/booking.service");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe("Booking Controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createBooking", () => {
    it("should return 201 on successful booking", async () => {
      const req = {
        body: {
          event_id: 1,
          quantity: 2,
          total_amount: "100.00",
        },
        user: { id: 10 },
      } as any;

      const res = mockResponse();
      const mockCreated = { ...req.body, user_id: 10, booking_id: 1 };

      (bookingService.createBooking as jest.Mock).mockResolvedValue(mockCreated);

      await createBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreated);
    });

    it("should return 500 on service error", async () => {
      const req = { body: {}, user: { id: 1 } } as any;
      const res = mockResponse();

      (bookingService.createBooking as jest.Mock).mockRejectedValue(new Error("DB error"));

      await createBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("getBookings", () => {
    it("should return all bookings for admin", async () => {
      const req = { user: { role: "admin" } } as any;
      const res = mockResponse();
      const mockData = [{ booking_id: 1 }, { booking_id: 2 }];

      (bookingService.getAllBookings as jest.Mock).mockResolvedValue(mockData);

      await getBookings(req, res);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should return user bookings", async () => {
      const req = { user: { id: 5, role: "user" } } as any;
      const res = mockResponse();
      const mockData = [{ booking_id: 3, user_id: 5 }];

      (bookingService.getBookingsByUser as jest.Mock).mockResolvedValue(mockData);

      await getBookings(req, res);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle errors", async () => {
      const req = { user: { role: "admin" } } as any;
      const res = mockResponse();

      (bookingService.getAllBookings as jest.Mock).mockRejectedValue(new Error("Fetch error"));

      await getBookings(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("deleteBooking", () => {
    it("should allow admin to delete", async () => {
      const req = {
        params: { id: "5" },
        user: { id: 1, role: "admin" },
      } as any;
      const res = mockResponse();

      (bookingService.deleteBooking as jest.Mock).mockResolvedValue(true);

      await deleteBooking(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Booking deleted successfully" });
    });

    it("should deny delete if not authorized", async () => {
      const req = {
        params: { id: "10" },
        user: { id: 2, role: "user" },
      } as any;
      const res = mockResponse();

      (bookingService.deleteBooking as jest.Mock).mockResolvedValue(false);

      await deleteBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized to delete this booking" });
    });

    it("should handle delete errors", async () => {
      const req = {
        params: { id: "1" },
        user: { id: 1, role: "admin" },
      } as any;
      const res = mockResponse();

      (bookingService.deleteBooking as jest.Mock).mockRejectedValue(new Error("Delete fail"));

      await deleteBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
