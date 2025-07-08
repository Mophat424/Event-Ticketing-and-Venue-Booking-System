import db from "../Drizzle/db";
import { users } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

// Get all users (admin only)
export const getAllUsers = () => {
  return db.select().from(users);
};

// Get user by ID
export const getUserById = (userId: number) => {
  return db
    .select()
    .from(users)
    .where(eq(users.user_id, userId))
    .then(([user]) => user);
};

// Update user
export const updateUser = (userId: number, data: Partial<typeof users.$inferInsert>) => {
  return db
    .update(users)
    .set({ ...data, updated_at: new Date() })
    .where(eq(users.user_id, userId))
    .returning()
    .then(([user]) => user);
};

// Delete user (admin only)
export const deleteUser = (userId: number) => {
  return db
    .delete(users)
    .where(eq(users.user_id, userId))
    .then((res) => (res.rowCount != null ? res.rowCount > 0 : false));
};