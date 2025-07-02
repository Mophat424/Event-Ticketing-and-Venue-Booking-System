import { Request, Response } from "express";
import * as eventController from "../../src/Events/event.controller";
import * as eventService from "../../src/Events/event.service";

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Event Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fullMockEvent = {
    event_id: 1,
    title: "Updated Event",
    description: null,
    venue_id: null,
    category: null,
    date: null,
    time: null,
    ticket_price: null,
    tickets_total: null,
    tickets_sold: null,
    created_at: null,
    updated_at: null,
  };

  describe("createEvent", () => {
    it("should create event if admin", async () => {
      const req = {
        user: { role: "admin" },
        body: { title: "New Event" },
      } as any;
      const res = mockResponse();

      jest.spyOn(eventService, "createEvent").mockResolvedValue(fullMockEvent);

      await eventController.createEvent(req, res);

      expect(eventService.createEvent).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fullMockEvent);
    });

    it("should forbid non-admin from creating event", async () => {
      const req = { user: { role: "user" }, body: {} } as any;
      const res = mockResponse();

      await eventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Only admins can create events" });
    });
  });

  describe("getEvents", () => {
    it("should fetch all events", async () => {
      const req = {} as Request;
      const res = mockResponse();

      jest.spyOn(eventService, "getAllEvents").mockResolvedValue([fullMockEvent]);

      await eventController.getEvents(req, res);

      expect(res.json).toHaveBeenCalledWith([fullMockEvent]);
    });
  });

  describe("updateEvent", () => {
    it("should update event if admin", async () => {
      const req = {
        user: { role: "admin" },
        params: { id: "1" },
        body: { title: "Changed Title" },
      } as any;
      const res = mockResponse();

      jest.spyOn(eventService, "updateEvent").mockResolvedValue(fullMockEvent);

      await eventController.updateEvent(req, res);

      expect(eventService.updateEvent).toHaveBeenCalledWith(1, req.body);
      expect(res.json).toHaveBeenCalledWith(fullMockEvent);
    });

    it("should return 404 if event not found", async () => {
      const req = {
        user: { role: "admin" },
        params: { id: "1" },
        body: {},
      } as any;
      const res = mockResponse();

      
    jest.spyOn(eventService, "updateEvent").mockResolvedValue(undefined as any);


      await eventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
    });

    it("should forbid non-admin from updating", async () => {
      const req = { user: { role: "user" } } as any;
      const res = mockResponse();

      await eventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Only admins can update events" });
    });
  });

  describe("deleteEvent", () => {
    it("should delete event if admin", async () => {
      const req = {
        user: { role: "admin" },
        params: { id: "1" },
      } as any;
      const res = mockResponse();

      jest.spyOn(eventService, "deleteEvent").mockResolvedValue(true);

      await eventController.deleteEvent(req, res);

      expect(eventService.deleteEvent).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully" });
    });

    it("should return 404 if event to delete is not found", async () => {
      const req = {
        user: { role: "admin" },
        params: { id: "1" },
      } as any;
      const res = mockResponse();

      jest.spyOn(eventService, "deleteEvent").mockResolvedValue(false);

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
    });

    it("should forbid non-admin from deleting", async () => {
      const req = { user: { role: "user" } } as any;
      const res = mockResponse();

      await eventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Only admins can delete events" });
    });
  });
});
