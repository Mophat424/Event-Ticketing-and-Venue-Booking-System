import request from "supertest";
import express, { Application } from "express";
import * as venueController from "../../src/Venues/venue.controller";
import * as venueService from "../../src/Venues/venue.service";

const app: Application = express();
app.use(express.json());

// Routes setup
app.post("/venues", mockAuth("admin"), venueController.createVenue);
app.get("/venues", venueController.getVenues);
app.put("/venues/:id", mockAuth("admin"), venueController.updateVenue);
app.delete("/venues/:id", mockAuth("admin"), venueController.deleteVenue);

// Mock middleware to simulate authentication
function mockAuth(role: string) {
  return (req: any, _res: any, next: any) => {
    req.user = { id: 1, role };
    next();
  };
}

jest.mock("../../src/Venues/venue.service");

describe("Venue Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /venues", () => {
    it("should create a new venue if admin", async () => {
      const mockVenue = { venue_id: 1, name: "New Venue" };
      (venueService.createVenue as jest.Mock).mockResolvedValue(mockVenue);

      const res = await request(app)
        .post("/venues")
        .send({ name: "New Venue", location: "City", capacity: 500 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockVenue);
    });

    it("should forbid non-admin users", async () => {
      const userApp = express();
      userApp.use(express.json());
      userApp.post("/venues", mockAuth("user"), venueController.createVenue);

      const res = await request(userApp)
        .post("/venues")
        .send({ name: "Fail Venue" });

      expect(res.status).toBe(403);
    });
  });

  describe("GET /venues", () => {
    it("should return all venues", async () => {
      const mockVenues = [{ venue_id: 1, name: "Venue A" }];
      (venueService.getAllVenues as jest.Mock).mockResolvedValue(mockVenues);

      const res = await request(app).get("/venues");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockVenues);
    });
  });

  describe("PUT /venues/:id", () => {
    it("should update a venue successfully", async () => {
      (venueService.updateVenue as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .put("/venues/1")
        .send({ name: "Updated Venue" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(true);
    });

    it("should return 404 if venue not found", async () => {
      (venueService.updateVenue as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .put("/venues/99")
        .send({ name: "Unknown" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /venues/:id", () => {
    it("should delete a venue successfully", async () => {
      (venueService.deleteVenue as jest.Mock).mockResolvedValue(true);

      const res = await request(app).delete("/venues/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Venue deleted successfully" });
    });

    it("should return 404 if venue not found", async () => {
      (venueService.deleteVenue as jest.Mock).mockResolvedValue(false);

      const res = await request(app).delete("/venues/99");

      expect(res.status).toBe(404);
    });
  });
});
