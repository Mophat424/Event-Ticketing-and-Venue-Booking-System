import * as bookingService from "../../src/Bookings/booking.service";
import db from "../../src/Drizzle/db";

// Mocking the Drizzle db
jest.mock("../../src/Drizzle/db", () => ({
  __esModule: true,
  default: {
    insert: jest.fn(),
    select: jest.fn(),
    delete: jest.fn(),
  },
}));


describe("Booking Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create a booking and return it", async () => {
      const mockData = {
        user_id: 1,
        event_id: 2,
        quantity: 2,
        total_amount: "100.00",
      };

      const mockReturn = { ...mockData, booking_id: 99 };
      (db.insert as jest.Mock).mockReturnValue({
        values: () => ({
          returning: () => Promise.resolve([mockReturn]),
        }),
      });

      const result = await bookingService.createBooking(mockData as any);
      expect(result).toEqual(mockReturn);
    });
  });

  describe("getAllBookings", () => {
    it("should return all bookings", async () => {
      const mockBookings = [{ booking_id: 1 }, { booking_id: 2 }];
      (db.select as jest.Mock).mockReturnValue({
        from: () => Promise.resolve(mockBookings),
      });

      const result = await bookingService.getAllBookings();
      expect(result).toEqual(mockBookings);
    });
  });

  describe("getBookingsByUser", () => {
    it("should return bookings for a specific user", async () => {
      const mockUserId = 1;
      const mockUserBookings = [{ booking_id: 1, user_id: mockUserId }];
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => Promise.resolve(mockUserBookings),
        }),
      });

      const result = await bookingService.getBookingsByUser(mockUserId);
      expect(result).toEqual(mockUserBookings);
    });
  });

  describe("deleteBooking", () => {
    it("should allow admin to delete booking", async () => {
      const mockBookingId = 1;
      (db.delete as jest.Mock).mockReturnValue({
        where: () => Promise.resolve(),
      });

      const result = await bookingService.deleteBooking(mockBookingId, 999, true);
      expect(result).toBe(true);
    });

    it("should allow user to delete own booking", async () => {
      const mockBooking = { booking_id: 1, user_id: 5 };
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => Promise.resolve([mockBooking]),
        }),
      });
      (db.delete as jest.Mock).mockReturnValue({
        where: () => Promise.resolve(),
      });

      const result = await bookingService.deleteBooking(1, 5, false);
      expect(result).toBe(true);
    });

    it("should not allow user to delete other's booking", async () => {
      const mockBooking = { booking_id: 1, user_id: 9 };
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: () => Promise.resolve([mockBooking]),
        }),
      });

      const result = await bookingService.deleteBooking(1, 5, false);
      expect(result).toBe(false);
    });
  });
});
