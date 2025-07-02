import {
  getAllUsers,
  getProfile,
  updateProfile,
  deleteUser,
} from "../../src/Users/user.controller";
import * as userService from "../../src/Users/user.service";
import { Request, Response } from "express";

jest.mock("../../src/Users/user.service");

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return 403 if user is not admin", async () => {
      const req = { user: { role: "user" } } as any;

      await getAllUsers(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Only admins can view all users" });
    });

    it("should return all users for admin", async () => {
      const req = { user: { role: "admin" } } as any;
      const usersList = [{ id: 1 }, { id: 2 }];
      (userService.getAllUsers as jest.Mock).mockResolvedValue(usersList);

      await getAllUsers(req, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(usersList);
    });

    it("should handle error in getAllUsers", async () => {
      const req = { user: { role: "admin" } } as any;
      (userService.getAllUsers as jest.Mock).mockRejectedValue(new Error("Database error"));

      await getAllUsers(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("getProfile", () => {
    it("should return the user profile", async () => {
      const req = { user: { id: 1 } } as any;
      const mockUser = { id: 1, name: "John" };
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await getProfile(req, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user is not found", async () => {
      const req = { user: { id: 2 } } as any;
      (userService.getUserById as jest.Mock).mockResolvedValue(undefined);

      await getProfile(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle error in getProfile", async () => {
      const req = { user: { id: 3 } } as any;
      (userService.getUserById as jest.Mock).mockRejectedValue(new Error("Unexpected"));

      await getProfile(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("updateProfile", () => {
    it("should update the user and return updated profile", async () => {
      const req = { user: { id: 1 }, body: { name: "Updated" } } as any;
      const updatedUser = { id: 1, name: "Updated" };
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await updateProfile(req, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(1, { name: "Updated" });
      expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 404 if user is not found", async () => {
      const req = { user: { id: 2 }, body: { name: "New" } } as any;
      (userService.updateUser as jest.Mock).mockResolvedValue(undefined);

      await updateProfile(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle error in updateProfile", async () => {
      const req = { user: { id: 3 }, body: { name: "X" } } as any;
      (userService.updateUser as jest.Mock).mockRejectedValue(new Error("Oops"));

      await updateProfile(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("deleteUser", () => {
    it("should return 403 if user is not admin", async () => {
      const req = { user: { role: "user" } } as any;

      await deleteUser(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Only admins can delete users" });
    });

    it("should delete user and return success", async () => {
      const req = { user: { role: "admin" }, params: { id: "1" } } as any;
      (userService.deleteUser as jest.Mock).mockResolvedValue(true);

      await deleteUser(req, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });

    it("should return 404 if user to delete is not found", async () => {
      const req = { user: { role: "admin" }, params: { id: "99" } } as any;
      (userService.deleteUser as jest.Mock).mockResolvedValue(false);

      await deleteUser(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle error in deleteUser", async () => {
      const req = { user: { role: "admin" }, params: { id: "3" } } as any;
      (userService.deleteUser as jest.Mock).mockRejectedValue(new Error("Failed"));

      await deleteUser(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
