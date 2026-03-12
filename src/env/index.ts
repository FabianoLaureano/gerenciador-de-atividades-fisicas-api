import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().default("http://localhost:3333"),
  JWT_SECRET: z.string(),
  BACKEND_URL: z.string(),
});

export const _env = envSchema.safeParse(process.env); // tenta validar para ver se tem as informações acima

if (_env.success === false) {
  console.error("❌ Invalid environment variables", z.treeifyError(_env.error));
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
