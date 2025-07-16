import { connectDb, disconnectDb } from "../src/Drizzle/db";

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  await disconnectDb();
});
