// import  db  from "../Drizzle/db";
// import { users } from "../Drizzle/schema";
// import { eq } from "drizzle-orm";

// export const getAllUsers = () => db.select().from(users);

// export const getUserById = (id: number) =>
//   db.select().from(users).where(eq(users.user_id, id)).then(([u]) => u);

// export const createUser = (data: typeof users.$inferInsert) =>
//   db.insert(users).values(data).returning().then(([u]) => u);

// export const updateUser = (id: number, data: Partial<typeof users.$inferInsert>) =>
//   db.update(users).set(data).where(eq(users.user_id, id)).returning().then(([u]) => u);

// export const deleteUser = (id: number) =>
//   db.delete(users).where(eq(users.user_id, id));



//AUTH
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