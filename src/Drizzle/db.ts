import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export const client = new Client({
  // connectionString: process.env.Database_URL!,
  connectionString: process.env.DATABASE_URL!

});

export const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};

export const disconnectDb = async () => {
  await client.end();
  console.log("Disconnected from database");
};

const db = drizzle(client, { schema, logger: true });
export default db;



