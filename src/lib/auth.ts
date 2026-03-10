import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { prisma } from "../lib/db.js";
import { env } from "../env/index.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".vercel.app",
    },
    cookieOptions: {
      sameSite: "none",
      secure: true,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://gerenciador-de-atividades-fisicas-f.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [openAPI()],
});
