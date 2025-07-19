// import "dotenv/config";
// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//     dialect: "postgresql", // means we are using PostgreSQL
//     schema: "./src/Drizzle/schema.ts", // path to the schema file
//     out: "./src/Drizzle/migrations", // path to the migrations folder
//     dbCredentials: { // database connection details
//         url: process.env.Database_URL as string
//     },
//     verbose: true, // enables detailed logging
//     strict: true, // enables strict mode for type safety, i.e. it will throw an error if there are any issues with the schema
// });



import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/Drizzle/schema.ts",
  out: "./src/Drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL as string, 
  },
  verbose: true,
  strict: true,
});
