// import { Request, Response } from "express";
// import db from "../Drizzle/db";
// import { users } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// // GET /users
// export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const allUsers = await db.select().from(users);
//     res.status(200).json(allUsers);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // GET /users/:id
// export const getUserById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);
//     const user = await db.select().from(users).where(eq(users.user_id, id));

//     if (!user.length) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json(user[0]);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // POST /users
// export const createUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const newUser = req.body;
//     const inserted = await db.insert(users).values(newUser).returning();
//     res.status(201).json(inserted[0]);
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // PUT /users/:id
// export const updateUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);
//     const updates = req.body;

//     const updated = await db.update(users)
//       .set(updates)
//       .where(eq(users.user_id, id))
//       .returning();

//     if (!updated.length) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json(updated[0]);
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // DELETE /users/:id
// export const deleteUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id);

//     const deleted = await db.delete(users)
//       .where(eq(users.user_id, id))
//       .returning();

//     if (!deleted.length) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



//AUTH
import { Request, Response } from "express";
import * as userService from "./user.service";
import { JwtPayload } from "jsonwebtoken";

// Extend request to include user info
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id?: number; role?: string };
}

// Admin: Get all users
export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can view all users" });
      return;
    }

    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get current user profile (self)
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await userService.getUserById(userId!);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update own profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const updatedUser = await userService.updateUser(userId!, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Delete any user
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Only admins can delete users" });
      return;
    }

    const userId = parseInt(req.params.id);
    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
