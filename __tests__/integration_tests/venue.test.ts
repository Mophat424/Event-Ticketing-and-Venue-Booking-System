import request from "supertest";
import { app } from "../../src/index";
import * as venueService from "../../src/Venues/venue.service";

jest.mock("../../src/middleware/auth.middleware", () => ({
  authenticate: (
    req: import("express").Request,
    _res: import("express").Response,
    next: import("express").NextFunction
  ) => {
    const auth = req.headers.authorization || "";
    (req as any).user = {
      id: 1,
      role: auth.includes("admin") ? "admin" : "user",
      email: "test@example.com",
    };
    next();
  },
  authorizeRole: () => (
    _req: import("express").Request,
    _res: import("express").Response,
    next: import("express").NextFunction
  ) => next(),
}));

jest.mock("../../src/Venues/venue.service");

const mockAdminToken = "Bearer admin";
const mockUserToken = "Bearer user";

describe("Venue Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /venues", () => {
    it("should return all venues", async () => {
      const mockVenues = [
        { venue_id: 1, name: "Stadium", address: "123 Street", capacity: 1000 },
      ];
      (venueService.getAllVenues as jest.Mock).mockResolvedValue(mockVenues);

      const res = await request(app).get("/venues");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockVenues);
    });
  });

  describe("POST /venues", () => {
    it("should create a venue if user is admin", async () => {
      const newVenue = { name: "New Venue", address: "456 Road", capacity: 500 };
      const createdVenue = { venue_id: 2, ...newVenue };

      (venueService.createVenue as jest.Mock).mockResolvedValue(createdVenue);

      const res = await request(app)
        .post("/venues")
        .set("Authorization", mockAdminToken)
        .send(newVenue);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdVenue);
    });

    it("should forbid non-admins", async () => {
      const res = await request(app)
        .post("/venues")
        .set("Authorization", mockUserToken)
        .send({ name: "Unauthorized", address: "789 Ave", capacity: 300 });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/only admins/i);
    });
  });

  describe("PUT /venues/:id", () => {
    it("should update a venue for admin", async () => {
      (venueService.updateVenue as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .put("/venues/1")
        .set("Authorization", mockAdminToken)
        .send({ name: "Updated Venue" });

      expect(res.status).toBe(200);
    });

    it("should return 404 if venue not found", async () => {
      (venueService.updateVenue as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .put("/venues/999")
        .set("Authorization", mockAdminToken)
        .send({ name: "Non-existent Venue" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /venues/:id", () => {
    it("should delete a venue for admin", async () => {
      (venueService.deleteVenue as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .delete("/venues/1")
        .set("Authorization", mockAdminToken);

      expect(res.status).toBe(200);
    });

    it("should return 404 if venue not found", async () => {
      (venueService.deleteVenue as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .delete("/venues/999")
        .set("Authorization", mockAdminToken);

      expect(res.status).toBe(404);
    });
  });
});
