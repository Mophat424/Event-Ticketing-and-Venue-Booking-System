import * as userService from "../../src/Users/user.service";
import db from "../../src/Drizzle/db";
import { users } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe("User Service", () => {
  const mockUser = { user_id: 1, name: "Test User" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("returns all users", async () => {
      const from = jest.fn().mockResolvedValue([mockUser]);
      (db.select as jest.Mock).mockReturnValue({ from });

      const result = await userService.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("returns a user when found", async () => {
      const where = jest.fn().mockResolvedValue([mockUser]);
      const from = jest.fn().mockReturnValue({ where });
      (db.select as jest.Mock).mockReturnValue({ from });

      const result = await userService.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it("returns undefined when not found", async () => {
      const where = jest.fn().mockResolvedValue([]);
      const from = jest.fn().mockReturnValue({ where });
      (db.select as jest.Mock).mockReturnValue({ from });

      const result = await userService.getUserById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updateUser", () => {
    it("updates and returns user", async () => {
      const returning = jest.fn().mockResolvedValue([mockUser]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });
      (db.update as jest.Mock).mockReturnValue({ set });

      const result = await userService.updateUser(1, { first_name: "Updated" });
      expect(result).toEqual(mockUser);
    });

    it("returns undefined if no user returned", async () => {
      const returning = jest.fn().mockResolvedValue([]);
      const where = jest.fn().mockReturnValue({ returning });
      const set = jest.fn().mockReturnValue({ where });
      (db.update as jest.Mock).mockReturnValue({ set });

      const result = await userService.updateUser(2, { first_name: "None" });
      expect(result).toBeUndefined();
    });
  });

  describe("deleteUser", () => {
    it("returns true if user was deleted", async () => {
      const where = jest.fn().mockResolvedValue({ rowCount: 1 });
      (db.delete as jest.Mock).mockReturnValue({ where });

      const result = await userService.deleteUser(1);
      expect(result).toBe(true);
    });

    it("returns false if user not found", async () => {
      const where = jest.fn().mockResolvedValue({ rowCount: 0 });
      (db.delete as jest.Mock).mockReturnValue({ where });

      const result = await userService.deleteUser(999);
      expect(result).toBe(false);
    });

    it("returns false if rowCount is null", async () => {
      const where = jest.fn().mockResolvedValue({ rowCount: null });
      (db.delete as jest.Mock).mockReturnValue({ where });

      const result = await userService.deleteUser(3);
      expect(result).toBe(false);
    });
  });
});
