import db from "../Drizzle/db";
import { users } from "../Drizzle/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "./email";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// REGISTER USER
export const registerUser = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  contact_phone?: string;
  address?: string;
  role?: string;
}) => {
  // Role validation
  const normalizedRole =
    data.role?.toLowerCase() === "admin" ? "admin" : "user";

  if (data.role && !["admin", "user"].includes(normalizedRole)) {
    throw new Error("Invalid role specified");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      contact_phone: data.contact_phone ?? "",
      address: data.address ?? "",
      role: normalizedRole,
    } satisfies typeof users.$inferInsert)
    .returning();

  if (!newUser?.email || !newUser?.first_name) {
    throw new Error("User creation failed");
  }

  await sendWelcomeEmail(newUser.email, newUser.first_name);

  const token = jwt.sign(
    { id: newUser.user_id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    message: "User registered successfully",
    token,
    user: {
      id: newUser.user_id,
      email: newUser.email,
      name: `${newUser.first_name} ${newUser.last_name}`,
      role: newUser.role,
    },
  };
};

// LOGIN USER
export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: any }> => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.user_id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    },
  };
};
