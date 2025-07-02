import * as eventService from "../../src/Events/event.service";
import db from "../../src/Drizzle/db";

// 🧪 Mock the Drizzle DB
jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe("Event Service", () => {
  afterEach(() => jest.clearAllMocks());

  it("should create an event", async () => {
    const mockData = { title: "Music Fest", venue_id: 1 } as any;
    const mockEvent = { event_id: 1, ...mockData };

    (db.insert as jest.Mock).mockReturnValue({
      values: () => ({
        returning: () => Promise.resolve([mockEvent]),
      }),
    });

    const result = await eventService.createEvent(mockData);
    expect(result).toEqual(mockEvent);
  });

  it("should return all events", async () => {
    const mockEvents = [{ event_id: 1 }, { event_id: 2 }];
    (db.select as jest.Mock).mockReturnValue({
      from: () => Promise.resolve(mockEvents),
    });

    const result = await eventService.getAllEvents();
    expect(result).toEqual(mockEvents);
  });

  it("should update an event", async () => {
    const updatedEvent = { event_id: 1, title: "Updated Title" };
    (db.update as jest.Mock).mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([updatedEvent]),
        }),
      }),
    });

    const result = await eventService.updateEvent(1, { title: "Updated Title" });
    expect(result).toEqual(updatedEvent);
  });

  it("should delete an event and return true", async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: () => Promise.resolve({ rowCount: 1 }),
    });

    const result = await eventService.deleteEvent(1);
    expect(result).toBe(true);
  });

  it("should return false if delete affects no rows", async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: () => Promise.resolve({ rowCount: 0 }),
    });

    const result = await eventService.deleteEvent(999);
    expect(result).toBe(false);
  });
});
