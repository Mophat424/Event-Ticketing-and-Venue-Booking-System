import * as venueService from "../../src/Venues/venue.service";

jest.mock("../../src/Drizzle/db", () => {
  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockResolvedValue([{ venue_id: 1, name: "Venue A" }]),

    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ venue_id: 2, name: "New Venue" }]),

    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue({ rowCount: 1 }),
      }),
    }),

    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({ rowCount: 1 }),
    }),
  };

  return {
    __esModule: true,
    default: mockDb,
  };
});

describe("Venue Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllVenues", () => {
    it("should return all venues", async () => {
      const result = await venueService.getAllVenues();
      expect(result).toEqual([{ venue_id: 1, name: "Venue A" }]);
    });
  });

  describe("createVenue", () => {
    it("should create a new venue and return it", async () => {
      const data = { name: "New Venue", location: "City", capacity: 500 } as any;
      const result = await venueService.createVenue(data);
      expect(result).toEqual({ venue_id: 2, name: "New Venue" });
    });
  });

  describe("updateVenue", () => {
    it("should return true if update was successful", async () => {
      const result = await venueService.updateVenue(1, { name: "Updated Name" });
      expect(result).toBe(true);
    });

    it("should return false if update failed", async () => {
      const db = require("../../src/Drizzle/db").default;
      const updateMock = db.update().set();
      updateMock.where.mockResolvedValueOnce({ rowCount: 0 });

      const result = await venueService.updateVenue(99, { name: "None" });
      expect(result).toBe(false);
    });
  });

  describe("deleteVenue", () => {
    it("should return true if delete was successful", async () => {
      const result = await venueService.deleteVenue(1);
      expect(result).toBe(true);
    });

    it("should return false if delete failed", async () => { 
      const db = require("../../src/Drizzle/db").default;
      const deleteMock = db.delete();
      deleteMock.where.mockResolvedValueOnce({ rowCount: 0 });

      const result = await venueService.deleteVenue(99);
      expect(result).toBe(false);
    });
  });
});
