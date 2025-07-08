import express from "express";
import {
  getAllUsers,
  getProfile,
  updateProfile,
  deleteUser,
} from "./user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// Authenticated user: View their own profile
router.get("/me", authenticate, getProfile);

// Authenticated user: Update their own profile
router.put("/me", authenticate, updateProfile);

// Admin only: View all users
router.get("/", authenticate, getAllUsers);

// Admin only: Delete a user by ID
router.delete("/:id", authenticate, deleteUser);

export default router;
