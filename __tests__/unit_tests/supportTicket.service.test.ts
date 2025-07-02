import * as ticketService from "../../src/Tickets/supportTicket.service";
import db from "../../src/Drizzle/db";
import { supportTickets } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  delete: jest.fn(),
}));

const mockedDb = db as jest.Mocked<typeof db>;

describe("Support Ticket Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTicket", () => {
    it("should insert and return a new ticket", async () => {
      const ticketData = { subject: "Issue", message: "Help!", user_id: 1 };
      const mockInserted = { ...ticketData, ticket_id: 1 };

      (mockedDb.insert as any).mockReturnValueOnce({
        values: () => ({
          returning: () => Promise.resolve([mockInserted]),
        }),
      });

      const result = await ticketService.createTicket(ticketData as any);
      expect(result).toEqual(mockInserted);
    });
  });

  describe("getAllTickets", () => {
    it("should return all support tickets", async () => {
      const mockTickets = [{ ticket_id: 1 }, { ticket_id: 2 }];

      (mockedDb.select as any).mockReturnValueOnce({
        from: () => Promise.resolve(mockTickets),
      });

      const result = await ticketService.getAllTickets();
      expect(result).toEqual(mockTickets);
    });
  });

  describe("getTicketsByUser", () => {
    it("should return tickets for a specific user", async () => {
      const userId = 1;
      const mockTickets = [{ ticket_id: 1, user_id: userId }];

      (mockedDb.select as any).mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve(mockTickets),
        }),
      });

      const result = await ticketService.getTicketsByUser(userId);
      expect(result).toEqual(mockTickets);
    });
  });

  describe("deleteTicket", () => {
    it("should delete ticket as admin", async () => {
      const ticketId = 1;
      const userId = 99;

      (mockedDb.delete as any).mockReturnValueOnce({
        where: () => Promise.resolve(),
      });

      const result = await ticketService.deleteTicket(ticketId, userId, true);
      expect(result).toBe(true);
    });

    it("should return false if non-admin tries to delete ticket not theirs", async () => {
      const ticketId = 1;
      const userId = 2;

      (mockedDb.select as any).mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([{ ticket_id: ticketId, user_id: 3 }]), // not user's ticket
        }),
      });

      const result = await ticketService.deleteTicket(ticketId, userId, false);
      expect(result).toBe(false);
    });

    it("should delete ticket if user is the owner", async () => {
      const ticketId = 1;
      const userId = 2;

      (mockedDb.select as any).mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([{ ticket_id: ticketId, user_id: userId }]),
        }),
      });

      (mockedDb.delete as any).mockReturnValueOnce({
        where: () => Promise.resolve(),
      });

      const result = await ticketService.deleteTicket(ticketId, userId, false);
      expect(result).toBe(true);
    });

    it("should return false if ticket not found", async () => {
      (mockedDb.select as any).mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      });

      const result = await ticketService.deleteTicket(99, 1, false);
      expect(result).toBe(false);
    });
  });
});
