import { createTicket, getTickets, deleteTicket } from "../../src/Tickets/supportTicket.controller";
import * as ticketService from "../../src/Tickets/supportTicket.service";
import { Request, Response } from "express";

jest.mock("../../src/Tickets/supportTicket.service");

const mockReq = {} as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

describe("Support Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTicket", () => {
    it("should create a ticket and return 201", async () => {
      const req = {
        body: { subject: "Login Issue", message: "Can't login" },
        user: { id: 1 },
      } as any;

      const newTicket = { ticket_id: 1, ...req.body, user_id: 1 };

      (ticketService.createTicket as jest.Mock).mockResolvedValue(newTicket);

      await createTicket(req, mockRes);

      expect(ticketService.createTicket).toHaveBeenCalledWith({ ...req.body, user_id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(newTicket);
    });

    it("should handle errors", async () => {
      const req = { body: {}, user: { id: 1 } } as any;
      (ticketService.createTicket as jest.Mock).mockRejectedValue(new Error("DB error"));

      await createTicket(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("getTickets", () => {
    it("should return all tickets if admin", async () => {
      const req = { user: { role: "admin" } } as any;
      const tickets = [{ ticket_id: 1 }, { ticket_id: 2 }];
      (ticketService.getAllTickets as jest.Mock).mockResolvedValue(tickets);

      await getTickets(req, mockRes);

      expect(ticketService.getAllTickets).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(tickets);
    });

    it("should return user-specific tickets", async () => {
      const req = { user: { id: 5, role: "user" } } as any;
      const userTickets = [{ ticket_id: 1, user_id: 5 }];
      (ticketService.getTicketsByUser as jest.Mock).mockResolvedValue(userTickets);

      await getTickets(req, mockRes);

      expect(ticketService.getTicketsByUser).toHaveBeenCalledWith(5);
      expect(mockRes.json).toHaveBeenCalledWith(userTickets);
    });

    it("should handle error in getTickets", async () => {
      const req = { user: { id: 1, role: "user" } } as any;
      (ticketService.getTicketsByUser as jest.Mock).mockRejectedValue(new Error("DB error"));

      await getTickets(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("deleteTicket", () => {
    it("should delete a ticket if authorized", async () => {
      const req = {
        params: { id: "1" },
        user: { id: 5, role: "admin" },
      } as any;

      (ticketService.deleteTicket as jest.Mock).mockResolvedValue(true);

      await deleteTicket(req, mockRes);

      expect(ticketService.deleteTicket).toHaveBeenCalledWith(1, 5, true);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Ticket deleted successfully" });
    });

    it("should return 403 if not authorized", async () => {
      const req = {
        params: { id: "1" },
        user: { id: 2, role: "user" },
      } as any;

      (ticketService.deleteTicket as jest.Mock).mockResolvedValue(false);

      await deleteTicket(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Not authorized to delete this ticket" });
    });

    it("should handle delete errors", async () => {
      const req = {
        params: { id: "1" },
        user: { id: 2, role: "user" },
      } as any;

      (ticketService.deleteTicket as jest.Mock).mockRejectedValue(new Error("DB crash"));

      await deleteTicket(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
