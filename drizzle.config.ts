import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
config({ path: '.env' });
export default defineConfig({
  schema: "./utils/schema.tsx",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:bWFtCEVpl47n@ep-super-wave-a5hejufy.us-east-2.aws.neon.tech/AI%20Content%20Crafter?sslmode=require",
  },
});